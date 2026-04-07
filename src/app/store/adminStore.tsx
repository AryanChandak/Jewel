import {
  createContext, useContext, useReducer, useEffect,
  useCallback, type ReactNode,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { ENRICHED_CATALOG } from '../data/ringData';

// ─── Constants ────────────────────────────────────────────────────────────────
export const ADMIN_USERNAME = 'admin';
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string;

const PRODUCT_BUCKET  = 'product-images';
const CATEGORY_BUCKET = 'category-images';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminProduct {
  id:           number;
  name:         string;
  category:     string;
  style:        string;
  metal:        string;
  stone:        string;
  price:        number;
  description:  string;
  gender:       string;
  occasion:     string;
  personality:  string;
  design:       string;
  budget_range: string;
  sizeMin:      number;
  sizeMax:      number;
  images:       string[];
  inStock:      boolean;
  featured:     boolean;
  isCustom:     boolean;
  createdAt:    string;
  updatedAt:    string;
}

export interface CategoryImage {
  id:  number;
  url: string;
}

type ProductInput = Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>;

// ─── State / Reducer ──────────────────────────────────────────────────────────

interface AdminState {
  isAuthenticated: boolean;
  user:            User | null;
  products:        AdminProduct[];
  categoryImages:  Record<string, CategoryImage[]>;
  loading:         boolean;
  seeding:         boolean;
}

type Action =
  | { type: 'SET_AUTH';         user: User | null }
  | { type: 'SET_LOADING';      value: boolean }
  | { type: 'SET_SEEDING';      value: boolean }
  | { type: 'SET_PRODUCTS';     products: AdminProduct[] }
  | { type: 'SET_CAT_IMAGES';   images: Record<string, CategoryImage[]> }
  | { type: 'UPSERT_PRODUCT';   product: AdminProduct }
  | { type: 'REMOVE_PRODUCT';   id: number }
  | { type: 'ADD_CAT_IMAGES';   cat: string; imgs: CategoryImage[] }
  | { type: 'REMOVE_CAT_IMAGE'; cat: string; id: number };

function reducer(state: AdminState, action: Action): AdminState {
  switch (action.type) {
    case 'SET_AUTH':
      return { ...state, isAuthenticated: !!action.user, user: action.user };
    case 'SET_LOADING':
      return { ...state, loading: action.value };
    case 'SET_SEEDING':
      return { ...state, seeding: action.value };
    case 'SET_PRODUCTS':
      return { ...state, products: action.products };
    case 'SET_CAT_IMAGES':
      return { ...state, categoryImages: action.images };
    case 'UPSERT_PRODUCT': {
      const exists = state.products.some(p => p.id === action.product.id);
      return {
        ...state,
        products: exists
          ? state.products.map(p => p.id === action.product.id ? action.product : p)
          : [action.product, ...state.products],
      };
    }
    case 'REMOVE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.id) };
    case 'ADD_CAT_IMAGES': {
      const existing = state.categoryImages[action.cat] ?? [];
      return {
        ...state,
        categoryImages: { ...state.categoryImages, [action.cat]: [...existing, ...action.imgs] },
      };
    }
    case 'REMOVE_CAT_IMAGE': {
      const updated = (state.categoryImages[action.cat] ?? []).filter(img => img.id !== action.id);
      return {
        ...state,
        categoryImages: { ...state.categoryImages, [action.cat]: updated },
      };
    }
    default: return state;
  }
}

// ─── DB row helpers ───────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProduct(row: Record<string, any>): AdminProduct {
  return {
    id:           row.id,
    name:         row.name??'',
    category:     row.category??'Engagement',
    style:        row.style??'Solitaire',
    metal:        row.metal??'Gold',
    stone:        row.stone??'Diamond',
    price:        row.price??0,
    description:  row.description??'',
    gender:       row.gender??'Female',
    occasion:     row.occasion??'',
    personality:  row.personality??'Classic',
    design:       row.design??'',
    budget_range: row.budget_range??'20k-50k',
    sizeMin:      row.size_min??5,
    sizeMax:      row.size_max??20,
    images:       row.images??[],
    inStock:      row.in_stock??true,
    featured:     row.featured??false,
    isCustom:     row.is_custom??false,
    createdAt:    row.created_at??'',
    updatedAt:    row.updated_at??'',
  };
}

