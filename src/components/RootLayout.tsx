
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { BottomNav } from "./navigation/BottomNav";
import MainSidebar from "./MainSidebar";
import { Footer } from "./Footer";

export function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log("RootLayout: Rendu avec sidebarOpen =", sidebarOpen);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Barre latérale (Menu) */}
      <MainSidebar 
        isMobileOpen={sidebarOpen} 
        onMobileClose={() => setSidebarOpen(false)}
      />
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* En-tête (Header) */}
        <Header onMenuToggle={toggleSidebar} />
        
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
          onMenuClick={() => setSidebarOpen(true)} 
          className="md:hidden" 
        />
      </div>
    </div>
  );
}

export default RootLayout;
