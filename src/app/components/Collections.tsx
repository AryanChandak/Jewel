import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

const collections = [
  {
    title: 'Diamond Collection',
    description: 'Brilliant cuts that capture eternal beauty',
    image: 'https://images.unsplash.com/photo-1763256614634-7feb3ff79ff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwcmluZyUyMGpld2Vscnl8ZW58MXx8fHwxNzc1NDg3NTg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    title: 'Gold Bands',
    description: 'Classic elegance in every detail',
    image: 'https://images.unsplash.com/photo-1738800076744-c37b80b37d31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZ29sZCUyMHdlZGRpbmclMjBiYW5kfGVufDF8fHx8MTc3NTQ4NzU4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    title: 'Gemstone Rings',
    description: 'Vibrant colors, timeless designs',
    image: 'https://images.unsplash.com/photo-1774504347325-85faf377dcf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZ2Vtc3RvbmUlMjByaW5nfGVufDF8fHx8MTc3NTQ4NzU4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    title: 'Engagement Rings',
    description: 'The perfect symbol of forever',
    image: 'https://images.unsplash.com/photo-1766910699521-eab05158a2a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBlbmdhZ2VtZW50JTIwcmluZ3xlbnwxfHx8fDE3NzU0ODc1ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

function CollectionCard({ collection, index }: { collection: typeof collections[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative overflow-hidden cursor-pointer"
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={collection.image}
          alt={collection.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-2xl font-serif mb-2">{collection.title}</h3>
        <p className="text-sm tracking-wide opacity-90">{collection.description}</p>
      </div>
    </motion.div>
  );
}

export function Collections() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="collections" className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Our Collections</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Each piece is a masterpiece, carefully crafted to perfection
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection, index) => (
            <CollectionCard key={index} collection={collection} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
