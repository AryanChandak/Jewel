import { motion } from 'motion/react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router';
import { useStore } from '../store/StoreContext';
import { formatINR, type EnrichedRing } from '../data/ringData';

interface Props {
  ring: EnrichedRing;
  index?: number;
}

export function RingCard({ ring, index = 0 }: Props) {
  const { addToCart, toggleWishlist, isInWishlist, setCartOpen } = useStore();
  const wishlisted = isInWishlist(ring.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(ring);
    setCartOpen(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(ring.id);
  };

  const isTrending = ring.reviews > 100;
  const isNew      = ring.id % 7 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      className="group"
    >
      <Link to={`/product/${ring.id}`} className="block">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={ring.image_url}
            alt={`${ring.style} ${ring.metal} ring`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <span className="bg-black/70 backdrop-blur-sm text-white text-[9px] tracking-widest px-2 py-0.5 uppercase">
              {ring.category}
            </span>
            {isTrending && (
              <span className="bg-amber-400 text-black text-[9px] tracking-widest px-2 py-0.5 uppercase font-bold">
                Trending
              </span>
            )}
            {isNew && (
              <span className="bg-white text-black text-[9px] tracking-widest px-2 py-0.5 uppercase">
                New
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={15}
              className={`transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>

          {/* Hover overlay */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full bg-black/90 text-white text-[10px] tracking-widest uppercase py-3 flex items-center justify-center gap-2 hover:bg-black transition-colors"
            >
              <ShoppingBag size={13} />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="pt-3 pb-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="font-serif text-sm leading-tight">{ring.style}</p>
              <p className="text-gray-500 text-xs">{ring.metal}{ring.stone !== 'None' ? ` · ${ring.stone}` : ''}</p>
            </div>
            <p className="font-semibold text-sm shrink-0">{formatINR(ring.price)}</p>
          </div>

          {/* Stars + reviews */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={i < Math.round(ring.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-gray-400 text-[10px]">({ring.reviews})</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
