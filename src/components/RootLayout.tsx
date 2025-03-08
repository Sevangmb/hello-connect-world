
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { BottomNav } from "./navigation/BottomNav";
import MainSidebar from "./MainSidebar";
import { Footer } from "./Footer";
import { UnifiedRightMenu } from "./navigation/UnifiedRightMenu";

export function RootLayout() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightMenuOpen, setRightMenuOpen] = useState(false);

  console.log("RootLayout: Rendu avec sidebarOpen =", leftSidebarOpen);

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(prev => !prev);
    // Fermer le menu de droite quand le menu de gauche est ouvert
    if (!leftSidebarOpen) {
      setRightMenuOpen(false);
    }
  };

  const toggleRightMenu = () => {
    setRightMenuOpen(prev => !prev);
    // Fermer le menu de gauche quand le menu de droite est ouvert
    if (!rightMenuOpen) {
      setLeftSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Barre latérale gauche (Menu) */}
      <MainSidebar 
        isMobileOpen={leftSidebarOpen} 
        onMobileClose={() => setLeftSidebarOpen(false)}
      />
      
      {/* Menu unifié à droite */}
      <UnifiedRightMenu
        isMobileOpen={rightMenuOpen}
        onMobileClose={() => setRightMenuOpen(false)}
      />
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* En-tête (Header) */}
        <Header 
          onMenuToggle={toggleLeftSidebar} 
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
          onMenuClick={() => setLeftSidebarOpen(true)} 
          className="md:hidden" 
        />
      </div>
    </div>
  );
}

export default RootLayout;
