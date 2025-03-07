
import { useMenu } from "@/hooks/menu";
import { moduleMenuCoordinator } from "@/services/coordination/ModuleMenuCoordinator";
import { MenuItem } from "@/services/menu/types";
import { useEffect, useState } from "react";

/**
 * Hook pour gérer la visibilité des modules dans le menu
 */
export const useModuleVisibility = (category: string) => {
  const { menuItems, loading, isUserAdmin, refreshMenu } = useMenu({ category });
  const [visibleItems, setVisibleItems] = useState<MenuItem[]>([]);
  
  // Filtrer les éléments en fonction de la visibilité du module
  useEffect(() => {
    if (!menuItems) return;
    
    // Appliquer les règles de visibilité des modules
    const filteredItems = menuItems.filter(item => {
      // Si l'élément nécessite d'être admin et que l'utilisateur n'est pas admin, le cacher
      if (item.requires_admin && !isUserAdmin) {
        return false;
      }
      
      // Si l'élément est lié à un module, vérifier la visibilité du module
      if (item.module_code) {
        return moduleMenuCoordinator.isModuleVisibleInMenu(
          item.module_code, 
          [] // Nous passons un tableau vide car le coordinateur a son propre cache interne
        );
      }
      
      return item.is_visible !== false;
    });
    
    setVisibleItems(filteredItems);
  }, [menuItems, isUserAdmin]);
  
  return {
    menuItems: visibleItems,
    loading,
    isUserAdmin,
    refreshMenu
  };
};
