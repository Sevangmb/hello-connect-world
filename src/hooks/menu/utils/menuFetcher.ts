
import { getMenuService } from '@/services/menu/infrastructure/menuServiceProvider';
import { MenuItem, MenuItemCategory } from '@/services/menu/types';
import { MenuRepository } from '@/services/menu/infrastructure/SupabaseMenuRepository';

/**
 * Fetch all menu items
 */
export async function fetchMenuItems() {
  try {
    const menuService = getMenuService();
    return await menuService.getAllMenuItems();
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
}

/**
 * Fetch menu items by parent
 */
export async function fetchMenuItemsByParent(parentId: string | null) {
  try {
    const menuRepository = new MenuRepository();
    return await menuRepository.getMenuItemsByParent(parentId);
  } catch (error) {
    console.error('Error fetching menu items by parent:', error);
    return [];
  }
}

/**
 * Fetch menu items by category
 */
export async function fetchMenuItemsByCategory(category: MenuItemCategory) {
  try {
    const menuService = getMenuService();
    return await menuService.getMenuItemsByCategory(category);
  } catch (error) {
    console.error(`Error fetching menu items for category ${category}:`, error);
    return [];
  }
}
