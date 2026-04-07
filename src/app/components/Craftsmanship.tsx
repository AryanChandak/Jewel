import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Gem, Award, Heart, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Gem,
    title: 'Premium Materials',
    description: 'Only the finest diamonds, gold, and gemstones sourced from ethical suppliers',
  },
  {
    icon: Award,
    title: 'Expert Craftsmanship',
    description: 'Decades of experience in creating timeless pieces of wearable art',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Every piece is handcrafted with passion and attention to detail',
  },
  {
    icon: Sparkles,
    title: 'Lifetime Quality',
    description: 'Built to last generations with proper care and maintenance',
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="text-center p-8"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="inline-block mb-4"
      >
        <Icon size={48} className="mx-auto" />
      </motion.div>
      <h3 className="text-xl font-serif mb-3">{feature.title}</h3>
      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
    </motion.div>
  );
}

export function Craftsmanship() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="craftsmanship" className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Craftsmanship</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Every detail matters in the creation of extraordinary jewelry
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Workshop Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative h-[400px] md:h-[500px] overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1766524555120-9c2e886c72f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwY3JhZnRzbWFuc2hpcCUyMHdvcmtzaG9wfGVufDF8fHx8MTc3NTQ4NzU4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Craftsmanship Workshop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-3xl md:text-4xl font-serif mb-4">Where Art Meets Precision</h3>
              <p className="text-lg">Handcrafted in our atelier</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
