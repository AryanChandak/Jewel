import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const contactInfo = [
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 123-4567',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'info@elegance.com',
    },
    {
      icon: MapPin,
      label: 'Address',
      value: '123 Luxury Lane, New York, NY 10001',
    },
  ];

  const socialLinks = [
    { icon: Instagram, label: 'Instagram' },
    { icon: Facebook, label: 'Facebook' },
    { icon: Twitter, label: 'Twitter' },
  ];

  return (
    <section id="contact" className="py-20 px-6 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Get In Touch</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Visit our showroom or reach out to us for personalized consultations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <textarea
                  rows={6}
                  placeholder="Your Message"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors resize-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-8 py-3 bg-white text-black hover:bg-gray-200 transition-colors tracking-wider"
              >
                SEND MESSAGE
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <Icon size={24} className="mt-1" />
                  <div>
                    <h3 className="font-serif text-lg mb-1">{info.label}</h3>
                    <p className="text-gray-400">{info.value}</p>
                  </div>
                </motion.div>
              );
            })}

            {/* Social Links */}
            <div className="pt-8 border-t border-white/20">
              <h3 className="font-serif text-lg mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 border border-white/20 hover:bg-white/10 transition-colors"
                      aria-label={social.label}
                    >
                      <Icon size={20} />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Hours */}
            <div className="pt-8 border-t border-white/20">
              <h3 className="font-serif text-lg mb-4">Showroom Hours</h3>
              <div className="space-y-2 text-gray-400">
                <p>Monday - Friday: 10:00 AM - 7:00 PM</p>
                <p>Saturday: 11:00 AM - 6:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 pt-8 border-t border-white/20 text-center text-gray-400 text-sm"
        >
          <p>&copy; 2026 Elegance. All rights reserved.</p>
        </motion.div>
      </div>
    </section>
  );
}
