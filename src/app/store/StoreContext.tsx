import {
  createContext, useContext, useReducer, useEffect,
  useCallback, type ReactNode,
} from 'react';
import { customizedPrice, type EnrichedRing } from '../data/ringData';
import type { Product } from '../data/useProducts';

// ─── Types ────────────────────────────────────────────────────────────────────

/** A ring item usable in the store — works with both old EnrichedRing and new Product */
export type StoreRing = EnrichedRing | Product;

export interface Customization { metal: string; stone: string }

export interface CartItem {
  ring: StoreRing;
  quantity: number;
  customization?: Customization;
  /** computed at add-time so it's stable in the cart */
  unitPrice: number;
}

interface State {
  cart: CartItem[];
  wishlist: number[];
  recentlyViewed: StoreRing[];
  cartOpen: boolean;
}

type Action =
  | { type: 'ADD_TO_CART'; ring: StoreRing; customization?: Customization }
  | { type: 'REMOVE_FROM_CART'; key: string }
  | { type: 'UPDATE_QTY'; key: string; qty: number }
  | { type: 'TOGGLE_WISHLIST'; id: number }
  | { type: 'ADD_RECENTLY_VIEWED'; ring: StoreRing }
  | { type: 'SET_CART_OPEN'; open: boolean }
  | { type: 'HYDRATE'; cart: CartItem[]; wishlist: number[] };

// ─── Key helper ───────────────────────────────────────────────────────────────

export function cartItemKey(ring: StoreRing, customization?: Customization): string {
  return customization
    ? `${ring.id}-${customization.metal}-${customization.stone}`
    : String(ring.id);
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

const initial: State = { cart: [], wishlist: [], recentlyViewed: [], cartOpen: false };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, cart: action.cart, wishlist: action.wishlist };

    case 'ADD_TO_CART': {
      const key = cartItemKey(action.ring, action.customization);
      const unitPrice = action.customization
        ? customizedPrice(action.ring.price, action.customization.metal, action.customization.stone)
        : action.ring.price;
      const existing = state.cart.find(i => cartItemKey(i.ring, i.customization) === key);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(i =>
            cartItemKey(i.ring, i.customization) === key
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ring: action.ring, quantity: 1, customization: action.customization, unitPrice }],
      };
    }

    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(i => cartItemKey(i.ring, i.customization) !== action.key) };

    case 'UPDATE_QTY':
      if (action.qty <= 0) {
        return { ...state, cart: state.cart.filter(i => cartItemKey(i.ring, i.customization) !== action.key) };
      }
      return {
        ...state,
        cart: state.cart.map(i =>
          cartItemKey(i.ring, i.customization) === action.key ? { ...i, quantity: action.qty } : i,
        ),
      };

    case 'TOGGLE_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.includes(action.id)
          ? state.wishlist.filter(id => id !== action.id)
          : [...state.wishlist, action.id],
      };

    case 'ADD_RECENTLY_VIEWED': {
      const filtered = state.recentlyViewed.filter(r => r.id !== action.ring.id);
      return { ...state, recentlyViewed: [action.ring, ...filtered].slice(0, 6) };
    }

    case 'SET_CART_OPEN':
      return { ...state, cartOpen: action.open };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface StoreCtx {
  cart: CartItem[];
  wishlist: number[];
  recentlyViewed: StoreRing[];
  cartOpen: boolean;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  addToCart: (ring: StoreRing, customization?: Customization) => void;
  removeFromCart: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  toggleWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  addToRecentlyViewed: (ring: StoreRing) => void;
  setCartOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreCtx | null>(null);
const STORAGE_KEY = 'elegance_store_v1';

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  // Rehydrate from localStorage on mount (cart + wishlist only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { cart, wishlist } = JSON.parse(raw) as { cart: CartItem[]; wishlist: number[] };
        if (Array.isArray(cart) && Array.isArray(wishlist)) {
          dispatch({ type: 'HYDRATE', cart, wishlist });
        }
      }
    } catch { /* ignore corrupt storage */ }
  }, []);

  // Persist cart + wishlist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart: state.cart, wishlist: state.wishlist }));
    } catch { /* quota exceeded — ignore */ }
  }, [state.cart, state.wishlist]);

  const cartCount = state.cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = state.cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  const addToCart = useCallback((ring: StoreRing, customization?: Customization) => {
    dispatch({ type: 'ADD_TO_CART', ring, customization });
  }, []);

  const removeFromCart = useCallback((key: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', key });
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    dispatch({ type: 'UPDATE_QTY', key, qty });
  }, []);

  const toggleWishlist = useCallback((id: number) => {
    dispatch({ type: 'TOGGLE_WISHLIST', id });
  }, []);

  const addToRecentlyViewed = useCallback((ring: StoreRing) => {
    dispatch({ type: 'ADD_RECENTLY_VIEWED', ring });
  }, []);

  const setCartOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_CART_OPEN', open });
  }, []);

  const value: StoreCtx = {
    cart: state.cart,
    wishlist: state.wishlist,
    recentlyViewed: state.recentlyViewed,
    cartOpen: state.cartOpen,
    cartCount,
    cartTotal,
    wishlistCount: state.wishlist.length,
    addToCart,
    removeFromCart,
    updateQty,
    toggleWishlist,
    isInWishlist: (id: number) => state.wishlist.includes(id),
    addToRecentlyViewed,
    setCartOpen,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreCtx {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
}
