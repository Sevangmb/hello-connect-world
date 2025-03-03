
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
  
  // Vérifier si l'utilisateur est administrateur
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (!user) return;
        
        const isAdmin = await userService.isUserAdmin(user.id);
        setIsUserAdmin(isAdmin);
        
        // Synchroniser avec le coordinateur
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
  
  // Écouter les événements de mise à jour du menu
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
      
      // Forcer l'accès admin pour la catégorie admin
      const adminEnabled = moduleMenuCoordinator.isAdminAccessEnabled();
      
      if (options?.category === 'admin') {
        // Pour la catégorie admin, vérifier si l'accès admin est activé
        if (adminEnabled) {
          items = await MenuService.getMenuItemsByCategory('admin', true);
        }
      } else if (options?.category) {
        // Récupérer les éléments de menu par catégorie
        items = await MenuService.getMenuItemsByCategory(options.category, isUserAdmin);
        
        // Filtrer les éléments en fonction du statut de leur module
        items = items.filter(item => 
          !item.moduleCode || moduleMenuCoordinator.isModuleVisibleInMenu(item.moduleCode, modules)
        );
      } else if (options?.moduleCode) {
        // Si le module n'est pas actif et n'est pas admin, retourner une liste vide
        if (!moduleMenuCoordinator.isModuleVisibleInMenu(options.moduleCode, modules)) {
          setMenuItems([]);
          setLoading(false);
          return;
        }
        
        // Récupérer les éléments de menu par module
        items = await MenuService.getMenuItemsByModule(options.moduleCode, isUserAdmin);
      } else {
        // Récupérer tous les éléments de menu visibles
        items = await MenuService.getVisibleMenuItems(isUserAdmin);
        
        // Filtrer les éléments en fonction du statut de leur module
        items = items.filter(item => 
          !item.moduleCode || moduleMenuCoordinator.isModuleVisibleInMenu(item.moduleCode, modules)
        );
        
        // Si l'utilisateur est admin, inclure les menus d'administration
        if (adminEnabled && !options?.category) {
          const adminItems = await MenuService.getMenuItemsByCategory('admin', true);
          // Ajouter uniquement les éléments admin qui ne sont pas déjà présents
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
  
  // Charger les éléments de menu au montage
  useEffect(() => {
    fetchMenuItems();
  }, [options?.category, options?.moduleCode, isUserAdmin]);
  
  // Construit une structure de menu hiérarchique si demandé
  const menuTree = useMemo(() => {
    if (options?.hierarchical) {
      return MenuService.buildMenuTree(menuItems);
    }
    return menuItems;
  }, [menuItems, options?.hierarchical]);
  
  // Filtrer les menus par catégorie
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

// Hook spécifique pour le menu principal
export const useMainMenu = () => {
  return useMenu({ category: 'main' });
};

// Hook spécifique pour le menu d'administration
export const useAdminMenu = () => {
  return useMenu({ category: 'admin' });
};

// Hook spécifique pour les menus sociaux
export const useSocialMenu = () => {
  return useMenu({ category: 'social' });
};

// Hook spécifique pour les menus de la marketplace
export const useMarketplaceMenu = () => {
  return useMenu({ category: 'marketplace' });
};
