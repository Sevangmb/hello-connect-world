
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { BottomNav } from "./navigation/BottomNav";
import { Footer } from "./Footer";
import { UnifiedRightMenu } from "./navigation/UnifiedRightMenu";

export function RootLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  console.log("RootLayout: Rendu avec menuOpen =", menuOpen);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
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
        <main className="flex-1 pt-16 px-4 md:px-8 pb-16 md:pb-8">
          <div className="container mx-auto h-full py-6">
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
