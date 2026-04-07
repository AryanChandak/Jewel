import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';
import { useStore, cartItemKey } from '../store/StoreContext';
import { formatINR } from '../data/ringData';

export function CartDrawer() {
  const { cart, cartTotal, cartCount, removeFromCart, updateQty, cartOpen, setCartOpen } = useStore();

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="fixed right-0 top-0 h-full z-[61] w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} />
                <h2 className="font-serif text-lg tracking-wide">Your Cart</h2>
                {cartCount > 0 && (
                  <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
                  <ShoppingBag size={48} className="text-gray-200" />
                  <p className="font-serif text-lg text-gray-400">Your cart is empty</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="text-xs tracking-widest uppercase border border-black px-6 py-2 hover:bg-black hover:text-white transition-colors"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const key = cartItemKey(item.ring, item.customization);
                  return (
                    <motion.div
                      key={key}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4"
                    >
                      {/* Thumbnail */}
                      <div className="w-20 h-20 shrink-0 overflow-hidden bg-gray-50">
                        <img
                          src={item.ring.image_url}
                          alt={item.ring.style}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-sm leading-tight truncate">{item.ring.style}</p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {item.customization
                            ? `${item.customization.metal} · ${item.customization.stone}`
                            : `${item.ring.metal}${item.ring.stone !== 'None' ? ` · ${item.ring.stone}` : ''}`}
                        </p>
                        <p className="text-xs font-semibold mt-1">{formatINR(item.unitPrice)}</p>

                        {/* Qty controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQty(key, item.quantity - 1)}
                            className="w-6 h-6 border border-gray-200 flex items-center justify-center hover:border-black transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(key, item.quantity + 1)}
                            className="w-6 h-6 border border-gray-200 flex items-center justify-center hover:border-black transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={11} />
                          </button>
                          <button
                            onClick={() => removeFromCart(key)}
                            className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-6 py-5 border-t border-gray-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 tracking-wide">Subtotal</span>
                  <span className="font-serif text-lg">{formatINR(cartTotal)}</span>
                </div>
                <p className="text-xs text-gray-400">Shipping & taxes calculated at checkout</p>

                <Link
                  to="/cart"
                  onClick={() => setCartOpen(false)}
                  className="block w-full bg-black text-white text-center text-xs tracking-widest uppercase py-4 hover:bg-gray-900 transition-colors"
                >
                  View Cart & Checkout
                </Link>
                <button
                  onClick={() => setCartOpen(false)}
                  className="block w-full text-center text-xs tracking-widest uppercase py-2 text-gray-500 hover:text-black transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
