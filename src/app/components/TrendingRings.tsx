import { useRef, useMemo } from 'react';
import { motion, useInView } from 'motion/react';
import { TrendingUp } from 'lucide-react';
import { useProducts } from '../data/useProducts';
import { RingCard } from './RingCard';

export function TrendingRings() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const { products, loading } = useProducts();

  const trending = useMemo(
    () => products
      .filter(r => r.reviews > 80)
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, 4),
    [products],
  );

  if (loading || trending.length === 0) return null;

  return (
    <section id="trending" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} className="text-amber-500" />
              <span className="text-xs tracking-widest text-amber-500 uppercase">Most Popular This Week</span>
            </div>
            <h2 className="text-4xl font-serif">Trending Now</h2>
          </div>
          <a
            href="/collections"
            className="hidden md:block text-xs tracking-widest uppercase border-b border-black pb-0.5 hover:opacity-60 transition-opacity"
          >
            View All
          </a>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {trending.map((ring, i) => (
            <RingCard key={ring.id} ring={ring} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
