import React, { useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { RootLayout } from '@/components/RootLayout';
import Auth from '@/pages/Auth';
import AdminLogin from '@/pages/AdminLogin';
import NotFound from '@/pages/NotFound';
import Home from '@/pages/Home';
import { eventBus } from '@/core/event-bus/EventBus';
import Personal from '@/pages/Personal';
import Favorites from '@/pages/Favorites';
import Settings from '@/pages/Profile/Settings';
import Friends from '@/pages/Friends';
import Messages from '@/pages/Messages';

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
  PERSONAL: '/personal',
  FAVORITES: '/favorites',
  FRIENDS: '/friends',
  MESSAGES: '/messages',
  PROFILE: {
    ROOT: '/profile',
    SETTINGS: '/profile/settings',
  },
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
  SHORTCUTS: {
    SCAN_LABEL: '/scan-label',
    OUTFIT_SUGGESTION: '/outfit-suggestion',
    VIRTUAL_TRY_ON: '/virtual-try-on',
    OCR: '/ocr',
  },
  REDIRECTS: {
    SUITCASES: '/suitcases',
    SUITCASE_DETAIL: '/suitcases/:id',
  },
  NOT_FOUND: '/404',
};

const MainRoutes: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.log("MainRoutes - Initialisation des routes:", location.pathname);
    eventBus.publish('app:routes-initialized', {
      path: location.pathname,
      timestamp: Date.now()
    });
  }, [location.pathname]);
  
  useEffect(() => {
    if (location.pathname === ROUTES.HOME) {
      const modulePreloader = async () => {
        try {
          const moduleImports = [
            import('@/pages/Personal'),
            import('@/pages/Favorites'),
            import('@/pages/Profile/Settings'),
            import('@/pages/Friends'),
            import('@/pages/Messages')
          ];
          
          await Promise.all(moduleImports);
          console.log("Préchargement des modules terminé");
        } catch (error) {
          console.error("Erreur lors du préchargement des modules:", error);
        }
      };
      
      const timer = setTimeout(modulePreloader, 2000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);
  
  return (
    <Routes>
      <Route path={ROUTES.AUTH} element={<Auth />} />
      <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
      
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path={ROUTES.HOME} element={<Home />} />
        
        <Route path={ROUTES.PERSONAL} element={<Personal />} />
        <Route path={ROUTES.FAVORITES} element={<Favorites />} />
        <Route path={ROUTES.FRIENDS} element={<Friends />} />
        <Route path={ROUTES.MESSAGES} element={<Messages />} />
        <Route path={ROUTES.PROFILE.SETTINGS} element={<Settings />} />
        
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
        
        <Route path={ROUTES.FEATURES.ROOT}>
          <Route path="scan-label" element={<ScanLabelFeature />} />
          <Route path="outfit-suggestion" element={<OutfitSuggestionFeature />} />
          <Route path="virtual-try-on" element={<VirtualTryOnFeature />} />
        </Route>
        
        <Route path={ROUTES.SHORTCUTS.SCAN_LABEL} element={<ScanLabelFeature />} />
        <Route path={ROUTES.SHORTCUTS.OUTFIT_SUGGESTION} element={<OutfitSuggestionFeature />} />
        <Route path={ROUTES.SHORTCUTS.VIRTUAL_TRY_ON} element={<VirtualTryOnFeature />} />
        <Route path={ROUTES.SHORTCUTS.OCR} element={<OCRModule />} />
        
        <Route path={ROUTES.REDIRECTS.SUITCASES} element={<Navigate to="/wardrobe/suitcases" replace />} />
        <Route path={ROUTES.REDIRECTS.SUITCASE_DETAIL} element={
          <Navigate 
            to={`/wardrobe/suitcases/${location.pathname.split('/').pop()}`} 
            replace 
          />
        } />
        
        <Route path="/*" element={<App />} />
      </Route>

      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;
