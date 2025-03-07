import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { Shell } from './components/Shell';
import { AuthProvider } from './hooks/useAuth';
import { ModuleGuard } from './components/ModuleGuard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ShopList } from './components/shop/ShopList';
import { ShopDetail } from './components/shop/ShopDetail';
import { CartPage } from './components/cart';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin = lazy(() => import('./pages/admin/Admin'));
const AdminModules = lazy(() => import('./pages/admin/AdminModules'));
const AdminShops = lazy(() => import('./pages/admin/AdminShops'));
const Shops = lazy(() => import('./pages/Shops'));
const Legal = lazy(() => import('./pages/Legal'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Shell>
          <ErrorBoundary>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<ModuleGuard moduleCode="admin"><Admin /></ModuleGuard>} />
                <Route path="/admin/modules" element={<ModuleGuard moduleCode="admin"><AdminModules /></ModuleGuard>} />
                 <Route path="/admin/shops" element={<ModuleGuard moduleCode="admin"><AdminShops /></ModuleGuard>} />
                <Route path="/boutiques" element={<ModuleGuard moduleCode="shop"><Shops /></ModuleGuard>} />
                <Route path="/boutiques/:shopId" element={<ModuleGuard moduleCode="shop"><ShopDetail /></ModuleGuard>} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
                {
                  path: "/cart",
                  element: (
                    <ModuleGuard moduleCode="shop">
                      <CartPage />
                    </ModuleGuard>
                  ),
                },
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </Shell>
      </AuthProvider>
    </Router>
  );
}

export default App;
