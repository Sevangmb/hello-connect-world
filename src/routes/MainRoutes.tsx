
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { RootLayout } from '@/components/RootLayout';
import App from '@/App';
import Auth from '@/pages/Auth';
import AdminLogin from '@/pages/AdminLogin';
import NotFound from '@/pages/NotFound';
import Home from '@/pages/Home';

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

// Import du service d'événements
import { eventBus, EVENTS } from '@/services/events/EventBus';

const MainRoutes: React.FC = () => {
  console.log("MainRoutes: Rendu des routes principales");
  
  // Publier un événement lors du rendu initial des routes
  React.useEffect(() => {
    eventBus.publish(EVENTS.MODULE.INITIALIZED, {
      module: 'routes',
      timestamp: Date.now()
    });
  }, []);
  
  return (
    <Routes>
      {/* Routes d'authentification qui ne sont pas dans le layout principal */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Routes principales avec RootLayout comme wrapper */}
      <Route element={<RootLayout />}>
        {/* Route racine explicite pour Home */}
        <Route index element={<Home />} />
        <Route path="/" element={<Home />} />
        
        {/* Routes de modules */}
        <Route path="/module">
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
        <Route path="/feature">
          <Route path="scan-label" element={<ScanLabelFeature />} />
          <Route path="outfit-suggestion" element={<OutfitSuggestionFeature />} />
          <Route path="virtual-try-on" element={<VirtualTryOnFeature />} />
        </Route>
        
        {/* Raccourcis directs pour certaines fonctionnalités */}
        <Route path="/scan-label" element={<ScanLabelFeature />} />
        <Route path="/outfit-suggestion" element={<OutfitSuggestionFeature />} />
        <Route path="/virtual-try-on" element={<VirtualTryOnFeature />} />
        <Route path="/ocr" element={<OCRModule />} />
        
        {/* Ajout d'une redirection explicite pour le chemin des valises */}
        <Route path="/suitcases" element={<Navigate to="/wardrobe/suitcases" replace />} />
        
        {/* App contient toutes les routes imbriquées de l'application */}
        <Route path="/*" element={<App />} />
      </Route>

      {/* Route 404 explicite */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;
