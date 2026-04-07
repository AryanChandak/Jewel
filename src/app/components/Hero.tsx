import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const scrollToNext = () => {
    const element = document.getElementById('collections');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/ring.mp4" type="video/mp4" />
          {/* Fallback image if video fails */}
          <img
            src="https://images.unsplash.com/photo-1763256614634-7feb3ff79ff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwcmluZyUyMGpld2Vscnl8ZW58MXx8fHwxNzc1NDg3NTg2fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Luxury Jewelry"
            className="w-full h-full object-cover"
          />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl md:text-7xl font-serif mb-6 tracking-wide"
        >
          Timeless Elegance
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-xl mb-8 max-w-2xl mx-auto tracking-wide"
        >
          Discover exquisite jewelry crafted with precision and passion
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          onClick={() => {
            const element = document.getElementById('collections');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 tracking-wider"
        >
          EXPLORE COLLECTIONS
        </motion.button>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={scrollToNext}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={32} className="text-white" />
        </motion.div>
      </motion.div>
    </section>
  );
}
