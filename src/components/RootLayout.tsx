
import React, { useEffect, useState, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { BottomNav } from "./navigation/BottomNav";
import { Footer } from "./Footer";
import { UnifiedRightMenu } from "./navigation/UnifiedRightMenu";
import { eventBus } from "@/core/event-bus/EventBus";

export function RootLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Mémoriser le chemin actuel pour éviter les re-rendus inutiles
  const currentPath = useMemo(() => location.pathname, [location.pathname]);

  // Publier les événements de navigation lors du changement de route
  useEffect(() => {
    eventBus.publish('navigation:route-changed', {
      path: currentPath,
      timestamp: Date.now()
    });
  }, [currentPath]);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Menu unifié à gauche - visible en permanence sur desktop */}
      <UnifiedRightMenu
        isMobileOpen={menuOpen}
        onMobileClose={() => setMenuOpen(false)}
        className="left-0 right-auto border-r border-l-0"
        currentPath={currentPath}
      />
      
      {/* Contenu principal - s'étend jusqu'au menu */}
      <div className="flex-1 flex flex-col w-full">
        {/* En-tête (Header) */}
        <Header className="z-50" />
        
        {/* Contenu principal */}
        <main className="flex-1 pt-16 px-4 md:px-6 pb-16 md:pb-8">
          <div className="w-full h-full py-6">
            <Outlet />
          </div>
        </main>
        
        {/* Pied de page */}
        <Footer />
        
        {/* Navigation mobile */}
        <BottomNav 
          onMenuClick={() => setMenuOpen(true)} 
          className="md:hidden" 
        />
      </div>
    </div>
  );
}

export default RootLayout;
