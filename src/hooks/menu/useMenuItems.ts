
import { useState, useEffect } from 'react';
import { MenuItem, MenuItemCategory } from '@/services/menu/types';
// Fix import path
import { MenuService } from '@/services/menu/infrastructure/menuServiceProvider';
import { useToast } from '@/hooks/use-toast';
import { useModules } from '@/hooks/modules/useModules';
import { moduleMenuCoordinator } from '@/services/coordination/ModuleMenuCoordinator';
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_MENU_EVENTS } from '@/services/coordination/ModuleMenuCoordinator';
import { useAdminStatus } from './useAdminStatus';

interface UseMenuItemsOptions {
  category?: MenuItemCategory;
  moduleCode?: string;
  hierarchical?: boolean;
}

/**
 * Hook pour récupérer et gérer les éléments de menu
 */
export const useMenuItems = (options?: UseMenuItemsOptions) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { modules } = useModules();
  const { isUserAdmin } = useAdminStatus();
  
  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      let items: MenuItem[] = [];
      
      const adminEnabled = moduleMenuCoordinator.isAdminAccessEnabled();
      
      if (options?.category === 'admin') {
        if (adminEnabled) {
          items = await MenuService.getMenuItemsByCategory('admin', true);
        }
      } else if (options?.category) {
        items = await MenuService.getMenuItemsByCategory(options.category, isUserAdmin);
        
        items = items.filter(item => 
          !item.module_code || moduleMenuCoordinator.isModuleVisibleInMenu(item.module_code, modules)
        );
      } else if (options?.moduleCode) {
        if (!moduleMenuCoordinator.isModuleVisibleInMenu(options.moduleCode, modules)) {
          setMenuItems([]);
          setLoading(false);
          return;
        }
        
        items = await MenuService.getMenuItemsByModule(options.moduleCode, isUserAdmin);
      } else {
        items = await MenuService.getVisibleMenuItems(isUserAdmin);
        
        items = items.filter(item => 
          !item.module_code || moduleMenuCoordinator.isModuleVisibleInMenu(item.module_code, modules)
        );
        
        if (adminEnabled && !options?.category) {
          const adminItems = await MenuService.getMenuItemsByCategory('admin', true);
          const existingIds = new Set(items.map(item => item.id));
          for (const adminItem of adminItems) {
            if (!existingIds.has(adminItem.id)) {
              items.push(adminItem);
            }
          }
        }
      }
      
      if (options?.hierarchical) {
        items = MenuService.buildMenuTree(items);
      }
      
      setMenuItems(items);
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la récupération des éléments de menu:", err);
      setError("Impossible de charger le menu");
      toast({
        title: "Erreur",
        description: "Impossible de charger le menu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMenuItems();
  }, [options?.category, options?.moduleCode, isUserAdmin]);
  
  useEffect(() => {
    const handleMenuUpdate = () => {
      fetchMenuItems();
    };
    
    const unsubscribeMenuUpdated = eventBus.subscribe(
      MODULE_MENU_EVENTS.MENU_UPDATED, 
      handleMenuUpdate
    );
    
    const unsubscribeModuleStatus = eventBus.subscribe(
      MODULE_MENU_EVENTS.MODULE_STATUS_CHANGED, 
      handleMenuUpdate
    );
    
    const unsubscribeAdminAccess = eventBus.subscribe(
      MODULE_MENU_EVENTS.ADMIN_ACCESS_GRANTED, 
      handleMenuUpdate
    );
    
    const unsubscribeAdminRevoked = eventBus.subscribe(
      MODULE_MENU_EVENTS.ADMIN_ACCESS_REVOKED, 
      handleMenuUpdate
    );
    
    return () => {
      unsubscribeMenuUpdated();
      unsubscribeModuleStatus();
      unsubscribeAdminAccess();
      unsubscribeAdminRevoked();
    };
  }, [options?.category, options?.moduleCode]);
  
  return {
    menuItems,
    loading,
    error,
    refreshMenu: fetchMenuItems
  };
};
