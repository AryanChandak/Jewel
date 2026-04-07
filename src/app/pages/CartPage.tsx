import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useStore, cartItemKey } from '../store/StoreContext';
import { formatINR } from '../data/ringData';

const SHIPPING_THRESHOLD = 50000;

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, updateQty } = useStore();

  const shipping  = cartTotal >= SHIPPING_THRESHOLD ? 0 : 499;
  const orderTotal = cartTotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-5 px-6 text-center">
        <ShoppingBag size={56} className="text-gray-200" />
        <h1 className="font-serif text-3xl">Your cart is empty</h1>
        <p className="text-gray-500 max-w-xs">Add some exquisite rings to your cart and they'll appear here.</p>
        <Link
          to="/collections"
          className="px-8 py-3 bg-black text-white text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            to="/collections"
            className="flex items-center gap-1.5 text-xs tracking-widest uppercase text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} /> Continue Shopping
          </Link>
          <h1 className="font-serif text-3xl ml-auto">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ─── Cart items ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            {cart.map((item) => {
              const key = cartItemKey(item.ring, item.customization);
              return (
                <motion.div
                  key={key}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-5 p-4 border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  {/* Thumbnail */}
                  <Link to={`/product/${item.ring.id}`} className="w-24 h-24 shrink-0 overflow-hidden bg-gray-50">
                    <img src={item.ring.image_url} alt={item.ring.style} className="w-full h-full object-cover" />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <Link to={`/product/${item.ring.id}`} className="font-serif text-base hover:underline">
                        {item.ring.style} Ring
                      </Link>
                      <button
                        onClick={() => removeFromCart(key)}
                        className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                        aria-label="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mb-1">
                      {item.customization
                        ? `${item.customization.metal} · ${item.customization.stone}`
                        : `${item.ring.metal}${item.ring.stone !== 'None' ? ` · ${item.ring.stone}` : ''}`}
                    </p>
                    <p className="text-xs text-gray-400 mb-3">{item.ring.category} · {item.ring.design}</p>

                    <div className="flex items-center justify-between">
                      {/* Qty */}
                      <div className="flex items-center border border-gray-200">
                        <button
                          onClick={() => updateQty(key, item.quantity - 1)}
                          className="px-3 py-1.5 hover:bg-gray-50 transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-4 py-1.5 text-sm border-x border-gray-200 min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(key, item.quantity + 1)}
                          className="px-3 py-1.5 hover:bg-gray-50 transition-colors"
                          aria-label="Increase"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Line total */}
                      <p className="font-serif text-base">{formatINR(item.unitPrice * item.quantity)}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ─── Order summary ───────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border border-gray-200 p-6 space-y-4">
              <h2 className="font-serif text-xl mb-2">Order Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatINR(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'FREE' : formatINR(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-gray-400">
                    Free shipping on orders above {formatINR(SHIPPING_THRESHOLD)}
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="font-serif text-xl">{formatINR(orderTotal)}</span>
              </div>

              <button className="w-full bg-black text-white text-xs tracking-widest uppercase py-4 hover:bg-gray-900 transition-colors">
                Proceed to Checkout
              </button>

              <Link
                to="/collections"
                className="block w-full text-center text-xs tracking-widest uppercase py-2 text-gray-500 hover:text-black transition-colors"
              >
                Continue Shopping
              </Link>

              {/* Trust badges */}
              <div className="border-t border-gray-100 pt-4 space-y-2">
                {[
                  '🔒 Secure SSL checkout',
                  '✓ Certified hallmarked jewellery',
                  '↩ 30-day easy returns',
                ].map(t => (
                  <p key={t} className="text-[11px] text-gray-400">{t}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
