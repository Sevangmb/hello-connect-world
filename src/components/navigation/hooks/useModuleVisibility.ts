
import { useMenu } from "@/hooks/menu";
import { moduleMenuCoordinator } from "@/services/coordination/ModuleMenuCoordinator";
import { MenuItem } from "@/services/menu/types";
import { useEffect, useState, useCallback } from "react";
import { useModules } from "@/hooks/modules/useModules";

/**
 * Hook pour gérer la visibilité des modules dans le menu
 */
export const useModuleVisibility = (category: string) => {
  const { menuItems, loading, isUserAdmin, refreshMenu } = useMenu({ category });
  const [visibleItems, setVisibleItems] = useState<MenuItem[]>([]);
  const { modules, isInitialized } = useModules();
  
  // Fonction de filtrage des éléments de menu
  const filterMenuItems = useCallback(() => {
    if (!menuItems || !isInitialized) return;
    
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
          modules
        );
      }
      
      return item.is_visible !== false;
    });
    
    console.log(`useModuleVisibility: Filtrage des éléments de menu pour la catégorie ${category}:`, 
      `${filteredItems.length}/${menuItems.length} éléments visibles`);
    
    setVisibleItems(filteredItems);
  }, [menuItems, isUserAdmin, category, modules, isInitialized]);
  
  // Filtrer les éléments de menu lorsque les dépendances changent
  useEffect(() => {
    filterMenuItems();
  }, [filterMenuItems]);
  
  return {
    menuItems: visibleItems,
    loading: loading || !isInitialized,
    isUserAdmin,
    refreshMenu
  };
};
