
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { BottomNav } from "./navigation/BottomNav";
import SimpleSidebar from "./navigation/SimpleSidebar";
import { Footer } from "./Footer";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { eventBus, EVENTS } from "@/services/events/EventBus";

export function ModernRootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Fermer la sidebar si l'URL change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Ajouter un effet de scroll pour le header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Publier l'événement lors du changement de route
  useEffect(() => {
    eventBus.publish(EVENTS.NAVIGATION.ROUTE_CHANGED, {
      from: "unknown",
      to: location.pathname,
      timestamp: Date.now()
    });
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Déterminer le titre de la page en fonction du chemin
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === "/") return "Accueil";
    if (path.startsWith("/explore")) return "Explorer";
    if (path.startsWith("/personal")) return "Mon Univers";
    if (path.startsWith("/social")) return "Communauté";
    if (path.startsWith("/profile")) return "Profil";
    if (path.startsWith("/boutiques")) return "Boutiques";
    if (path.startsWith("/admin")) return "Administration";
    
    // Par défaut, capturez juste le dernier segment du chemin
    const segments = path.split("/").filter(Boolean);
    if (segments.length > 0) {
      return segments[segments.length - 1]
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    
    return "FRING!";
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground flex-col">
      {/* En-tête (Header) avec effet de scroll */}
      <Header 
        onMenuToggle={toggleSidebar} 
        className={cn(
          "transition-all duration-200 print:hidden z-30",
          scrolled && "shadow-sm bg-background/90 backdrop-blur-sm"
        )}
      />
      
      <div className="flex flex-1 pt-16">
        {/* Barre latérale (Menu) */}
        <SimpleSidebar 
          isMobileOpen={sidebarOpen} 
          onMobileClose={() => setSidebarOpen(false)}
          className="print:hidden"
        />
        
        {/* Contenu principal */}
        <div className="flex-1 flex flex-col md:ml-64">
          {/* Titre de la page (visible seulement sur certaines routes) */}
          {!location.pathname.startsWith("/admin") && (
            <div className="px-4 md:px-8 py-4 border-b border-border/50 hidden md:block print:hidden">
              <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
            </div>
          )}
          
          {/* Contenu principal */}
          <main className="flex-1 pb-16 md:pb-8 overflow-auto">
            <Outlet />
          </main>
          
          {/* Pied de page */}
          <Footer className="print:hidden" />
          
          {/* Navigation mobile */}
          <BottomNav 
            onMenuClick={() => setSidebarOpen(true)} 
            className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background print:hidden" 
          />
        </div>
      </div>
      
      {/* Système de notifications toast */}
      <Toaster />
    </div>
  );
}

export default ModernRootLayout;
