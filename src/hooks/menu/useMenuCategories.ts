
import { useMemo } from 'react';
import { MenuItem, MenuItemCategory } from '@/services/menu/types';

/**
 * Hook pour filtrer les éléments de menu par catégorie
 * @param menuItems Liste des éléments de menu
 */
export const useMenuCategories = (menuItems: MenuItem[]) => {
  
  const getMenusByCategory = (category: MenuItemCategory): MenuItem[] => {
    return menuItems.filter(item => item.category === category);
  };
  
  const mainMenu = useMemo(() => getMenusByCategory('main'), [menuItems]);
  const adminMenu = useMemo(() => getMenusByCategory('admin'), [menuItems]);
  const socialMenu = useMemo(() => getMenusByCategory('social'), [menuItems]);
  const marketplaceMenu = useMemo(() => getMenusByCategory('marketplace'), [menuItems]);
  const utilityMenu = useMemo(() => getMenusByCategory('utility'), [menuItems]);
  const systemMenu = useMemo(() => getMenusByCategory('system'), [menuItems]);
  
  return {
    getMenusByCategory,
    mainMenu,
    adminMenu,
    socialMenu,
    marketplaceMenu,
    utilityMenu,
    systemMenu
  };
};
