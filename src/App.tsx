
import React, { Suspense, lazy } from 'react';
import {
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { useAuth } from '@/modules/auth';
import { ModuleGuard } from '@/components/modules/ModuleGuard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CartPage } from './components/cart';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin = lazy(() => import('./pages/admin/AdminDashboard')); // Changed from Admin to AdminDashboard
const AdminModules = lazy(() => import('./pages/admin/AdminModules'));
const AdminShops = lazy(() => import('./pages/admin/AdminShops'));
const Shops = lazy(() => import('./pages/Shops'));
const ShopDetail = lazy(() => import('./pages/ShopDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Create simple placeholder pages for legal/informational content
const Legal = () => <div className="container mx-auto p-8"><h1 className="text-2xl font-bold mb-4">Mentions légales</h1><p>Contenu à venir</p></div>;
const Terms = () => <div className="container mx-auto p-8"><h1 className="text-2xl font-bold mb-4">Conditions d'utilisation</h1><p>Contenu à venir</p></div>;
const Privacy = () => <div className="container mx-auto p-8"><h1 className="text-2xl font-bold mb-4">Politique de confidentialité</h1><p>Contenu à venir</p></div>;
const Contact = () => <div className="container mx-auto p-8"><h1 className="text-2xl font-bold mb-4">Contact</h1><p>Contenu à venir</p></div>;
const About = () => <div className="container mx-auto p-8"><h1 className="text-2xl font-bold mb-4">À propos</h1><p>Contenu à venir</p></div>;

function App() {
  const { user } = useAuth();

  // Create a fallback UI for error boundary
  const fallbackUI = (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Une erreur est survenue</h2>
        <p className="mb-4">Nous sommes désolés pour ce désagrément.</p>
        <button 
          onClick={() => window.location.href = '/'} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallbackUI}>
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
          <Route path="/cart" element={<ModuleGuard moduleCode="shop"><CartPage /></ModuleGuard>} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
