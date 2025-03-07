
import { useEffect, useState, useCallback } from 'react';
import { useAllMenuItems, useMenuItemsByCategory, useMenuItemsByModule } from './useMenuItems';
import { useMenuCategories } from './useMenuCategories';
import { useAdminStatus } from './useAdminStatus';
import { MenuItem, MenuItemCategory } from '@/services/menu/types';
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_MENU_EVENTS } from '@/services/coordination/ModuleMenuCoordinator';

interface UseMenuOptions {
  category?: MenuItemCategory;
  moduleCode?: string;
  hierarchical?: boolean;
}

// Hook principal pour utiliser le menu
export const useMenu = (options: UseMenuOptions = {}) => {
  const { category, moduleCode, hierarchical = false } = options;
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtenir le statut d'administrateur
  const { isUserAdmin } = useAdminStatus();

  // Requêtes pour les éléments de menu
  const categoryQuery = useMenuItemsByCategory(category as MenuItemCategory);
  const moduleQuery = useMenuItemsByModule(moduleCode as string, isUserAdmin);
  const allItemsQuery = useAllMenuItems();

  // Catégories de menu
  const menuCategories = useMenuCategories(menuItems);

  // Fonction pour rafraîchir les données du menu
  const refreshMenu = useCallback(() => {
    console.log("useMenu: Rafraîchissement du menu");
    if (category) {
      categoryQuery.refetch();
    } else if (moduleCode) {
      moduleQuery.refetch();
    } else {
      allItemsQuery.refetch();
    }
  }, [category, moduleCode, categoryQuery, moduleQuery, allItemsQuery]);

  // Écouter les événements de mise à jour du menu
  useEffect(() => {
    const onMenuUpdated = () => {
      console.log("useMenu: Événement MENU_UPDATED reçu");
      refreshMenu();
    };
    
    // Subscribe returns an unsubscribe function, store it to call it on cleanup
    const unsubscribe = eventBus.subscribe(MODULE_MENU_EVENTS.MENU_UPDATED, onMenuUpdated);
    
    return () => {
      // Call the unsubscribe function directly, not as a method on eventBus
      unsubscribe();
    };
  }, [refreshMenu]);

  // Effet pour définir les éléments de menu en fonction des résultats de la requête
  useEffect(() => {
    try {
      setLoading(true);
      let items: MenuItem[] = [];

      // Obtenir les éléments en fonction des options
      if (category) {
        items = categoryQuery.data || [];
      } else if (moduleCode) {
        items = moduleQuery.data || [];
      } else {
        items = allItemsQuery.data || [];
      }

      // Filtrer en fonction des autorisations de l'utilisateur
      const filteredItems = items.filter(item => {
        if (item.requires_admin && !isUserAdmin) {
          return false;
        }
        return true;
      });

      // Gérer la structure hiérarchique si nécessaire
      if (hierarchical) {
        // Structure arborescente (amélioration future)
        setMenuItems(filteredItems);
      } else {
        setMenuItems(filteredItems);
      }

      setError(null);
    } catch (err) {
      console.error("Erreur lors du traitement des éléments de menu:", err);
      setError("Échec du chargement des éléments de menu");
    } finally {
      setLoading(false);
    }
  }, [
    category, 
    moduleCode, 
    hierarchical, 
    isUserAdmin,
    categoryQuery.data,
    moduleQuery.data,
    allItemsQuery.data
  ]);

  return {
    menuItems,
    loading: loading || categoryQuery.isLoading || moduleQuery.isLoading || allItemsQuery.isLoading,
    error,
    isUserAdmin,
    categories: menuCategories,
    refreshMenu
  };
};

// Exporter les sous-hooks pour un accès direct si nécessaire
export { 
  useAllMenuItems,
  useMenuItemsByCategory,
  useMenuItemsByModule,
  useMenuCategories, 
  useAdminStatus 
};
