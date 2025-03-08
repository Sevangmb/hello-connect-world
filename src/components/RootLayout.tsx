
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { BottomNav } from "./navigation/BottomNav";
import { Footer } from "./Footer";
import { UnifiedRightMenu } from "./navigation/UnifiedRightMenu";

export function RootLayout() {
  const [rightMenuOpen, setRightMenuOpen] = useState(false);

  console.log("RootLayout: Rendu avec rightMenuOpen =", rightMenuOpen);

  const toggleRightMenu = () => {
    setRightMenuOpen(prev => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Menu unifié à droite */}
      <UnifiedRightMenu
        isMobileOpen={rightMenuOpen}
        onMobileClose={() => setRightMenuOpen(false)}
      />
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* En-tête (Header) */}
        <Header 
          onRightMenuToggle={toggleRightMenu}
        />
        
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
          onMenuClick={() => setRightMenuOpen(true)} 
          className="md:hidden" 
        />
      </div>
    </div>
  );
}

export default RootLayout;
