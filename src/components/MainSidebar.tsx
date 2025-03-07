
import React, { useMemo } from "react";
import { Logo } from "@/components/Logo";
import { ModuleMenu } from "@/components/navigation/ModuleMenu";
import { UserButton } from "@/components/UserButton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MainSidebarProps {
  className?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const MainSidebar: React.FC<MainSidebarProps> = ({ 
  className,
  isMobileOpen = false,
  onMobileClose
}) => {
  // Classes CSS optimisées et mémorisées
  const sidebarClasses = useMemo(() => cn(
    "fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-gray-200 pt-5 pb-4 flex flex-col",
    "md:z-30 md:pt-20 md:translate-x-0 transition-transform duration-200 ease-out",
    isMobileOpen ? "translate-x-0 shadow-lg" : "-translate-x-full md:translate-x-0",
    className
  ), [isMobileOpen, className]);
  
  const overlayClasses = useMemo(() => cn(
    "fixed inset-0 bg-black/50 z-40 md:hidden",
    isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none",
    "transition-opacity duration-200 ease-out"
  ), [isMobileOpen]);

  return (
    <>
      {/* Overlay pour mobile */}
      <div 
        className={overlayClasses}
        onClick={onMobileClose}
      />
      
      {/* Sidebar principal */}
      <aside className={sidebarClasses}>
        {/* En-tête avec logo */}
        <div className="px-4 flex items-center justify-between md:hidden">
          <Logo size="sm" />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Fermer le menu</span>
          </Button>
        </div>
        
        <Separator className="my-4 md:hidden" />
        
        {/* Menu principal simplifié */}
        <div className="flex-1 px-3 overflow-y-auto">
          <ModuleMenu />
        </div>
        
        {/* Profil utilisateur */}
        <div className="px-3 mt-2 mb-2">
          <UserButton className="w-full" />
        </div>
      </aside>
    </>
  );
};

export default MainSidebar;
