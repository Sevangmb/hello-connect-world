
import { useMenu } from "@/hooks/menu";
import { moduleMenuCoordinator } from "@/services/coordination/ModuleMenuCoordinator";
import { MenuItem } from "@/services/menu/types";
import { useEffect, useState } from "react";
import { useModules } from "@/hooks/modules/useModules";

/**
 * Hook pour gérer la visibilité des modules dans le menu
 */
export const useModuleVisibility = (category: string) => {
  const { menuItems, loading, isUserAdmin, refreshMenu } = useMenu({ category });
  const [visibleItems, setVisibleItems] = useState<MenuItem[]>([]);
  const { modules } = useModules();
  
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
          modules // Passer les modules chargés
        );
      }
      
      return item.is_visible !== false;
    });
    
    console.log(`useModuleVisibility: Filtrage des éléments de menu pour la catégorie ${category}:`, 
      `${filteredItems.length}/${menuItems.length} éléments visibles`);
    
    setVisibleItems(filteredItems);
  }, [menuItems, isUserAdmin, category, modules]);
  
  return {
    menuItems: visibleItems,
    loading,
    isUserAdmin,
    refreshMenu
  };
};
