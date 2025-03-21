
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { BottomNav } from "./navigation/BottomNav";
import { Footer } from "./Footer";
import { UnifiedRightMenu } from "./navigation/UnifiedRightMenu";

export function ModernRootLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Menu unifié à gauche */}
      <UnifiedRightMenu
        isMobileOpen={menuOpen}
        onMobileClose={() => setMenuOpen(false)}
        className="left-0 right-auto border-r border-l-0"
      />
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* En-tête (Header) */}
        <Header className="z-50" />
        
        {/* Contenu principal */}
        <main className="flex-1 pt-16 md:pt-20 px-4 md:px-8 pb-16 md:pb-8">
          <div className="container mx-auto max-w-7xl h-full py-6">
            <Outlet />
          </div>
        </main>
        
        {/* Pied de page */}
        <Footer />
        
        {/* Navigation mobile */}
        <BottomNav 
          onMenuClick={toggleMenu}
          className="md:hidden" 
        />
      </div>
    </div>
  );
}

export default ModernRootLayout;
