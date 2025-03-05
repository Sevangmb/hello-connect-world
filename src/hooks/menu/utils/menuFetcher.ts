
import { MenuItem, MenuItemCategory } from '@/services/menu/types';
import { MenuService } from '@/services/menu/infrastructure/menuServiceProvider';
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
  
  // Fetch menu items based on options
  if (category === 'admin') {
    if (adminEnabled) {
      items = await MenuService.getMenuItemsByCategory('admin', hierarchical);
    }
  } else if (category) {
    items = await MenuService.getMenuItemsByCategory(category, hierarchical, isAdmin);
    items = menuFilters.byModuleVisibility(items, modules, isAdmin);
  } else if (moduleCode) {
    if (!moduleMenuCoordinator.isModuleVisibleInMenu(moduleCode, modules)) {
      return [];
    }
    
    items = await MenuService.getMenuItemsByModule(moduleCode, hierarchical, isAdmin);
  } else {
    items = await MenuService.getVisibleMenuItems(hierarchical, isAdmin);
    items = menuFilters.byModuleVisibility(items, modules, isAdmin);
    
    if (adminEnabled && !category) {
      const adminItems = await MenuService.getMenuItemsByCategory('admin', hierarchical, true);
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
