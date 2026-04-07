import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="about" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Our Story</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              For over three decades, we have been dedicated to creating jewelry that transcends
              time. Each piece tells a story of passion, precision, and artistry that has been
              passed down through generations of master craftsmen.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We believe that jewelry is more than an accessory—it's a legacy, a celebration of
              life's most precious moments. From the selection of the finest materials to the final
              polish, every step is guided by our commitment to excellence.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 tracking-wider"
            >
              LEARN MORE
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <img
              src="https://images.unsplash.com/photo-1774110101478-bb066db7ccf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBqZXdlbHJ5JTIwY29sbGVjdGlvbiUyMGRpc3BsYXl8ZW58MXx8fHwxNzc1NDg3NTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Jewelry Collection"
              className="w-full h-[500px] object-cover shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
