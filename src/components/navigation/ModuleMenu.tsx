
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import MenuCategories from "./MenuCategories";
import AdminMenuSection from "./AdminMenuSection";
import { useModuleMenuEvents } from "./hooks/useModuleMenuEvents";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

/**
 * Composant de menu principal - séparé selon les principes de la Clean Architecture
 * Ce composant agit maintenant uniquement comme un conteneur qui assemble d'autres composants
 */
export const ModuleMenu: React.FC = () => {
  // Obtenir les données nécessaires à partir du hook
  const { isUserAdmin } = useModuleMenuEvents();
  
  return (
    <TooltipProvider>
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col gap-1 w-full pr-3">
          {/* Menus par catégorie */}
          <MenuCategories />
          
          {/* Séparateur avant le menu d'administration */}
          {isUserAdmin && <Separator className="my-2" />}
          
          {/* Menu d'administration - uniquement rendu si admin */}
          <AdminMenuSection isUserAdmin={isUserAdmin} />
        </div>
      </ScrollArea>
    </TooltipProvider>
  );
};

export default ModuleMenu;
