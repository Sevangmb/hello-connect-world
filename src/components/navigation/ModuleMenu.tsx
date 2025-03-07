
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import MenuCategories from "./MenuCategories";
import AdminMenuSection from "./AdminMenuSection";
import { useModuleMenuEvents } from "./hooks/useModuleMenuEvents";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShopMenuSection } from "./ShopMenuSection";

/**
 * Composant de menu principal avec une expérience utilisateur améliorée
 */
export const ModuleMenu: React.FC = () => {
  // Obtenir les données nécessaires à partir du hook
  const { isUserAdmin, isShopOwner } = useModuleMenuEvents();
  
  return (
    <TooltipProvider>
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col gap-1 w-full pr-3">
          {/* Menus par catégorie */}
          <MenuCategories />
          
          {/* Séparateur avant les menus spéciaux */}
          {(isUserAdmin || isShopOwner) && <Separator className="my-3" />}
          
          {/* Menu de boutique - uniquement rendu si propriétaire de boutique */}
          {isShopOwner && <ShopMenuSection />}
          
          {/* Séparateur entre shop et admin */}
          {isUserAdmin && isShopOwner && <Separator className="my-3" />}
          
          {/* Menu d'administration - uniquement rendu si admin */}
          {isUserAdmin && <AdminMenuSection isUserAdmin={isUserAdmin} />}
        </div>
      </ScrollArea>
    </TooltipProvider>
  );
};

export default ModuleMenu;
