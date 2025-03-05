
import { MenuType } from '@/services/menu/types';
import { getMenuService } from '@/services/menu/infrastructure/menuServiceProvider';
import { MenuRepository } from '@/services/menu/infrastructure/SupabaseMenuRepository';

/**
 * Fonction pour récupérer les éléments de menu
 */
export const fetchMenuItems = async (menuType: MenuType) => {
  try {
    const menuService = getMenuService();
    return await menuService.getMenuItems(menuType);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

/**
 * Fonction pour récupérer les éléments de menu par parent
 */
export const fetchMenuItemsByParent = async (parentId: string | null) => {
  try {
    const menuService = getMenuService();
    return await menuService.getMenuItemsByParent(parentId);
  } catch (error) {
    console.error('Error fetching menu items by parent:', error);
    return [];
  }
};
