import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { StoreProvider } from './store/StoreContext';
import { AdminProvider } from './store/adminStore';
import { Navigation } from './components/Navigation';
import { CartDrawer } from './components/CartDrawer';

const HomePage        = lazy(() => import('./pages/HomePage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const ProductPage     = lazy(() => import('./pages/ProductPage'));
const CartPage        = lazy(() => import('./pages/CartPage'));
const AdvisorPage     = lazy(() => import('./pages/AdvisorPage'));
const AdminLogin      = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard  = lazy(() => import('./pages/admin/AdminDashboard'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AdminLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <div className="w-8 h-8 border-2 border-amber-400/40 border-t-amber-400 rounded-full animate-spin" />
    </div>
  );
}

// Renders storefront chrome (Nav + CartDrawer) only on non-admin routes
function StorefrontShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <>
      {!isAdmin && <Navigation />}
      {!isAdmin && <CartDrawer />}
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <StoreProvider>
          <Suspense fallback={<PageLoader />}>
            <StorefrontShell>
              <Routes>
                {/* Storefront */}
                <Route path="/"            element={<HomePage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart"        element={<CartPage />} />
                <Route path="/advisor"     element={<AdvisorPage />} />

                {/* Admin */}
                <Route path="/admin/login" element={<Suspense fallback={<AdminLoader />}><AdminLogin /></Suspense>} />
                <Route path="/admin"       element={<Suspense fallback={<AdminLoader />}><AdminDashboard /></Suspense>} />
              </Routes>
            </StorefrontShell>
          </Suspense>
        </StoreProvider>
      </AdminProvider>
    </BrowserRouter>
  );
}
