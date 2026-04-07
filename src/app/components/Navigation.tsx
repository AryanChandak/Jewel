import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Menu, X, ShoppingBag, Heart } from 'lucide-react';
import { useStore } from '../store/StoreContext';

export function Navigation() {
  const [isScrolled, setIsScrolled]       = useState(false);
  const [isMobileMenuOpen, setMobileMenu] = useState(false);
  const { cartCount, wishlistCount, setCartOpen } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenu(false); }, [location.pathname]);

  const scrollTo = (id: string) => {
    setMobileMenu(false);
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(`/?to=${id}`);
    }
  };

  // After navigating to home with ?to=, scroll to target
  useEffect(() => {
    if (!isHome) return;
    const params = new URLSearchParams(location.search);
    const target = params.get('to');
    if (target) {
      setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    }
  }, [isHome, location.search]);

  const transparent = !isScrolled && isHome;
  const textClass   = transparent ? 'text-white' : 'text-gray-900';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link
            to="/"
            className={`text-2xl font-serif tracking-widest shrink-0 ${textClass}`}
          >
            ELEGANCE
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7 flex-1 justify-center">
            {[
              { label: 'Home',          action: () => scrollTo('hero') },
              { label: 'Collections',   action: () => navigate('/collections') },
              { label: 'Ring Advisor',  action: () => navigate('/advisor') },
              { label: 'About',         action: () => scrollTo('about') },
              { label: 'Contact',       action: () => scrollTo('contact') },
            ].map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className={`text-xs tracking-widest uppercase hover:opacity-60 transition-opacity ${textClass}`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Wishlist */}
            <button
              onClick={() => navigate('/collections?filter=wishlist')}
              className={`relative p-1 ${textClass}`}
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className={`relative p-1 ${textClass}`}
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className={`md:hidden p-1 ${textClass}`}
              onClick={() => setMobileMenu(prev => !prev)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className={`flex flex-col gap-4 pt-4 pb-2 ${textClass}`}>
                {[
                  { label: 'Home',         action: () => scrollTo('hero') },
                  { label: 'Collections',  action: () => navigate('/collections') },
                  { label: 'Ring Advisor', action: () => navigate('/advisor') },
                  { label: 'About',        action: () => scrollTo('about') },
                  { label: 'Craftsmanship',action: () => scrollTo('craftsmanship') },
                  { label: 'Contact',      action: () => scrollTo('contact') },
                  { label: `Cart (${cartCount})`, action: () => { setMobileMenu(false); setCartOpen(true); } },
                ].map((link) => (
                  <button
                    key={link.label}
                    onClick={link.action}
                    className="text-sm tracking-wide text-left hover:opacity-60 transition-opacity"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
