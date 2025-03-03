
/**
 * Hook pour la gestion des menus dynamiques
 * Intégration avec le microservice utilisateur pour la vérification d'admin
 */
import { useState, useEffect, useMemo } from 'react';
import { MenuService } from '@/services/menu/MenuService';
import { MenuItem, MenuItemCategory } from '@/services/menu/types';
import { useToast } from '@/hooks/use-toast';
import { useModules } from '@/hooks/modules/useModules';
import { getUserService } from '@/core/users/infrastructure/userDependencyProvider';
import { getAuthService } from '@/core/auth/infrastructure/authDependencyProvider';
import { ADMIN_MODULE_CODE } from '@/hooks/modules/constants';

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
  const { isModuleActive } = useModules();
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
      } catch (err) {
        console.error("Erreur lors de la vérification du statut admin:", err);
        setIsUserAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, []);
  
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        let items: MenuItem[] = [];
        
        if (options?.category === 'admin') {
          // Pour la catégorie admin, toujours récupérer les items de menu admin
          // sans vérifier si le module admin est actif
          items = await MenuService.getMenuItemsByCategory('admin', isUserAdmin);
        } else if (options?.category) {
          // Récupérer les éléments de menu par catégorie
          items = await MenuService.getMenuItemsByCategory(options.category, isUserAdmin);
        } else if (options?.moduleCode) {
          // Récupérer les éléments de menu par module
          items = await MenuService.getMenuItemsByModule(options.moduleCode, isUserAdmin);
        } else {
          // Récupérer tous les éléments de menu visibles
          items = await MenuService.getVisibleMenuItems(isUserAdmin);
          
          // Si l'utilisateur est admin, s'assurer que les menus admin sont inclus
          if (isUserAdmin && !options?.category) {
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
    
    fetchMenuItems();
  }, [options?.category, options?.moduleCode, isUserAdmin, toast]);
  
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
