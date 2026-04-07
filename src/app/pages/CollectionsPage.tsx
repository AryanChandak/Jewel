import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { ENRICHED_CATALOG, formatINR, type EnrichedRing } from '../data/ringData';
import { RingCard } from '../components/RingCard';
import { useStore } from '../store/StoreContext';

// ─── Filter constants ─────────────────────────────────────────────────────────
const METALS     = ['Gold', 'Rose Gold', 'White Gold', 'Platinum', 'Silver', 'Titanium', 'Steel'];
const CATEGORIES = ['Engagement', 'Wedding', 'Casual', 'Luxury', 'Statement'];
const STYLES     = [...new Set(ENRICHED_CATALOG.map(r => r.style))].sort();
const GENDERS    = ['Female', 'Male', 'Unisex'];
const MAX_PRICE  = 300000;

type SortKey = 'recommended' | 'price_asc' | 'price_desc' | 'rating' | 'reviews';

interface Filters {
  search:     string;
  metals:     string[];
  categories: string[];
  styles:     string[];
  genders:    string[];
  priceMax:   number;
  wishlist:   boolean;
}

const defaultFilters: Filters = {
  search: '', metals: [], categories: [], styles: [], genders: [],
  priceMax: MAX_PRICE, wishlist: false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function CheckList({
  label, items, selected, onChange,
}: { label: string; items: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(true);
  const toggle = (item: string) =>
    onChange(selected.includes(item) ? selected.filter(s => s !== item) : [...selected, item]);

  return (
    <div className="border-b border-gray-100 pb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-2 text-xs tracking-widest uppercase text-gray-700 font-medium"
      >
        {label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="space-y-2 pt-2">
          {items.map(item => (
            <label key={item} className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selected.includes(item)}
                onChange={() => toggle(item)}
                className="w-3.5 h-3.5 accent-black"
              />
              <span className="text-sm text-gray-600">{item}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Active filter pills ──────────────────────────────────────────────────────
function ActivePill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-black text-white text-[10px] tracking-wide px-2.5 py-1 rounded-full">
      {label}
      <button onClick={onRemove} aria-label={`Remove ${label} filter`}>
        <X size={10} />
      </button>
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CollectionsPage() {
  const [searchParams]    = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => ({
    ...defaultFilters,
    wishlist: searchParams.get('filter') === 'wishlist',
  }));
  const [sort, setSort]     = useState<SortKey>('recommended');
  const [sidebarOpen, setSidebar] = useState(false);
  const { wishlist } = useStore();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const set = <K extends keyof Filters>(key: K, val: Filters[K]) =>
    setFilters(f => ({ ...f, [key]: val }));

  const filtered: EnrichedRing[] = useMemo(() => {
    let list = [...ENRICHED_CATALOG];

    if (filters.wishlist)          list = list.filter(r => wishlist.includes(r.id));
    if (filters.search)            list = list.filter(r => [r.style, r.metal, r.stone, r.category, r.personality].join(' ').toLowerCase().includes(filters.search.toLowerCase()));
    if (filters.metals.length)     list = list.filter(r => filters.metals.includes(r.metal));
    if (filters.categories.length) list = list.filter(r => filters.categories.includes(r.category));
    if (filters.styles.length)     list = list.filter(r => filters.styles.includes(r.style));
    if (filters.genders.length)    list = list.filter(r => filters.genders.includes(r.gender));
    list = list.filter(r => r.price <= filters.priceMax);

    switch (sort) {
      case 'price_asc':  return list.sort((a, b) => a.price - b.price);
      case 'price_desc': return list.sort((a, b) => b.price - a.price);
      case 'rating':     return list.sort((a, b) => b.rating - a.rating);
      case 'reviews':    return list.sort((a, b) => b.reviews - a.reviews);
      default:           return list;
    }
  }, [filters, sort, wishlist]);

  const activePills = [
    ...filters.metals.map(m => ({ label: m, remove: () => set('metals', filters.metals.filter(x => x !== m)) })),
    ...filters.categories.map(c => ({ label: c, remove: () => set('categories', filters.categories.filter(x => x !== c)) })),
    ...filters.styles.map(s => ({ label: s, remove: () => set('styles', filters.styles.filter(x => x !== s)) })),
    ...filters.genders.map(g => ({ label: g, remove: () => set('genders', filters.genders.filter(x => x !== g)) })),
    ...(filters.priceMax < MAX_PRICE ? [{ label: `≤ ${formatINR(filters.priceMax)}`, remove: () => set('priceMax', MAX_PRICE) }] : []),
    ...(filters.wishlist ? [{ label: 'Wishlist', remove: () => set('wishlist', false) }] : []),
  ];

  const Sidebar = () => (
    <div className="space-y-5">
      {/* Price slider */}
      <div className="border-b border-gray-100 pb-4">
        <p className="text-xs tracking-widest uppercase text-gray-700 font-medium mb-3">Price Range</p>
        <input
          type="range"
          min={0}
          max={MAX_PRICE}
          step={5000}
          value={filters.priceMax}
          onChange={e => set('priceMax', Number(e.target.value))}
          className="w-full accent-black"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>₹0</span>
          <span className="font-medium text-black">{formatINR(filters.priceMax)}</span>
        </div>
      </div>

      <CheckList label="Category"  items={CATEGORIES} selected={filters.categories} onChange={v => set('categories', v)} />
      <CheckList label="Metal"     items={METALS}     selected={filters.metals}     onChange={v => set('metals', v)} />
      <CheckList label="Style"     items={STYLES}     selected={filters.styles}     onChange={v => set('styles', v)} />
      <CheckList label="For"       items={GENDERS}    selected={filters.genders}    onChange={v => set('genders', v)} />

      {/* Reset */}
      {activePills.length > 0 && (
        <button
          onClick={() => setFilters(defaultFilters)}
          className="w-full text-xs tracking-widest uppercase py-2 border border-gray-300 hover:border-black transition-colors text-gray-600 hover:text-black"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-gray-50 px-6 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-serif mb-2">Our Collections</h1>
        <p className="text-gray-500 text-sm">Discover {ENRICHED_CATALOG.length} handcrafted rings</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-10">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 sticky top-24 self-start">
          <Sidebar />
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Search */}
            <input
              type="text"
              placeholder="Search rings…"
              value={filters.search}
              onChange={e => set('search', e.target.value)}
              className="flex-1 min-w-[180px] border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
            />

            {/* Mobile filter button */}
            <button
              onClick={() => setSidebar(true)}
              className="lg:hidden flex items-center gap-2 text-xs tracking-widest uppercase border border-gray-300 px-4 py-2 hover:border-black transition-colors"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortKey)}
                className="appearance-none border border-gray-200 px-4 py-2 pr-8 text-xs tracking-wide focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Popular</option>
              </select>
              <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>

            <span className="text-xs text-gray-400 ml-auto">{filtered.length} rings</span>
          </div>

          {/* Active pills */}
          {activePills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {activePills.map((p, i) => (
                <ActivePill key={i} label={p.label} onRemove={p.remove} />
              ))}
            </div>
          )}

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="py-24 text-center text-gray-400">
              <p className="font-serif text-xl mb-2">No rings match your filters.</p>
              <button
                onClick={() => setFilters(defaultFilters)}
                className="text-xs tracking-widest uppercase text-black underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <motion.div
              key={JSON.stringify(filters) + sort}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {filtered.map((ring, i) => (
                <RingCard key={ring.id} ring={ring} index={i} />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="sb-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setSidebar(false)}
            />
            <motion.div
              key="sb-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              className="fixed left-0 top-0 h-full z-50 w-72 bg-white shadow-xl overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-lg">Filters</h3>
                <button onClick={() => setSidebar(false)} aria-label="Close filters"><X size={20} /></button>
              </div>
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
