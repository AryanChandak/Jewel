import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigate, useNavigate } from 'react-router';
import {
  LayoutDashboard, Package, ImagePlus, Ruler, Settings, LogOut,
  Plus, Search, Edit2, Trash2, Upload, X, Check, Save,
  ShoppingBag, Star, BarChart3, ArrowUpDown, Eye, EyeOff,
  ChevronDown, AlertCircle, Menu as MenuIcon,
} from 'lucide-react';
import { useAdmin, ADMIN_USERNAME, type AdminProduct, type CategoryImage } from '../../store/adminStore';
import { formatINR } from '../../data/ringData';

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES   = ['Engagement', 'Wedding', 'Casual', 'Luxury', 'Statement'];
const METALS       = ['Gold', 'Rose Gold', 'White Gold', 'Platinum', 'Silver', 'Titanium', 'Steel'];
const STONES       = ['Diamond', 'Gemstone', 'Pearl', 'Mixed', 'None'];
const GENDERS      = ['Female', 'Male', 'Unisex'];
const STYLES       = ['Solitaire', 'Halo', 'Three Stone', 'Vintage', 'Band', 'Stackable', 'Cocktail', 'Signet', 'Knuckle', 'Cluster', 'Geometric', 'Open Ring'];
const BUDGET_RANGES= ['0-5k', '5k-10k', '10k-20k', '20k-50k', '50k-150k', '150k+'];
const PERSONALITIES= ['Classic', 'Elegant', 'Romantic', 'Trendy', 'Bold', 'Minimal', 'Modern', 'Simple', 'Vintage'];
const ALL_SIZES    = Array.from({ length: 25 }, (_, i) => i + 1);

type AdminView = 'overview' | 'products' | 'add' | 'edit' | 'images' | 'sizes' | 'settings';

const blankForm = (): Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'> => ({
  name: '', category: 'Engagement', style: 'Solitaire', metal: 'Gold',
  stone: 'Diamond', price: 25000, description: '', gender: 'Female',
  occasion: 'Proposal', personality: 'Classic', design: '',
  budget_range: '20k-50k', sizeMin: 5, sizeMax: 20,
  images: [], inStock: true, featured: false,
});

// ─── Shared UI atoms ──────────────────────────────────────────────────────────

