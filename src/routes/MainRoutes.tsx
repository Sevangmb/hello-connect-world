import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { RootLayout } from '@/components/RootLayout';
import Auth from '@/pages/Auth';
import AdminLogin from '@/pages/AdminLogin';
import NotFound from '@/pages/NotFound';
import Home from '@/pages/Home';
import { eventBus } from '@/core/event-bus/EventBus';

// Pages de modules
import CoreModule from '@/pages/modules/CoreModule';
import WardrobeModule from '@/pages/modules/WardrobeModule';
import SocialModule from '@/pages/modules/SocialModule';
import ShopModule from '@/pages/modules/ShopModule';
import AdminModule from '@/pages/modules/AdminModule';
import AIModule from '@/pages/modules/AIModule';
import OCRModule from '@/pages/modules/OCRModule';
import MarketplaceModule from '@/pages/modules/MarketplaceModule';

// Pages de fonctionnalités
import ScanLabelFeature from '@/pages/features/ScanLabelFeature';
import OutfitSuggestionFeature from '@/pages/features/OutfitSuggestionFeature';
import VirtualTryOnFeature from '@/pages/features/VirtualTryOnFeature';

// Import de l'App pour les routes imbriquées
import App from '@/App';

// Constantes pour les chemins
const ROUTES = {
  AUTH: '/auth',
  ADMIN_LOGIN: '/admin/login',
  HOME: '/',
  MODULES: {
    ROOT: '/module',
    CORE: '/module/core',
    WARDROBE: '/module/wardrobe',
    SOCIAL: '/module/social',
    SHOP: '/module/shop',
    ADMIN: '/module/admin',
    AI: '/module/ai',
    OCR: '/module/ocr',
    MARKETPLACE: '/module/marketplace',
  },
  FEATURES: {
    ROOT: '/feature',
    SCAN_LABEL: '/feature/scan-label',
    OUTFIT_SUGGESTION: '/feature/outfit-suggestion',
    VIRTUAL_TRY_ON: '/feature/virtual-try-on',
  },
  // Raccourcis
  SHORTCUTS: {
    SCAN_LABEL: '/scan-label',
    OUTFIT_SUGGESTION: '/outfit-suggestion',
    VIRTUAL_TRY_ON: '/virtual-try-on',
    OCR: '/ocr',
  },
  // Redirections
  REDIRECTS: {
    SUITCASES: '/suitcases',
    SUITCASE_DETAIL: '/suitcases/:id',
    FAVORITES: '/favorites',
  },
  NOT_FOUND: '/404',
};

const MainRoutes: React.FC = () => {
  // Initialisation du système d'événements pour les routes
  useEffect(() => {
    eventBus.publish('app:routes-initialized', {
      timestamp: Date.now()
    });
  }, []);
  
  return (
    <Routes>
      {/* Routes d'authentification qui ne sont pas dans le layout principal */}
      <Route path={ROUTES.AUTH} element={<Auth />} />
      <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
      
      {/* Routes principales avec RootLayout comme wrapper */}
      <Route element={<RootLayout />}>
        {/* Route racine explicite pour Home */}
        <Route index element={<Home />} />
        <Route path={ROUTES.HOME} element={<Home />} />
        
        {/* Routes de modules */}
        <Route path={ROUTES.MODULES.ROOT}>
          <Route path="core" element={<CoreModule />} />
          <Route path="wardrobe" element={<WardrobeModule />} />
          <Route path="social" element={<SocialModule />} />
          <Route path="shop" element={<ShopModule />} />
          <Route path="admin" element={<AdminModule />} />
          <Route path="ai" element={<AIModule />} />
          <Route path="ocr" element={<OCRModule />} />
          <Route path="marketplace" element={<MarketplaceModule />} />
        </Route>
        
        {/* Routes de fonctionnalités */}
        <Route path={ROUTES.FEATURES.ROOT}>
          <Route path="scan-label" element={<ScanLabelFeature />} />
          <Route path="outfit-suggestion" element={<OutfitSuggestionFeature />} />
          <Route path="virtual-try-on" element={<VirtualTryOnFeature />} />
        </Route>
        
        {/* Raccourcis directs pour certaines fonctionnalités */}
        <Route path={ROUTES.SHORTCUTS.SCAN_LABEL} element={<ScanLabelFeature />} />
        <Route path={ROUTES.SHORTCUTS.OUTFIT_SUGGESTION} element={<OutfitSuggestionFeature />} />
        <Route path={ROUTES.SHORTCUTS.VIRTUAL_TRY_ON} element={<VirtualTryOnFeature />} />
        <Route path={ROUTES.SHORTCUTS.OCR} element={<OCRModule />} />
        
        {/* Ajout d'une redirection explicite pour le chemin des valises */}
        <Route path={ROUTES.REDIRECTS.SUITCASES} element={<Navigate to="/wardrobe/suitcases" replace />} />
        <Route path={ROUTES.REDIRECTS.SUITCASE_DETAIL} element={<Navigate to={`/wardrobe/suitcases/${window.location.pathname.split('/').pop()}`} replace />} />
        
        {/* App contient toutes les routes imbriquées de l'application */}
        <Route path="/*" element={<App />} />
      </Route>

      {/* Route 404 explicite */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;
