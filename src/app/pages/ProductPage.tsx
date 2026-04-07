import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { useParams, Link, useNavigate } from 'react-router';
import { Heart, ShoppingBag, Ruler, ArrowLeft, Star, ChevronRight } from 'lucide-react';
import { useProduct, useProducts, formatINR, groupVariants, type DBVariant, type Product } from '../data/useProducts';
import { useStore } from '../store/StoreContext';
import { RingCard } from '../components/RingCard';

// ─── Star row ─────────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );
}

// ─── Swatch button ────────────────────────────────────────────────────────────
const METAL_COLORS: Record<string, string> = {
  Gold: '#D4AF37', 'Rose Gold': '#B76E79', 'White Gold': '#C0C0C0',
  Platinum: '#E5E4E2', Silver: '#C0C0C0',
};
const STONE_COLORS: Record<string, string> = {
  Diamond: '#b9f2ff', Sapphire: '#0F52BA', Ruby: '#9B111E',
  Emerald: '#50C878', None: '#e5e7eb',
};

function Swatch({
  label, color, active, onClick,
}: { label: string; color: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all`}
    >
      <div
        className={`w-8 h-8 rounded-full border-2 transition-all ${active ? 'border-black scale-110 shadow-md' : 'border-gray-200 hover:border-gray-400'}`}
        style={{ background: color }}
      />
      <span className={`text-[10px] tracking-wide ${active ? 'text-black font-medium' : 'text-gray-500'}`}>
        {label}
      </span>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { product: ring, variants, loading } = useProduct(id ? Number(id) : undefined);
  const { products: allProducts } = useProducts();

  const { addToCart, toggleWishlist, isInWishlist, setCartOpen, addToRecentlyViewed, recentlyViewed } = useStore();

  const [activeImg, setActiveImg]     = useState(0);
  const [zoom, setZoom]               = useState(false);
  const [selMetal, setSelMetal]       = useState<string>('');
  const [selDiamond, setSelDiamond]   = useState<string>('');
  const [added, setAdded]             = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Derive metal & diamond options from variants
  const metalOptions = useMemo(() => {
    const set = new Set<string>();
    variants.forEach(v => { if (v.metal_karat) set.add(v.metal_karat); });
    return [...set];
  }, [variants]);

  const diamondOptions = useMemo(() => {
    if (!selMetal) return [];
    const set = new Set<string>();
    variants
      .filter(v => v.metal_karat === selMetal)
      .forEach(v => { if (v.diamond_type) set.add(v.diamond_type); });
    return [...set];
  }, [variants, selMetal]);

  // Find selected variant
  const selectedVariant = useMemo(() => {
    return variants.find(v => v.metal_karat === selMetal && v.diamond_type === selDiamond) ?? null;
  }, [variants, selMetal, selDiamond]);

  // Price
  const displayPrice = selectedVariant ? selectedVariant.price_inr : (ring?.price ?? 0);

  useEffect(() => {
    if (ring) {
      addToRecentlyViewed(ring);
      window.scrollTo({ top: 0 });
    }
  }, [ring]);  // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-select first metal + diamond when variants load
  useEffect(() => {
    if (metalOptions.length > 0 && !selMetal) {
      setSelMetal(metalOptions[0]);
    }
  }, [metalOptions]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (diamondOptions.length > 0 && !diamondOptions.includes(selDiamond)) {
      setSelDiamond(diamondOptions[0]);
    }
  }, [diamondOptions]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset active image when product changes
  useEffect(() => { setActiveImg(0); }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!ring) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
        <p className="font-serif text-2xl text-gray-400">Ring not found</p>
        <Link to="/collections" className="text-xs tracking-widest uppercase underline">Back to Collections</Link>
      </div>
    );
  }

  const gallery   = ring.images.length > 0 ? ring.images : [ring.image_url];
  const wishlisted = isInWishlist(ring.id);

  const related = allProducts
    .filter(r => r.id !== ring.id && (r.category === ring.category || r.style === ring.style))
    .slice(0, 4);

  const handleAddToCart = () => {
    const customization = selectedVariant
      ? { metal: selMetal, stone: selDiamond }
      : undefined;
    const cartRing = selectedVariant
      ? { ...ring, price: selectedVariant.price_inr }
      : ring;
    addToCart(cartRing, customization);
    setAdded(true);
    setCartOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-xs text-gray-400">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link to="/collections" className="hover:text-black transition-colors">Collections</Link>
        <ChevronRight size={12} />
        <span className="text-black">{ring.name || ring.style}</span>
      </div>

      {/* Back button */}
      <div className="max-w-7xl mx-auto px-6 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs tracking-widest uppercase text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 pb-16">
        {/* ─── Gallery ─────────────────────────────────── */}
        <div className="space-y-3">
          {/* Main image with zoom */}
          <div
            className={`relative aspect-square overflow-hidden bg-gray-50 cursor-zoom-in ${zoom ? 'cursor-zoom-out' : ''}`}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <motion.img
              key={activeImg}
              src={gallery[activeImg]}
              alt={`${ring.style} ring`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`w-full h-full object-cover transition-transform duration-500 ${zoom ? 'scale-125' : 'scale-100'}`}
            />
            <span className="absolute top-3 left-3 bg-black/70 text-white text-[9px] tracking-widest px-2 py-0.5 uppercase">
              {ring.category}
            </span>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-20 h-20 overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ─── Product info ─────────────────────────────── */}
        <div className="space-y-6">
          {/* Name & price */}
          <div>
            <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">{ring.category} · {ring.gender}</p>
            <h1 className="font-serif text-3xl md:text-4xl leading-tight mb-2">{ring.name || `${ring.style} Ring`}</h1>
            <div className="flex items-center gap-3 mb-3">
              <Stars rating={ring.rating} />
              <span className="text-sm text-gray-500">{ring.rating} ({ring.reviews} reviews)</span>
            </div>
            <p className="font-serif text-3xl text-black">{formatINR(displayPrice)}</p>
            {selectedVariant && selectedVariant.compare_price && (
              <p className="text-xs text-gray-400 mt-0.5 line-through">
                {formatINR(selectedVariant.compare_price)}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed text-sm">{ring.description}</p>

          {/* Metal / Karat selector */}
          {metalOptions.length > 0 && (
            <div>
              <p className="text-xs tracking-widest uppercase font-medium mb-3">
                Metal — <span className="text-gray-500 normal-case font-normal">{selMetal}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {metalOptions.map(m => (
                  <button
                    key={m}
                    onClick={() => setSelMetal(m)}
                    className={`px-4 py-2 text-xs tracking-wide border transition-all ${
                      selMetal === m
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-400 text-gray-600'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Diamond / Stone type selector */}
          {diamondOptions.length > 0 && (
            <div>
              <p className="text-xs tracking-widest uppercase font-medium mb-3">
                Diamond — <span className="text-gray-500 normal-case font-normal">{selDiamond}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {diamondOptions.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelDiamond(d)}
                    className={`px-4 py-2 text-xs tracking-wide border transition-all ${
                      selDiamond === d
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-400 text-gray-600'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No variants fallback */}
          {variants.length === 0 && (
            <div className="flex gap-4 flex-wrap">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Metal</p>
                <p className="text-sm text-gray-700">{ring.metal}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Stone</p>
                <p className="text-sm text-gray-700">{ring.stone === 'None' ? 'Metal only' : ring.stone}</p>
              </div>
            </div>
          )}

          {/* Availability */}
          {selectedVariant && (
            <p className={`text-xs tracking-wide ${selectedVariant.available ? 'text-green-600' : 'text-red-500'}`}>
              {selectedVariant.available ? '● In Stock' : '● Out of Stock'}
            </p>
          )}

          {/* Size guide trigger */}
          <button
            onClick={() => setShowSizeGuide(s => !s)}
            className="flex items-center gap-2 text-xs tracking-widest uppercase text-gray-500 hover:text-black transition-colors underline"
          >
            <Ruler size={14} /> Find Your Ring Size
          </button>

          {showSizeGuide && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-gray-50 text-sm text-gray-600 space-y-1.5">
                <p className="font-medium text-black mb-2">Quick Size Reference</p>
                {[
                  ['Size 8–10', 'Diameter 14.9 – 15.7 mm', 'US 3.5 – 4.5'],
                  ['Size 11–13', 'Diameter 16.1 – 16.9 mm', 'US 5 – 6'],
                  ['Size 14–16', 'Diameter 17.3 – 18.2 mm', 'US 6.5 – 7.5'],
                  ['Size 17–19', 'Diameter 18.6 – 19.4 mm', 'US 8 – 9'],
                ].map(([s, d, u]) => (
                  <div key={s} className="flex justify-between text-xs">
                    <span className="font-medium">{s}</span>
                    <span className="text-gray-500">{d}</span>
                    <span className="text-gray-500">{u}</span>
                  </div>
                ))}
                <Link to="/#size-guide" className="block text-xs text-black underline mt-2">Full size chart →</Link>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2.5 py-4 text-xs tracking-widest uppercase transition-colors ${
                added ? 'bg-green-700 text-white' : 'bg-black text-white hover:bg-gray-900'
              }`}
            >
              <ShoppingBag size={15} />
              {added ? 'Added to Cart ✓' : 'Add to Cart'}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleWishlist(ring.id)}
              className={`px-4 border transition-colors ${wishlisted ? 'border-red-400 bg-red-50 text-red-500' : 'border-gray-300 hover:border-black text-gray-600'}`}
              aria-label="Toggle wishlist"
            >
              <Heart size={18} className={wishlisted ? 'fill-red-500' : ''} />
            </motion.button>
          </div>

          {/* Details tags */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
            {[
              ['Metal', ring.metal],
              ['Stone', ring.stone === 'None' ? 'Metal only' : ring.stone],
              ['Style', ring.style],
              ['Occasion', ring.occasion],
              ['Personality', ring.personality],
              ['Design', ring.design],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="text-[10px] tracking-widest uppercase text-gray-400">{label}</p>
                <p className="text-sm text-gray-700 mt-0.5">{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Related products ───────────────────────────── */}
      {related.length > 0 && (
        <div className="bg-gray-50 py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-3xl mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((r, i) => <RingCard key={r.id} ring={r} index={i} />)}
            </div>
          </div>
        </div>
      )}

      {/* ─── Recently viewed ────────────────────────────── */}
      {recentlyViewed.filter(r => r.id !== ring.id).length > 0 && (
        <div className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-3xl mb-8">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {recentlyViewed
                .filter(r => r.id !== ring.id)
                .slice(0, 4)
                .map((r, i) => <RingCard key={r.id} ring={r} index={i} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