function productToRow(p: ProductInput) {
  return {
    name: p.name, category: p.category, style: p.style,
    metal: p.metal, stone: p.stone, price: p.price,
    description: p.description, gender: p.gender, occasion: p.occasion,
    personality: p.personality, design: p.design, budget_range: p.budget_range,
    size_min: p.sizeMin, size_max: p.sizeMax,
    images: p.images, in_stock: p.inStock, featured: p.featured, is_custom: false,
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AdminContextValue extends AdminState {
  login:               (username: string, password: string) => Promise<string | null>; // null = success, string = error message
  logout:              () => Promise<void>;
  addProduct:          (data: ProductInput) => Promise<void>;
  updateProduct:       (id: number, updates: Partial<ProductInput>) => Promise<void>;
  deleteProduct:       (id: number) => Promise<void>;
  uploadProductImage:  (file: File) => Promise<{ url: string | null; error: string | null }>;
  addCategoryImages:   (cat: string, files: File[]) => Promise<void>;
  deleteCategoryImage: (cat: string, imageId: number) => Promise<void>;
  changePassword:      (newPassword: string) => Promise<{ error: string | null }>;
  seedCatalog:         () => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider');
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    isAuthenticated: false,
    user:    null,
    products: [],
    categoryImages: {},
    loading: true,
    seeding: false,
  });

  // Load products + category images from DB
  const loadData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', value: true });
    try {
      const [prodRes, catRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('category_images').select('id, category, url').order('created_at', { ascending: true }),
      ]);
      dispatch({ type: 'SET_PRODUCTS', products: (prodRes.data ?? []).map(rowToProduct) });
      const catMap: Record<string, CategoryImage[]> = {};
      for (const row of catRes.data ?? []) {
        if (!catMap[row.category]) catMap[row.category] = [];
        catMap[row.category].push({ id: row.id, url: row.url });
      }
      dispatch({ type: 'SET_CAT_IMAGES', images: catMap });
    } finally {
      dispatch({ type: 'SET_LOADING', value: false });
    }
  }, []);

  // Restore session on mount + watch auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user ?? null;
      dispatch({ type: 'SET_AUTH', user });
      if (user) loadData();
      else dispatch({ type: 'SET_LOADING', value: false });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      dispatch({ type: 'SET_AUTH', user });
      if (user) loadData();
    });

    return () => subscription.unsubscribe();
  }, [loadData]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (username: string, password: string): Promise<string | null> => {
    const email = username.trim().toLowerCase() === ADMIN_USERNAME
      ? ADMIN_EMAIL
      : `${username.trim().toLowerCase()}@elegance.co`;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'SET_AUTH', user: null });
    dispatch({ type: 'SET_PRODUCTS', products: [] });
    dispatch({ type: 'SET_CAT_IMAGES', images: {} });
  }, []);

  // ── Products ──────────────────────────────────────────────────────────────
  const addProduct = useCallback(async (data: ProductInput) => {
    const { data: row, error } = await supabase
      .from('products').insert(productToRow(data)).select().single();
    if (!error && row) dispatch({ type: 'UPSERT_PRODUCT', product: rowToProduct(row) });
  }, []);

  const updateProduct = useCallback(async (id: number, updates: Partial<ProductInput>) => {
    const db: Record<string, unknown> = {};
    if (updates.name         != null) db.name         = updates.name;
    if (updates.category     != null) db.category     = updates.category;
    if (updates.style        != null) db.style        = updates.style;
    if (updates.metal        != null) db.metal        = updates.metal;
    if (updates.stone        != null) db.stone        = updates.stone;
    if (updates.price        != null) db.price        = updates.price;
    if (updates.description  != null) db.description  = updates.description;
    if (updates.gender       != null) db.gender       = updates.gender;
    if (updates.occasion     != null) db.occasion     = updates.occasion;
    if (updates.personality  != null) db.personality  = updates.personality;
    if (updates.design       != null) db.design       = updates.design;
    if (updates.budget_range != null) db.budget_range = updates.budget_range;
    if (updates.sizeMin      != null) db.size_min     = updates.sizeMin;
    if (updates.sizeMax      != null) db.size_max     = updates.sizeMax;
    if (updates.images       != null) db.images       = updates.images;
    if (updates.inStock      != null) db.in_stock     = updates.inStock;
    if (updates.featured     != null) db.featured     = updates.featured;

    const { data: row, error } = await supabase
      .from('products').update(db).eq('id', id).select().single();
    if (!error && row) dispatch({ type: 'UPSERT_PRODUCT', product: rowToProduct(row) });
  }, []);

  const deleteProduct = useCallback(async (id: number) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) dispatch({ type: 'REMOVE_PRODUCT', id });
  }, []);

  // ── Image storage ─────────────────────────────────────────────────────────
  const uploadProductImage = useCallback(async (file: File): Promise<{ url: string | null; error: string | null }> => {
    const ext  = file.name.split('.').pop() ?? 'jpg';
    const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(PRODUCT_BUCKET).upload(path, file);
    if (error) return { url: null, error: error.message };
    const url = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path).data.publicUrl;
    return { url, error: null };
  }, []);

  const addCategoryImages = useCallback(async (cat: string, files: File[]) => {
    const uploaded: CategoryImage[] = [];
    for (const file of files) {
      const ext  = file.name.split('.').pop() ?? 'jpg';
      const path = `${cat.toLowerCase()}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from(CATEGORY_BUCKET).upload(path, file);
      if (upErr) continue;
      const url = supabase.storage.from(CATEGORY_BUCKET).getPublicUrl(path).data.publicUrl;
      const { data: row, error: dbErr } = await supabase
        .from('category_images')
        .insert({ category: cat, url, storage_path: path })
        .select('id, url').single();
      if (!dbErr && row) uploaded.push({ id: row.id, url: row.url });
    }
    if (uploaded.length) dispatch({ type: 'ADD_CAT_IMAGES', cat, imgs: uploaded });
  }, []);

  const deleteCategoryImage = useCallback(async (cat: string, imageId: number) => {
    const { data: row } = await supabase
      .from('category_images').select('storage_path').eq('id', imageId).single();
    const { error } = await supabase.from('category_images').delete().eq('id', imageId);
    if (error) return;
    if (row?.storage_path) {
      await supabase.storage.from(CATEGORY_BUCKET).remove([row.storage_path]);
    }
    dispatch({ type: 'REMOVE_CAT_IMAGE', cat, id: imageId });
  }, []);

  // ── Settings ──────────────────────────────────────────────────────────────
  const changePassword = useCallback(async (newPassword: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error: error?.message ?? null };
  }, []);

  // ── Seed 60-ring catalog ──────────────────────────────────────────────────
  const seedCatalog = useCallback(async () => {
    dispatch({ type: 'SET_SEEDING', value: true });
    try {
      const rows = ENRICHED_CATALOG.map(r => ({
        name:         `${r.metal} ${r.style}${r.stone !== 'None' ? ' ' + r.stone : ''} Ring`,
        category:     r.category,
        style:        r.style,
        metal:        r.metal,
        stone:        r.stone,
        price:        r.price,
        description:  (r as { description?: string }).description ?? '',
        gender:       r.gender,
        occasion:     (r as { occasion?: string }).occasion ?? '',
        personality:  r.personality,
        design:       (r as { design?: string }).design ?? '',
        budget_range: r.budget_range,
        size_min:     5,
        size_max:     20,
        images:       r.image_url ? [r.image_url] : [],
        in_stock:     true,
        featured:     false,
        is_custom:    false,
      }));
      for (let i = 0; i < rows.length; i += 20) {
        await supabase.from('products').insert(rows.slice(i, i + 20));
      }
      await loadData();
    } finally {
      dispatch({ type: 'SET_SEEDING', value: false });
    }
  }, [loadData]);

  return (
    <AdminContext.Provider value={{
      ...state,
      login, logout,
      addProduct, updateProduct, deleteProduct,
      uploadProductImage,
      addCategoryImages, deleteCategoryImage,
      changePassword,
      seedCatalog,
    }}>
      {children}
    </AdminContext.Provider>
  );
}
