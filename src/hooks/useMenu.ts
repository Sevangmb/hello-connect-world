/**
 * Hook pour la gestion des menus dynamiques
 * Version refactorisée pour utiliser le coordinateur modules-menu
 */
import { useState, useEffect, useMemo } from 'react';
import { MenuService } from '@/services/menu/MenuService';
import { MenuItem, MenuItemCategory } from '@/services/menu/types';
import { useToast } from '@/hooks/use-toast';
import { useModules } from '@/hooks/modules/useModules';
import { getUserService } from '@/core/users/infrastructure/userDependencyProvider';
import { getAuthService } from '@/core/auth/infrastructure/authDependencyProvider';
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_MENU_EVENTS, moduleMenuCoordinator } from '@/services/coordination/ModuleMenuCoordinator';

export const useMenu = (options?: {
  category?: MenuItemCategory;
  moduleCode?: string;
  hierarchical?: boolean;
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const { toast } = useToast();
  const { isModuleActive, modules } = useModules();
  const userService = getUserService();
  const authService = getAuthService();
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (!user) return;
        
        const isAdmin = await userService.isUserAdmin(user.id);
        setIsUserAdmin(isAdmin);
        
        if (isAdmin) {
          moduleMenuCoordinator.enableAdminAccess();
        } else {
          moduleMenuCoordinator.disableAdminAccess();
        }
      } catch (err) {
        console.error("Erreur lors de la vérification du statut admin:", err);
        setIsUserAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, []);
  
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
    
    return () => {
      unsubscribeMenuUpdated();
      unsubscribeModuleStatus();
      unsubscribeAdminAccess();
    };
  }, [options?.category, options?.moduleCode]);
  
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
  
  const menuTree = useMemo(() => {
    if (options?.hierarchical) {
      return MenuService.buildMenuTree(menuItems);
    }
    return menuItems;
  }, [menuItems, options?.hierarchical]);
  
  const getMenusByCategory = (category: MenuItemCategory): MenuItem[] => {
    return menuItems.filter(item => item.category === category);
  };
  
  return {
    menuItems: options?.hierarchical ? menuTree : menuItems,
    loading,
    error,
    isUserAdmin,
    getMenusByCategory,
    refreshMenu: fetchMenuItems,
    mainMenu: useMemo(() => getMenusByCategory('main'), [menuItems]),
    adminMenu: useMemo(() => getMenusByCategory('admin'), [menuItems]),
    socialMenu: useMemo(() => getMenusByCategory('social'), [menuItems]),
    marketplaceMenu: useMemo(() => getMenusByCategory('marketplace'), [menuItems]),
    utilityMenu: useMemo(() => getMenusByCategory('utility'), [menuItems]),
  };
};

export const useMainMenu = () => {
  return useMenu({ category: 'main' });
};

export const useAdminMenu = () => {
  return useMenu({ category: 'admin' });
};

export const useSocialMenu = () => {
  return useMenu({ category: 'social' });
};

export const useMarketplaceMenu = () => {
  return useMenu({ category: 'marketplace' });
};
