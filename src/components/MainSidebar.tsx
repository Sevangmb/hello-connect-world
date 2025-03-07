
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
  isOpen?: boolean; // Support de l'ancienne API
  onClose?: () => void; // Support de l'ancienne API
}

const MainSidebar: React.FC<MainSidebarProps> = ({ 
  className,
  isMobileOpen = false,
  onMobileClose,
  isOpen, // Support de l'ancienne API
  onClose // Support de l'ancienne API
}) => {
  // Utiliser isOpen et onClose si isMobileOpen/onMobileClose ne sont pas définis
  const mobileOpen = useMemo(() => isMobileOpen || isOpen || false, [isMobileOpen, isOpen]);
  const handleClose = useMemo(() => onMobileClose || onClose, [onMobileClose, onClose]);
  
  // Optimisation de l'animation CSS pour éviter les problèmes de clignotement
  const sidebarClasses = useMemo(() => cn(
    "fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-gray-200 pt-5 pb-4 flex flex-col",
    "md:z-30 md:pt-20 md:translate-x-0 transition-transform duration-200 ease-out",
    mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
    className
  ), [mobileOpen, className]);
  
  // Optimisation de l'overlay pour éviter les bugs d'affichage
  const overlayClasses = useMemo(() => cn(
    "fixed inset-0 bg-black/50 z-40 md:hidden",
    mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none",
    "transition-opacity duration-200 ease-out"
  ), [mobileOpen]);

  // Ajout de logs pour déboguer
  console.log("MainSidebar: Rendu avec mobileOpen =", mobileOpen);
  
  return (
    <>
      {/* Version mobile avec overlay - toujours présent mais avec opacity contrôlée */}
      <div 
        className={overlayClasses}
        onClick={handleClose}
      />
      
      {/* Sidebar - toujours présent mais avec transform contrôlé */}
      <aside className={sidebarClasses}>
        {/* En-tête avec logo */}
        <div className="px-4 flex items-center justify-between md:hidden">
          <Logo size="sm" />
          
          {/* Bouton de fermeture (mobile uniquement) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Fermer le menu</span>
          </Button>
        </div>
        
        <Separator className="my-4 md:hidden" />
        
        {/* Menu des modules */}
        <div className="flex-1 px-3 overflow-y-auto">
          <ModuleMenu />
        </div>
        
        {/* Pied de page avec profil utilisateur */}
        <div className="px-3 mt-2 mb-1">
          <UserButton className="w-full" />
        </div>
      </aside>
    </>
  );
};

export default MainSidebar;
