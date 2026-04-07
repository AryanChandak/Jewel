import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const PIECES = [
  {
    title: 'Eternal Solitaire',
    subtitle: 'Diamond · 18K White Gold',
    src: 'https://images.unsplash.com/photo-1763256614634-7feb3ff79ff3?w=480&q=80&fm=jpg&fit=crop',
  },
  {
    title: 'Halo Radiance',
    subtitle: 'Diamond · Rose Gold',
    src: 'https://images.unsplash.com/photo-1766910699521-eab05158a2a1?w=480&q=80&fm=jpg&fit=crop',
  },
  {
    title: 'Sapphire Dream',
    subtitle: 'Ceylon Sapphire · Platinum',
    src: 'https://images.unsplash.com/photo-1774504347325-85faf377dcf1?w=480&q=80&fm=jpg&fit=crop',
  },
  {
    title: 'Heritage Band',
    subtitle: 'Gold · Hand Engraved',
    src: 'https://images.unsplash.com/photo-1738800076744-c37b80b37d31?w=480&q=80&fm=jpg&fit=crop',
  },
  {
    title: 'Pavé Crown',
    subtitle: 'Diamond · Yellow Gold',
    src: 'https://images.unsplash.com/photo-1619119069152-a2b331eb392a?w=480&q=80&fm=jpg&fit=crop',
  },
  {
    title: 'Vintage Marquise',
    subtitle: 'Diamond · Platinum',
    src: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=480&q=80&fm=jpg&fit=crop',
  },
  {
    title: 'Rose Cushion',
    subtitle: 'Pink Diamond · Rose Gold',
    src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=480&q=80&fm=jpg&fit=crop',
  },
  {
    title: 'Emerald Grace',
    subtitle: 'Colombian Emerald · Gold',
    src: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=480&q=80&fm=jpg&fit=crop',
  },
];

// Triplicate for a seamless wide loop
const TRACK = [...PIECES, ...PIECES, ...PIECES];

export function InfiniteRingCarousel() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="py-20 bg-[#faf9f7] overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="text-center px-6 mb-12"
      >
        <p className="text-xs tracking-[0.3em] text-amber-600 uppercase mb-3">
          Curated Masterpieces
        </p>
        <h2 className="text-4xl md:text-5xl font-serif">Our Finest Pieces</h2>
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="block h-px w-16 bg-amber-400/60" />
          <span className="text-amber-400 text-xs">✦</span>
          <span className="block h-px w-16 bg-amber-400/60" />
        </div>
      </motion.div>

      {/* Infinite scroll track — forward */}
      <div className="overflow-hidden mb-5">
        <div
          className="flex gap-4 will-change-transform"
          style={{
            animation: 'marquee 55s linear infinite',
            width: 'max-content',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLDivElement).style.animationPlayState = 'running')
          }
        >
          {TRACK.map((piece, i) => (
            <CarouselCard key={i} piece={piece} />
          ))}
        </div>
      </div>

      {/* Infinite scroll track — reverse (second row) */}
      <div className="overflow-hidden">
        <div
          className="flex gap-4 will-change-transform"
          style={{
            animation: 'marquee-reverse 65s linear infinite',
            width: 'max-content',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLDivElement).style.animationPlayState = 'running')
          }
        >
          {[...TRACK].reverse().map((piece, i) => (
            <CarouselCard key={i} piece={piece} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CarouselCard({ piece }: { piece: (typeof PIECES)[0] }) {
  return (
    <div className="group relative flex-shrink-0 w-60 cursor-pointer overflow-hidden rounded-sm shadow-md">
      <div className="aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={piece.src}
          alt={piece.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <p className="text-base font-serif leading-tight">{piece.title}</p>
        <p className="text-xs tracking-wider text-amber-300/90 mt-0.5">{piece.subtitle}</p>
      </div>
    </div>
  );
}