const inputCls = 'w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400/40 transition-colors placeholder:text-gray-700';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] tracking-widest text-gray-500 uppercase mb-1.5">
        {label}{required && <span className="text-amber-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function SelectField({ label, value, onChange, opts }: {
  label: string; value: string; onChange: (v: string) => void; opts: string[];
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`${inputCls} appearance-none cursor-pointer`}
      >
        {opts.map(o => <option key={o} value={o} className="bg-[#111]">{o}</option>)}
      </select>
    </Field>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} className="sr-only" />
      <div className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${value ? 'bg-amber-400' : 'bg-white/10'}`}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-sm text-gray-400">{label}</span>
    </label>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#1a1a1a] border border-white/5 p-6 space-y-5">
      <h3 className="text-white text-xs font-medium tracking-widest uppercase border-b border-white/5 pb-3">{title}</h3>
      {children}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV = [
  { id: 'overview',  label: 'Overview',      icon: LayoutDashboard },
  { id: 'products',  label: 'Products',       icon: Package },
  { id: 'add',       label: 'Add Product',    icon: Plus },
  { id: 'images',    label: 'Image Manager',  icon: ImagePlus },
  { id: 'sizes',     label: 'Size Manager',   icon: Ruler },
  { id: 'settings',  label: 'Settings',       icon: Settings },
] as const;

function Sidebar({ active, onChange, onLogout }: {
  active: AdminView;
  onChange: (v: AdminView) => void;
  onLogout: () => void;
}) {
  return (
    <aside className="w-60 bg-[#111] border-r border-white/5 flex flex-col h-full">
      <div className="px-6 py-6 border-b border-white/5 shrink-0">
        <p className="font-serif text-amber-400 text-2xl tracking-widest">ELEGANCE</p>
        <p className="text-gray-700 text-[10px] tracking-widest uppercase mt-0.5">Admin Panel</p>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id as AdminView)}
              className={`w-full flex items-center gap-3.5 px-6 py-3 text-sm transition-all ${
                isActive
                  ? 'bg-amber-400/10 text-amber-400 border-r-2 border-amber-400 font-medium'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/4'
              }`}
            >
              <Icon size={15} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-5 border-t border-white/5 shrink-0">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-colors rounded"
        >
          <LogOut size={15} />
          Log Out
        </button>
      </div>
    </aside>
  );
}

// ─── Overview ────────────────────────────────────────────────────────────────

function Overview({ products, categoryImages, onNav }: {
  products: AdminProduct[];
  categoryImages: Record<string, string[]>;
  onNav: (v: AdminView) => void;
}) {
  const totalImgs = Object.values(categoryImages).reduce((s, imgs) => s + imgs.length, 0);
  const stats = [
    { label: 'Total Products',  value: products.length,                          icon: Package,      color: 'text-amber-400'  },
    { label: 'In Stock',        value: products.filter(p => p.inStock).length,   icon: ShoppingBag,  color: 'text-green-400'  },
    { label: 'Featured',        value: products.filter(p => p.featured).length,  icon: Star,         color: 'text-yellow-400' },
    { label: 'Custom Added',    value: products.filter(p => p.isCustom).length,  icon: Plus,         color: 'text-blue-400'   },
    { label: 'Uploaded Images', value: totalImgs,                                 icon: ImagePlus,    color: 'text-purple-400' },
    { label: 'Categories',      value: CATEGORIES.length,                         icon: BarChart3,    color: 'text-pink-400'   },
  ];

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-serif text-white mb-1">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm">Welcome back, {ADMIN_USERNAME}. Here's your catalog at a glance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a1a1a] border border-white/5 p-5 hover:border-white/10 transition-colors"
            >
              <Icon size={18} className={`${s.color} mb-4`} />
              <p className="text-3xl font-serif text-white">{s.value}</p>
              <p className="text-gray-600 text-xs tracking-wide mt-1">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Category breakdown */}
      <SectionCard title="Products by Category">
        <div className="space-y-4">
          {CATEGORIES.map(cat => {
            const count = products.filter(p => p.category === cat).length;
            const pct   = products.length ? (count / products.length) * 100 : 0;
            return (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-400">{cat}</span>
                  <span className="text-white font-medium">{count}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="h-full bg-amber-400 rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Recent products */}
      <SectionCard title="Recent Products">
        <div className="flex items-center justify-end -mt-2 mb-1">
          <button onClick={() => onNav('products')} className="text-[10px] tracking-widest uppercase text-amber-400 hover:text-amber-300 transition-colors">
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-[10px] tracking-widest uppercase text-gray-600">
                <th className="pb-2 text-left">Product</th>
                <th className="pb-2 text-left hidden sm:table-cell">Category</th>
                <th className="pb-2 text-right">Price</th>
                <th className="pb-2 text-center">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 8).map(p => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 shrink-0 overflow-hidden bg-white/5">
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                      <span className="text-white text-xs leading-tight">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 hidden sm:table-cell">
                    <span className="text-[9px] tracking-widest text-gray-500 uppercase bg-white/5 px-2 py-0.5">{p.category}</span>
                  </td>
                  <td className="py-2.5 text-right text-amber-400 text-xs">{formatINR(p.price)}</td>
                  <td className="py-2.5 text-center">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full ${p.inStock ? 'bg-green-400/15 text-green-400' : 'bg-red-400/15 text-red-400'}`}>
                      {p.inStock ? 'In Stock' : 'Out'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Products Table ───────────────────────────────────────────────────────────

function ProductsTable({ products, onEdit, onDelete }: {
  products: AdminProduct[];
  onEdit:   (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const [search, setSearch]       = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [sortBy, setSortBy]       = useState<'name' | 'price'>('name');

  const filtered = products
    .filter(p => catFilter === 'All' || p.category === catFilter)
    .filter(p => `${p.name} ${p.style} ${p.metal} ${p.stone}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'price' ? a.price - b.price : a.name.localeCompare(b.name));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-serif text-white mb-1">Products</h2>
        <p className="text-gray-500 text-sm">{products.length} rings in catalog</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
          <input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/8 text-white pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-400/30 transition-colors placeholder:text-gray-700" />
        </div>
        <div className="relative">
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-white/8 text-white px-4 py-2.5 pr-8 text-sm focus:outline-none appearance-none cursor-pointer">
            <option value="All" className="bg-[#111]">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
        </div>
        <button onClick={() => setSortBy(s => s === 'price' ? 'name' : 'price')}
          className="flex items-center gap-2 bg-[#1a1a1a] border border-white/8 text-gray-400 px-4 py-2.5 text-sm hover:text-white hover:border-white/20 transition-colors">
          <ArrowUpDown size={13} />
          By {sortBy === 'price' ? 'Name' : 'Price'}
        </button>
      </div>

      <div className="bg-[#1a1a1a] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="bg-white/3 border-b border-white/5 text-[10px] tracking-widest uppercase text-gray-600">
                <th className="px-5 py-3.5 text-left">Product</th>
                <th className="px-5 py-3.5 text-left">Category</th>
                <th className="px-5 py-3.5 text-left">Metal / Stone</th>
                <th className="px-5 py-3.5 text-right">Price</th>
                <th className="px-5 py-3.5 text-center">Sizes</th>
                <th className="px-5 py-3.5 text-center">Stock</th>
                <th className="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-600 text-sm">No products match your search.</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/3 transition-colors group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 shrink-0 overflow-hidden bg-white/5">
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                      <div>
                        <p className="text-white text-xs font-medium leading-tight">{p.name}</p>
                        <p className="text-gray-700 text-[10px]">#{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[9px] tracking-widest bg-white/8 text-gray-400 px-2 py-1 uppercase">{p.category}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{p.metal}{p.stone !== 'None' ? ` · ${p.stone}` : ''}</td>
                  <td className="px-5 py-3 text-right text-amber-400 text-xs font-medium">{formatINR(p.price)}</td>
                  <td className="px-5 py-3 text-center text-gray-500 text-xs">{p.sizeMin}–{p.sizeMax}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full ${p.inStock ? 'bg-green-400/15 text-green-400' : 'bg-red-400/15 text-red-400'}`}>
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => onEdit(p.id)} title="Edit"
                        className="p-1.5 rounded text-gray-600 hover:text-amber-400 hover:bg-amber-400/10 transition-colors">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => onDelete(p.id)} title="Delete"
                        className="p-1.5 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Product Form (Add / Edit) ────────────────────────────────────────────────

function ProductForm({ initial, title, onSave, onCancel }: {
  initial:  Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>;
  title:    string;
  onSave:   (data: typeof initial) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof typeof form>(key: K, val: typeof form[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  const { uploadProductImage } = useAdmin();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImages = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setUploadError(null);
    for (const file of files) {
      const { url, error } = await uploadProductImage(file);
      if (error) { setUploadError(error); }
      else if (url) setForm(f => ({ ...f, images: [...f.images, url] }));
    }
    setUploading(false);
    e.target.value = '';
  }, [uploadProductImage]);

  const removeImage = (i: number) => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif text-white">{title}</h2>
          <p className="text-gray-500 text-sm">Fill in all product details below.</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel}
            className="text-xs tracking-widest uppercase px-5 py-2.5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors">
            Cancel
          </button>
          <button type="submit"
            className="flex items-center gap-2 text-xs tracking-widest uppercase px-6 py-2.5 bg-amber-400 text-black font-semibold hover:bg-amber-300 transition-colors">
            <Save size={13} />
            Save Product
          </button>
        </div>
      </div>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-green-400 text-xs p-3 bg-green-400/10 border border-green-400/20">
          <Check size={14} className="shrink-0" /> Product saved successfully!
        </motion.div>
      )}

      {/* Basic Info */}
      <SectionCard title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Product Name" required>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="e.g. Classic Solitaire Gold Ring" required className={inputCls} />
          </Field>

          <Field label="Description">
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={3} placeholder="Short description of the ring…"
              className={`${inputCls} resize-none`} />
          </Field>

          <SelectField label="Category"    value={form.category}    onChange={v => set('category', v)}    opts={CATEGORIES} />
          <SelectField label="Style"       value={form.style}       onChange={v => set('style', v)}       opts={STYLES} />
          <SelectField label="Metal"       value={form.metal}       onChange={v => set('metal', v)}       opts={METALS} />
          <SelectField label="Stone"       value={form.stone}       onChange={v => set('stone', v)}       opts={STONES} />
          <SelectField label="Gender"      value={form.gender}      onChange={v => set('gender', v)}      opts={GENDERS} />
          <SelectField label="Personality" value={form.personality} onChange={v => set('personality', v)} opts={PERSONALITIES} />

          <Field label="Price (₹)" required>
            <input type="number" min={0} value={form.price} onChange={e => set('price', Number(e.target.value))}
              required className={inputCls} />
          </Field>

          <SelectField label="Budget Range"  value={form.budget_range}  onChange={v => set('budget_range', v)}  opts={BUDGET_RANGES} />

          <Field label="Occasion">
            <input type="text" value={form.occasion} onChange={e => set('occasion', e.target.value)}
              placeholder="e.g. Proposal, Wedding, Party" className={inputCls} />
          </Field>

          <Field label="Design / Finish">
            <input type="text" value={form.design} onChange={e => set('design', e.target.value)}
              placeholder="e.g. Minimal Elegant, Antique" className={inputCls} />
          </Field>
        </div>

        <div className="flex flex-wrap gap-8 pt-2 border-t border-white/5">
          <Toggle label="In Stock" value={form.inStock}  onChange={v => set('inStock', v)} />
          <Toggle label="Featured" value={form.featured} onChange={v => set('featured', v)} />
        </div>
      </SectionCard>

      {/* Size Range */}
      <SectionCard title="Available Ring Sizes (Indian Standard)">
        <p className="text-gray-600 text-xs -mt-2">Drag the sliders to define the min and max available ring sizes for this product.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Min */}
          <div>
            <p className="text-gray-500 text-[10px] tracking-widest uppercase mb-2">
              Minimum Size — <span className="text-amber-400">Size {form.sizeMin}</span>
            </p>
            <input type="range" min={1} max={form.sizeMax} value={form.sizeMin}
              onChange={e => set('sizeMin', Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer" />
            <div className="flex justify-between text-[10px] text-gray-600 mt-1"><span>1</span><span>{form.sizeMax}</span></div>
          </div>
          {/* Max */}
          <div>
            <p className="text-gray-500 text-[10px] tracking-widest uppercase mb-2">
              Maximum Size — <span className="text-amber-400">Size {form.sizeMax}</span>
            </p>
            <input type="range" min={form.sizeMin} max={25} value={form.sizeMax}
              onChange={e => set('sizeMax', Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer" />
            <div className="flex justify-between text-[10px] text-gray-600 mt-1"><span>{form.sizeMin}</span><span>25</span></div>
          </div>
        </div>

        {/* Visual chips */}
        <div>
          <p className="text-gray-600 text-[10px] tracking-widest uppercase mb-3">Available Sizes Preview</p>
          <div className="flex flex-wrap gap-2">
            {ALL_SIZES.map(s => {
              const avail = s >= form.sizeMin && s <= form.sizeMax;
              return (
                <span key={s} className={`w-9 h-9 text-xs flex items-center justify-center rounded-full border font-medium transition-colors ${
                  avail ? 'border-amber-400 bg-amber-400/10 text-amber-400' : 'border-white/8 text-gray-700'
                }`}>{s}</span>
              );
            })}
          </div>
        </div>
      </SectionCard>

      {/* Image Upload */}
      <SectionCard title="Product Images">
        {/* Drop zone */}
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className="w-full border-2 border-dashed border-white/10 hover:border-amber-400/30 p-10 flex flex-col items-center gap-2 transition-colors group disabled:opacity-60">
          {uploading
            ? <span className="w-6 h-6 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            : <Upload size={28} className="text-gray-600 group-hover:text-amber-400 transition-colors" />}
          <p className="text-gray-500 text-sm">{uploading ? 'Uploading to Supabase…' : 'Click to upload images'}</p>
          <p className="text-gray-700 text-xs">JPG · PNG · WebP — multiple files allowed</p>
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />

        {/* Image upload error */}
        {uploadError && (
          <div className="flex items-start gap-2.5 text-red-400 text-xs p-3 bg-red-400/10 border border-red-400/20">
            <AlertCircle size={13} className="shrink-0 mt-0.5" />
            <span><strong>Upload failed:</strong> {uploadError}<br />
            Make sure the <code className="text-red-300">product-images</code> bucket exists in Supabase Storage and is set to public.</span>
          </div>
        )}

        {/* Image grid */}
        {form.images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative aspect-square group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/80 text-white items-center justify-center hidden group-hover:flex hover:bg-red-500 transition-colors">
                  <X size={11} />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-amber-400 text-black text-[9px] text-center py-0.5 tracking-wide">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </form>
  );
}

// ─── Image Manager ────────────────────────────────────────────────────────────

function ImageManager({ categoryImages, onUpload, onDelete }: {
  categoryImages: Record<string, CategoryImage[]>;
  onUpload:       (cat: string, files: File[]) => Promise<void>;
  onDelete:       (cat: string, imageId: number) => Promise<void>;
}) {
  const refs = useRef<Record<string, HTMLInputElement | null>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const handleFiles = async (cat: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(u => ({ ...u, [cat]: true }));
    await onUpload(cat, files);
    setUploading(u => ({ ...u, [cat]: false }));
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-white mb-1">Image Manager</h2>
        <p className="text-gray-500 text-sm">Upload and manage product images per category.</p>
      </div>

      {CATEGORIES.map(cat => {
        const imgs = categoryImages[cat] ?? [];
        return (
          <div key={cat} className="bg-[#1a1a1a] border border-white/5 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-white font-serif text-lg">{cat}</h3>
                <p className="text-gray-600 text-xs mt-0.5">{imgs.length} image{imgs.length !== 1 ? 's' : ''} uploaded</p>
              </div>
              <button onClick={() => refs.current[cat]?.click()} disabled={!!uploading[cat]}
                className="flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-2 border border-amber-400/25 text-amber-400 hover:bg-amber-400/8 transition-colors disabled:opacity-50">
                {uploading[cat]
                  ? <span className="w-3 h-3 border border-amber-400/40 border-t-amber-400 rounded-full animate-spin" />
                  : <Upload size={13} />}
                {uploading[cat] ? 'Uploading…' : 'Upload'}
              </button>
              <input ref={el => { refs.current[cat] = el; }} type="file" accept="image/*" multiple className="hidden"
                onChange={e => handleFiles(cat, e)} />
            </div>

            {imgs.length === 0 ? (
              <button onClick={() => refs.current[cat]?.click()}
                className="w-full border-2 border-dashed border-white/5 hover:border-amber-400/20 p-10 text-center transition-colors group">
                <Upload size={20} className="mx-auto text-gray-700 group-hover:text-amber-400 mb-2 transition-colors" />
                <p className="text-gray-600 text-sm">Click to upload images for <strong className="text-gray-500">{cat}</strong></p>
              </button>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-2.5">
                {imgs.map((img) => (
                  <div key={img.id} className="relative aspect-square group">
                    <img src={img.url} alt={`${cat}`} className="w-full h-full object-cover" />
                    <button onClick={() => onDelete(cat, img.id)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/80 text-white items-center justify-center hidden group-hover:flex hover:bg-red-500 transition-colors">
                      <X size={11} />
                    </button>
                  </div>
                ))}
                <button onClick={() => refs.current[cat]?.click()}
                  className="aspect-square border-2 border-dashed border-white/5 hover:border-amber-400/25 flex items-center justify-center text-gray-700 hover:text-amber-400 transition-colors">
                  <Plus size={18} />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Size Manager ─────────────────────────────────────────────────────────────

function SizeManager({ products, onUpdate }: {
  products: AdminProduct[];
  onUpdate: (id: number, updates: Partial<AdminProduct>) => void;
}) {
  const [search, setSearch]       = useState('');
  const [catFilter, setCatFilter] = useState('All');

  const filtered = products
    .filter(p => catFilter === 'All' || p.category === catFilter)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-white mb-1">Size Manager</h2>
        <p className="text-gray-500 text-sm">Set the available ring-size range for every product.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
          <input type="text" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/8 text-white pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-400/30 transition-colors placeholder:text-gray-700" />
        </div>
        <div className="relative">
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-white/8 text-white px-4 py-2.5 pr-8 text-sm focus:outline-none appearance-none cursor-pointer">
            <option value="All" className="bg-[#111]">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-gray-600 py-10 text-sm">No products match your search.</p>
        )}
        {filtered.map(p => (
          <div key={p.id} className="bg-[#1a1a1a] border border-white/5 p-5">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 overflow-hidden bg-white/5 shrink-0">
                  <img src={p.images[0]} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{p.name}</p>
                  <p className="text-gray-600 text-xs">{p.category} · {p.gender}</p>
                </div>
              </div>
              <span className="shrink-0 text-[10px] tracking-widest text-amber-400 bg-amber-400/10 px-2 py-1 uppercase">
                Sizes {p.sizeMin}–{p.sizeMax}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 text-[10px] tracking-widest uppercase mb-2">Min Size: <span className="text-amber-400">{p.sizeMin}</span></p>
                <input type="range" min={1} max={p.sizeMax} value={p.sizeMin}
                  onChange={e => onUpdate(p.id, { sizeMin: Number(e.target.value) })}
                  className="w-full accent-amber-400 cursor-pointer" />
                <div className="flex justify-between text-[10px] text-gray-600 mt-0.5"><span>1</span><span>{p.sizeMax}</span></div>
              </div>
              <div>
                <p className="text-gray-600 text-[10px] tracking-widest uppercase mb-2">Max Size: <span className="text-amber-400">{p.sizeMax}</span></p>
                <input type="range" min={p.sizeMin} max={25} value={p.sizeMax}
                  onChange={e => onUpdate(p.id, { sizeMax: Number(e.target.value) })}
                  className="w-full accent-amber-400 cursor-pointer" />
                <div className="flex justify-between text-[10px] text-gray-600 mt-0.5"><span>{p.sizeMin}</span><span>25</span></div>
              </div>
            </div>

            {/* Size chips preview */}
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
              {ALL_SIZES.map(s => {
                const avail = s >= p.sizeMin && s <= p.sizeMax;
                return (
                  <span key={s} className={`w-8 h-8 text-[11px] flex items-center justify-center rounded-full border font-medium ${
                    avail ? 'border-amber-400/40 bg-amber-400/10 text-amber-400' : 'border-white/5 text-gray-700'
                  }`}>{s}</span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Settings ────────────────────────────────────────────────────────────────

function SettingsPanel({ onLogout }: { onLogout: () => void }) {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConf]   = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  function PwInput({ label, value, onChange, show, onToggle }: {
    label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void;
  }) {
    return (
      <Field label={label}>
        <div className="relative">
          <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
            className={inputCls + ' pr-10'} />
          <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors">
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </Field>
    );
  }

  const { changePassword, seedCatalog, seeding } = useAdmin();
  const [saving, setSaving] = useState(false);

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6)  { setMsg({ type: 'err', text: 'Password must be at least 6 characters.' }); return; }
    if (newPass !== confPass) { setMsg({ type: 'err', text: 'New passwords do not match.' }); return; }
    setSaving(true);
    const { error } = await changePassword(newPass);
    setSaving(false);
    if (error) setMsg({ type: 'err', text: error });
    else { setMsg({ type: 'ok', text: 'Password updated in Supabase Auth.' }); setOldPass(''); setNewPass(''); setConf(''); }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h2 className="text-2xl font-serif text-white mb-1">Settings</h2>
        <p className="text-gray-500 text-sm">Manage your admin account preferences.</p>
      </div>

      {/* Account info */}
      <SectionCard title="Account Information">
        <div className="grid grid-cols-2 gap-5">
          {[['Username', ADMIN_USERNAME], ['Role', 'Super Admin'], ['Access Level', 'Full'], ['Session', 'Active']].map(([k, v]) => (
            <div key={k}>
              <p className="text-[10px] tracking-widest text-gray-600 uppercase mb-1">{k}</p>
              <p className={`text-sm ${k === 'Role' || k === 'Access Level' ? 'text-amber-400' : 'text-white'}`}>{v}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Change Password */}
      <form onSubmit={handleChange}>
        <SectionCard title="Change Password">
          {msg && (
            <div className={`flex items-center gap-2.5 text-xs p-3 border mb-1 ${
              msg.type === 'ok' ? 'bg-green-400/10 border-green-400/20 text-green-400' : 'bg-red-400/10 border-red-400/20 text-red-400'
            }`}>
              {msg.type === 'err' ? <AlertCircle size={13} className="shrink-0" /> : <Check size={13} className="shrink-0" />}
              {msg.text}
            </div>
          )}
          <PwInput label="Current Password" value={oldPass} onChange={setOldPass} show={showOld} onToggle={() => setShowOld(s => !s)} />
          <PwInput label="New Password"     value={newPass} onChange={setNewPass} show={showNew} onToggle={() => setShowNew(s => !s)} />
          <PwInput label="Confirm Password" value={confPass} onChange={setConf}  show={showNew} onToggle={() => {}} />
          <button type="submit" disabled={saving} className="w-full text-xs tracking-widest uppercase py-3 bg-amber-400 text-black font-semibold hover:bg-amber-300 transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-60">
            {saving && <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
            {saving ? 'Updating…' : 'Update Password'}
          </button>
        </SectionCard>
      </form>

      <div className="space-y-3 bg-[#1a1a1a] border border-amber-400/10 p-6">
        <h3 className="text-amber-400 text-xs tracking-widest uppercase border-b border-amber-400/10 pb-3">Catalog Seeding</h3>
        <p className="text-gray-600 text-xs">Insert all 60 rings from the local catalog into Supabase. Only needed once on a fresh database.</p>
        <button onClick={seedCatalog} disabled={seeding}
          className="flex items-center gap-2 text-xs tracking-widest uppercase px-5 py-3 border border-amber-400/25 text-amber-400 hover:bg-amber-400/10 transition-colors disabled:opacity-50">
          {seeding
            ? <span className="w-3 h-3 border border-amber-400/40 border-t-amber-400 rounded-full animate-spin" />
            : <Plus size={13} />}
          {seeding ? 'Seeding…' : 'Seed 60 Rings to Supabase'}
        </button>
      </div>

      <div className="bg-[#1a1a1a] border border-red-500/20 p-6 space-y-3">
        <h3 className="text-red-400 text-xs tracking-widest uppercase border-b border-red-500/10 pb-3">Danger Zone</h3>
        <button onClick={onLogout}
          className="flex items-center gap-2 text-xs tracking-widest uppercase px-5 py-3 border border-red-400/25 text-red-400 hover:bg-red-400/10 transition-colors">
          <LogOut size={13} />
          Sign Out of Admin Panel
        </button>
      </div>
    </div>
  );
}

// ─── Main AdminDashboard ──────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { isAuthenticated, products: allProducts, categoryImages, loading, addProduct, updateProduct, deleteProduct, addCategoryImages, deleteCategoryImage, logout } = useAdmin();
  const navigate = useNavigate();

  const [view, setView]           = useState<AdminView>('overview');
  const [editId, setEditId]       = useState<number | null>(null);
  const [mobileSidebar, setMobile] = useState(false);

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  const goTo = (v: AdminView) => { setView(v); setMobile(false); };

  const handleEdit = (id: number) => { setEditId(id); setView('edit'); };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this product? This cannot be undone.')) deleteProduct(id);
  };

  const handleLogout = () => { logout(); navigate('/admin/login', { replace: true }); };

  const editProduct = allProducts.find(p => p.id === editId);
  const editInitial = editProduct
    ? { name: editProduct.name, category: editProduct.category, style: editProduct.style, metal: editProduct.metal, stone: editProduct.stone, price: editProduct.price, description: editProduct.description, gender: editProduct.gender, occasion: editProduct.occasion, personality: editProduct.personality, design: editProduct.design, budget_range: editProduct.budget_range, sizeMin: editProduct.sizeMin, sizeMax: editProduct.sizeMax, images: editProduct.images, inStock: editProduct.inStock, featured: editProduct.featured }
    : blankForm();

  const renderContent = () => {
    switch (view) {
      case 'overview':  return <Overview products={allProducts} categoryImages={categoryImages} onNav={goTo} />;
      case 'products':  return <ProductsTable products={allProducts} onEdit={handleEdit} onDelete={handleDelete} />;
      case 'add':       return <ProductForm initial={blankForm()} title="Add New Product" onSave={d => { addProduct(d); goTo('products'); }} onCancel={() => goTo('products')} />;
      case 'edit':      return <ProductForm initial={editInitial} title={`Edit: ${editProduct?.name ?? '—'}`} onSave={d => { if (editId != null) updateProduct(editId, d); goTo('products'); }} onCancel={() => goTo('products')} />;
      case 'images':    return <ImageManager categoryImages={categoryImages} onUpload={addCategoryImages} onDelete={deleteCategoryImage} />;
      case 'sizes':     return <SizeManager products={allProducts} onUpdate={updateProduct} />;
      case 'settings':  return <SettingsPanel onLogout={handleLogout} />;
      default:          return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex">
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-[#0f0f0f]/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            <p className="text-gray-500 text-xs tracking-widest uppercase">Loading catalog…</p>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-60 fixed left-0 top-0 h-full z-20">
        <Sidebar active={view} onChange={goTo} onLogout={handleLogout} />
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileSidebar && (
          <>
            <motion.div key="mb-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobile(false)} />
            <motion.div key="mb-panel" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              className="fixed left-0 top-0 h-full z-40 w-60 lg:hidden">
              <Sidebar active={view} onChange={goTo} onLogout={handleLogout} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 min-w-0 lg:ml-60 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#0f0f0f]/95 backdrop-blur-sm border-b border-white/5 px-6 py-3.5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobile(true)} className="lg:hidden p-1 text-gray-500 hover:text-white transition-colors" aria-label="Open menu">
              <MenuIcon size={20} />
            </button>
            <div>
              <p className="text-xs text-gray-600 tracking-widest uppercase">
                {NAV.find(n => n.id === view)?.label ?? 'Dashboard'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {view !== 'add' && (
              <button onClick={() => goTo('add')}
                className="hidden sm:flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-2 bg-amber-400 text-black font-semibold hover:bg-amber-300 transition-colors">
                <Plus size={13} />
                Add Product
              </button>
            )}
            <div className="flex items-center gap-2.5 border-l border-white/8 pl-4">
              <div className="w-8 h-8 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
                <span className="text-amber-400 text-xs font-bold uppercase">{ADMIN_USERNAME[0]}</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-white leading-tight">{ADMIN_USERNAME}</p>
                <p className="text-[10px] text-gray-600">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
