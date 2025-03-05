
import { MenuItem, MenuItemCategory } from '@/services/menu/types';
import { getMenuUseCase } from '@/services/menu/infrastructure/menuServiceProvider';
import { moduleMenuCoordinator } from '@/services/coordination/ModuleMenuCoordinator';
import { Module } from '@/hooks/modules/types';
import { menuFilters } from './menuFilters';

interface FetchMenuOptions {
  category?: MenuItemCategory;
  moduleCode?: string;
  hierarchical?: boolean;
  isAdmin: boolean;
  modules: Module[];
}

/**
 * Fetch menu items based on provided options
 */
export const fetchMenuItems = async ({
  category,
  moduleCode,
  hierarchical = false,
  isAdmin,
  modules,
}: FetchMenuOptions): Promise<MenuItem[]> => {
  const adminEnabled = moduleMenuCoordinator.isAdminAccessEnabled();
  let items: MenuItem[] = [];
  const menuUseCase = getMenuUseCase();
  
  // Fetch menu items based on options
  if (category === 'admin') {
    if (adminEnabled) {
      items = await menuUseCase.getMenuItemsByCategory('admin');
    }
  } else if (category) {
    items = await menuUseCase.getMenuItemsByCategory(category);
    items = menuFilters.byModuleVisibility(items, modules, isAdmin);
  } else if (moduleCode) {
    if (!moduleMenuCoordinator.isModuleVisibleInMenu(moduleCode, modules)) {
      return [];
    }
    
    items = await menuUseCase.getMenuItemsByModule(moduleCode);
  } else {
    items = await menuUseCase.getAllMenuItems();
    items = menuFilters.byModuleVisibility(items, modules, isAdmin);
    
    if (adminEnabled && !category) {
      const adminItems = await menuUseCase.getMenuItemsByCategory('admin');
      const existingIds = new Set(items.map(item => item.id));
      for (const adminItem of adminItems) {
        if (!existingIds.has(adminItem.id)) {
          items.push(adminItem);
        }
      }
    }
  }
  
  return items;
};
