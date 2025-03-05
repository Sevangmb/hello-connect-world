import { MenuItem } from '@/services/menu/types';
import { Module } from '@/hooks/modules/types';
import { moduleMenuCoordinator } from '@/services/coordination/ModuleMenuCoordinator';

/**
 * Utility functions for filtering menu items
 */
export const menuFilters = {
  /**
   * Filter menu items based on module visibility
   */
  byModuleVisibility: (items: MenuItem[], modules: Module[], isAdmin: boolean): MenuItem[] => {
    return items.filter(item => {
      if (!item.module_code) return true;
      
      // If it's an admin module and user is admin, always visible
      if ((item.module_code === 'admin' || item.module_code.startsWith('admin_')) && isAdmin) {
        return true;
      }
      
      // Otherwise check with the coordinator
      return moduleMenuCoordinator.isModuleVisibleInMenu(item.module_code, modules);
    });
  },
};
