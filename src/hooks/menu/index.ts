
import { useAdminStatus } from './useAdminStatus';
import { useMenuItems } from './useMenuItems';
import { useMenuCategories } from './useMenuCategories';
import { MenuItemCategory } from '@/services/menu/types';

interface UseMenuOptions {
  category?: MenuItemCategory;
  moduleCode?: string;
  hierarchical?: boolean;
}

/**
 * Hook principal pour la gestion des menus
 * Combine les hooks spécifiques
 */
export const useMenu = (options?: UseMenuOptions) => {
  const { isUserAdmin, loading: adminLoading } = useAdminStatus();
  const { 
    menuItems, 
    loading: menuLoading, 
    error, 
    refreshMenu 
  } = useMenuItems(options);
  const { 
    getMenusByCategory,
    mainMenu,
    adminMenu,
    socialMenu,
    marketplaceMenu,
    utilityMenu,
    systemMenu
  } = useMenuCategories(menuItems);
  
  const loading = adminLoading || menuLoading;
  
  return {
    menuItems,
    loading,
    error,
    isUserAdmin,
    getMenusByCategory,
    refreshMenu,
    mainMenu,
    adminMenu,
    socialMenu,
    marketplaceMenu,
    utilityMenu,
    systemMenu
  };
};

// Hooks spécialisés pour des catégories spécifiques
export const useMainMenu = () => useMenu({ category: 'main' });
export const useAdminMenu = () => useMenu({ category: 'admin' });
export const useSocialMenu = () => useMenu({ category: 'social' });
export const useMarketplaceMenu = () => useMenu({ category: 'marketplace' });
export const useUtilityMenu = () => useMenu({ category: 'utility' });
export const useSystemMenu = () => useMenu({ category: 'system' });

// Réexporter les hooks individuels pour un accès direct si nécessaire
export { useAdminStatus } from './useAdminStatus';
export { useMenuItems } from './useMenuItems';
export { useMenuCategories } from './useMenuCategories';
