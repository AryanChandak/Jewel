import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

// ─── Types matching Supabase schema ───────────────────────────────────────────

export interface DBProduct {
  id: number;
  name: string;
  slug: string;
  category: string;
  style: string;
  metal: string;
  stone: string;
  price: number;
  description: string;
  gender: string;
  occasion: string;
  personality: string;
  design: string;
  budget_range: string;
  size_min: number;
  size_max: number;
  images: string[];
  in_stock: boolean;
  featured: boolean;
  is_custom: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBVariant {
  id: number;
  product_id: number;
  variant_id: string;
  title: string;
  metal_karat: string;
  diamond_type: string;
  price_inr: number;
  compare_price: number | null;
  sku: string;
  available: boolean;
}

// ─── Enriched type (matches the old EnrichedRing interface) ───────────────────

export interface Product extends DBProduct {
  image_url: string;
  rating: number;
  reviews: number;
  tags: string[];
}

function enrichProduct(p: DBProduct): Product {
  // Generate stable rating/reviews from id (same logic as old ringData)
  const ratingRaw = 3.7 + ((p.id * 11) % 13) / 10;
  const CATEGORY_TAGS: Record<string, string[]> = {
    Engagement: ['engagement', 'proposal'],
    Wedding:    ['wedding', 'bridal'],
    Casual:     ['everyday', 'casual'],
    Luxury:     ['luxury', 'premium'],
    Statement:  ['statement', 'party'],
  };
  return {
    ...p,
    image_url: p.images[0] ?? '',
    rating: Math.round(Math.min(5, ratingRaw) * 10) / 10,
    reviews: 12 + (p.id * 19) % 170,
    tags: CATEGORY_TAGS[p.category] ?? [],
  };
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** Fetch all products (for collections page, trending, etc.) */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error: err } = await supabase
        .from('products')
        .select('*')
        .order('id');
      if (cancelled) return;
      if (err) { setError(err.message); setLoading(false); return; }
      setProducts((data as DBProduct[]).map(enrichProduct));
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return { products, loading, error };
}

/** Fetch a single product by id, with its variants */
export function useProduct(id: number | undefined) {
  const [product, setProduct]   = useState<Product | null>(null);
  const [variants, setVariants] = useState<DBVariant[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    let cancelled = false;

    (async () => {
      // Fetch product + variants in parallel
      const [prodRes, varRes] = await Promise.all([
        supabase.from('products').select('*').eq('id', id).single(),
        supabase.from('product_variants').select('*').eq('product_id', id).order('price_inr'),
      ]);

      if (cancelled) return;

      if (prodRes.error) {
        setError(prodRes.error.message);
        setLoading(false);
        return;
      }

      setProduct(enrichProduct(prodRes.data as DBProduct));
      setVariants((varRes.data as DBVariant[]) ?? []);
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [id]);

  return { product, variants, loading, error };
}

/** Fetch a single product by slug, with its variants */
export function useProductBySlug(slug: string | undefined) {
  const [product, setProduct]   = useState<Product | null>(null);
  const [variants, setVariants] = useState<DBVariant[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    let cancelled = false;

    (async () => {
      const prodRes = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (cancelled) return;
      if (prodRes.error) {
        setError(prodRes.error.message);
        setLoading(false);
        return;
      }

      const prod = prodRes.data as DBProduct;
      const varRes = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', prod.id)
        .order('price_inr');

      if (cancelled) return;

      setProduct(enrichProduct(prod));
      setVariants((varRes.data as DBVariant[]) ?? []);
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [slug]);

  return { product, variants, loading, error };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const formatINR = (n: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

/** Parse variant title → { metal, karat, diamondType } */
export function parseVariant(v: DBVariant) {
  return {
    metal: v.metal_karat,
    diamond: v.diamond_type,
    label: v.title,
    price: v.price_inr,
    available: v.available,
  };
}

/** Group variants by metal, then by diamond type */
export function groupVariants(variants: DBVariant[]) {
  const metals = new Map<string, DBVariant[]>();
  for (const v of variants) {
    const key = v.metal_karat || 'Default';
    if (!metals.has(key)) metals.set(key, []);
    metals.get(key)!.push(v);
  }
  return metals;
}
