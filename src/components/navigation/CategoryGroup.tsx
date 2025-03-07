
import React, { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useMenu } from "@/hooks/menu";
import { DynamicMenu } from "@/components/menu/DynamicMenu";
import { eventBus } from "@/core/event-bus/EventBus";
import { MODULE_MENU_EVENTS } from "@/services/coordination/ModuleMenuCoordinator";
import { CartIcon } from "@/components/cart/CartIcon";
import { CategoryGroupProps } from "./types/moduleMenu";

export const CategoryGroup: React.FC<CategoryGroupProps> = ({ title, category }) => {
  const { menuItems, loading, isUserAdmin, refreshMenu } = useMenu({ category });
  
  // Surveiller les changements de statut de module pour rafraîchir le menu
  useEffect(() => {
    const handleModuleStatusChange = () => {
      console.log(`Rafraîchissement du menu pour la catégorie ${category} après changement de statut de module`);
      refreshMenu();
    };
    
    const unsubscribe = eventBus.subscribe(MODULE_MENU_EVENTS.MODULE_STATUS_CHANGED, handleModuleStatusChange);
    
    return () => {
      unsubscribe(); // Correctly use the returned function to unsubscribe
    };
  }, [category, refreshMenu]);
  
  // Éviter de monter/démonter les catégories pour réduire le clignotement
  // Ne pas afficher la catégorie admin si l'utilisateur n'est pas admin
  if (category === 'admin' && !isUserAdmin) {
    return null;
  }
  
  // Ajouter l'icône du panier pour la catégorie marketplace
  if (category === 'marketplace') {
    return (
      <div className="space-y-1 mb-6">
        <div className="flex items-center justify-between px-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {title}
          </h3>
          <CartIcon className="ml-auto text-gray-500 hover:text-primary transition-colors" />
        </div>
        <DynamicMenu category={category} />
      </div>
    );
  }
  
  // Utiliser une approche qui évite les changements brusques de hauteur
  return (
    <div className="space-y-1 mb-6">
      <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
      <DynamicMenu category={category} />
    </div>
  );
};

export default CategoryGroup;
