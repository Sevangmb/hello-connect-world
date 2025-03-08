
import { useCallback } from 'react';
import { useMenuState } from './useMenuState';
import { useMenuProcessor } from './useMenuProcessor';
import { useMenuFetcher } from './fetcher';
import { useMenuCategories } from './useMenuCategories';
import { useAdminStatus } from './useAdminStatus';
import { MenuItemCategory } from '@/services/menu/types';
import { 
  useAllMenuItems, 
  useMenuItemsByCategory, 
  useMenuItemsByModule, 
  useMenuItemsByParent 
} from './useMenuItems';

interface UseMenuOptions {
  category?: MenuItemCategory;
  moduleCode?: string;
  hierarchical?: boolean;
}

// Hook principal pour utiliser le menu
export const useMenu = (options: UseMenuOptions = {}) => {
  const { category, moduleCode, hierarchical = false } = options;
  
  // Obtenir le statut d'administrateur
  const { isUserAdmin } = useAdminStatus();
  
  // État du menu
  const {
    menuItems, 
    setMenuItems,
    loading, 
    setLoading,
    error, 
    setError,
    initialized, 
    setInitialized,
    refreshMenu: baseRefreshMenu,
    toast
  } = useMenuState();
  
  // Requêtes pour les éléments de menu
  const menuFetcher = useMenuFetcher({
    category,
    moduleCode,
    setLoading,
    setMenuItems,
    setError: (err: Error | null) => setError(err ? err.message : null),
    setInitialized,
    toast
  });
  
  // Traitement des éléments de menu
  useMenuProcessor({
    menuItems: menuItems,
    isUserAdmin,
    hierarchical,
    setMenuItems,
    setError: (err: Error | null) => setError(err ? err.message : null),
    toast
  });
  
  // Catégories de menu
  const menuCategories = useMenuCategories(menuItems);
  
  // Fonction pour rafraîchir les données du menu
  const refreshMenu = useCallback(() => {
    baseRefreshMenu();
    menuFetcher.refetch();
  }, [baseRefreshMenu, menuFetcher]);

  return {
    menuItems,
    loading: loading || menuFetcher.isLoading,
    error,
    isUserAdmin,
    categories: menuCategories,
    refreshMenu,
    initialized
  };
};

// Exporter les sous-hooks pour un accès direct si nécessaire
export { 
  useAllMenuItems,
  useMenuItemsByCategory,
  useMenuItemsByModule,
  useMenuItemsByParent,
  useMenuCategories, 
  useAdminStatus 
};
