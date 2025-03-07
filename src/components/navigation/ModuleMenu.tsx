
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import MenuCategories from "./MenuCategories";
import AdminMenuSection from "./AdminMenuSection";
import { useModuleMenuEvents } from "./hooks/useModuleMenuEvents";

/**
 * Composant de menu principal - séparé selon les principes de la Clean Architecture
 * Ce composant agit maintenant uniquement comme un conteneur qui assemble d'autres composants
 */
export const ModuleMenu: React.FC = () => {
  // Obtenir les données nécessaires à partir du hook
  const { isUserAdmin } = useModuleMenuEvents();
  
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2 w-full">
        {/* Menus par catégorie */}
        <MenuCategories />
        
        {/* Menu d'administration - uniquement rendu si admin */}
        <AdminMenuSection isUserAdmin={isUserAdmin} />
      </div>
    </TooltipProvider>
  );
};

export default ModuleMenu;
