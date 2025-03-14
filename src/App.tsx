import React, { Suspense, lazy, useEffect } from 'react';
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { useAuth } from '@/modules/auth';
import { ModuleGuard } from '@/components/modules/ModuleGuard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CartPage } from './components/cart';
import NotFound from './pages/NotFound';
import { eventBus, EVENTS } from './services/events/EventBus';
import Friends from './pages/Friends';
import Messages from './pages/Messages';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminModules = lazy(() => import('./pages/admin/AdminModules'));
const AdminShops = lazy(() => import('./pages/admin/AdminShops'));
const Shops = lazy(() => import('./pages/Shops'));
const ShopDetail = lazy(() => import('./pages/ShopDetail'));
const Explore = lazy(() => import('./pages/Explore'));
const Personal = lazy(() => import('./pages/Personal'));
const Challenges = lazy(() => import('./pages/Challenges'));
const ChallengeDetail = lazy(() => import('./pages/ChallengeDetail'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Outfits = lazy(() => import('./pages/Outfits'));
const OutfitDetail = lazy(() => import('./pages/OutfitDetail'));
const Search = lazy(() => import('./pages/Search'));
const Settings = lazy(() => import('./pages/Settings'));
const Suitcases = lazy(() => import('./pages/Suitcases'));
const SuitcaseDetail = lazy(() => import('./pages/SuitcaseDetail'));
const Valises = lazy(() => import('./pages/Valises'));
const ValiseDetail = lazy(() => import('./pages/ValiseDetail'));
const Favorites = lazy(() => import('./pages/Favorites'));

// Create simple placeholder pages for legal/informational content
const Legal = () => <div className="container mx-auto p-8"><h1 className="text-2xl font-bold mb-4">Mentions légales</h1><p>Contenu à venir</p></div>;
const Terms = () => <div className="container mx-auto p-8"><h1 className="text-2xl font-bold mb-4">Conditions d'utilisation</h1><p>Contenu à venir</p></div>;
const Privacy = () => <div className="container mx-auto p-8"><h1 className="text-2xl font-bold mb-4">Politique de confidentialité</h1><p>Contenu à venir</p></div>;
const Contact = () => <div className="container mx-auto p-8"><h1 className="text-2xl font-bold mb-4">Contact</h1><p>Contenu à venir</p></div>;
const About = () => <div className="container mx-auto p-8"><h1 className="text-2xl font-bold mb-4">À propos</h1><p>Contenu à venir</p></div>;

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Publier les événements de navigation
  useEffect(() => {
    eventBus.publish(EVENTS.NAVIGATION.ROUTE_CHANGED, {
      path: location.pathname,
      timestamp: Date.now()
    });
  }, [location.pathname]);

  // Create a fallback UI for error boundary
  const fallbackUI = (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Une erreur est survenue</h2>
        <p className="mb-4">Nous sommes désolés pour ce désagrément.</p>
        <button 
          onClick={() => navigate('/')} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallbackUI}>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
        <Routes>
          {/* Pages principales */}
          <Route path="profile" element={<Profile />} />
          <Route path="profile/settings" element={<Settings />} />
          <Route path="explore" element={<Explore />} />
          <Route path="personal" element={<Personal />} />
          <Route path="search" element={<Search />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="friends" element={<Friends />} />
          <Route path="messages" element={<Messages />} />
          
          {/* Routes du module Social */}
          <Route path="social">
            <Route index element={<Navigate to="/social/challenges" replace />} />
            <Route path="challenges" element={<ModuleGuard moduleCode="social"><Challenges /></ModuleGuard>} />
            <Route path="challenges/:id" element={<ModuleGuard moduleCode="social"><ChallengeDetail /></ModuleGuard>} />
            <Route path="friends" element={<Navigate to="/friends" replace />} />
            <Route path="messages" element={<Navigate to="/messages" replace />} />
          </Route>
          
          {/* Routes du module Wardrobe */}
          <Route path="wardrobe">
            <Route index element={<Navigate to="/personal" replace />} />
            <Route path="outfits" element={<ModuleGuard moduleCode="wardrobe"><Outfits /></ModuleGuard>} />
            <Route path="outfits/:id" element={<ModuleGuard moduleCode="wardrobe"><OutfitDetail /></ModuleGuard>} />
            <Route path="suitcases" element={<ModuleGuard moduleCode="wardrobe"><Suitcases /></ModuleGuard>} />
            <Route path="suitcases/:id" element={<ModuleGuard moduleCode="wardrobe"><SuitcaseDetail /></ModuleGuard>} />
          </Route>
          
          {/* Redirection pour compatibilité avec les anciens liens */}
          <Route path="suitcases" element={<Navigate to="/wardrobe/suitcases" replace />} />
          <Route path="suitcases/:id" element={<Navigate to={`/wardrobe/suitcases/${location.pathname.split('/').pop()}`} replace />} />
          <Route path="outfits" element={<Navigate to="/wardrobe/outfits" replace />} />
          <Route path="outfits/:id" element={<Navigate to={`/wardrobe/outfits/${location.pathname.split('/').pop()}`} replace />} />
          
          {/* Routes du module Admin */}
          <Route path="admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="admin/dashboard" element={<ModuleGuard moduleCode="admin"><Admin /></ModuleGuard>} />
          <Route path="admin/modules" element={<ModuleGuard moduleCode="admin"><AdminModules /></ModuleGuard>} />
          <Route path="admin/shops" element={<ModuleGuard moduleCode="admin"><AdminShops /></ModuleGuard>} />
          
          {/* Routes du module Shop */}
          <Route path="boutiques" element={<ModuleGuard moduleCode="shop"><Shops /></ModuleGuard>} />
          <Route path="boutiques/:shopId" element={<ModuleGuard moduleCode="shop"><ShopDetail /></ModuleGuard>} />
          <Route path="cart" element={<ModuleGuard moduleCode="shop"><CartPage /></ModuleGuard>} />
          
          {/* Pages informatives */}
          <Route path="legal" element={<Legal />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          
          {/* Routes pour les valises */}
          <Route path="/valises" element={<Valises />} />
          <Route path="/valises/:id" element={<ValiseDetail />} />
          
          {/* Page 404 et redirection */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
