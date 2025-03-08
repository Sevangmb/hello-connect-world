
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import { Toaster } from "@/components/ui/toaster";

/**
 * Nouveau layout d'administration avec navigation améliorée
 */
export function NewAdminLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded(prev => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header avec bouton de navigation mobile */}
      <AdminHeader 
        onMenuToggle={toggleMobileMenu}
        className="z-30 print:hidden"
      />

      {/* Overlay pour mobile */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-200",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar avec animation de largeur */}
        <div 
          className={cn(
            "fixed z-20 top-16 bottom-0 md:relative print:hidden",
            "transition-all duration-300 ease-in-out",
            "border-r border-border bg-card",
            sidebarExpanded ? "w-64" : "w-16",
            mobileMenuOpen ? "left-0" : "-left-64 md:left-0"
          )}
        >
          <div className="flex flex-col h-full">
            <AdminSidebar collapsed={!sidebarExpanded && !mobileMenuOpen} />
            
            {/* Bouton pour replier/déplier sur desktop */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute -right-3 top-4 hidden md:flex rounded-full border shadow-sm bg-background"
              onClick={toggleSidebar}
            >
              {sidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            
            {/* Bouton pour fermer sur mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Contenu principal */}
        <main 
          className={cn(
            "flex-1 overflow-auto transition-all duration-300 ease-in-out",
            "bg-muted/50",
            sidebarExpanded ? "md:ml-64" : "md:ml-16"
          )}
        >
          <div className="container max-w-7xl p-4 md:p-6 lg:p-8 mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Toasts */}
      <Toaster />
    </div>
  );
}

export default NewAdminLayout;
