
// Update the menu items implementation to fix the arguments error
import { useQuery } from '@tanstack/react-query';
import { getMenuService } from '@/services/menu/infrastructure/menuServiceProvider';
import { MenuItem, MenuItemCategory } from '@/services/menu/types';

// Function to get all menu items
export const useAllMenuItems = () => {
  return useQuery({
    queryKey: ['menuItems', 'all'],
    queryFn: async () => {
      try {
        const menuService = getMenuService();
        return await menuService.getAllMenuItems();
      } catch (error) {
        console.error('Erreur lors de la récupération de tous les éléments de menu:', error);
        return [];
      }
    },
    staleTime: 60000, // 1 minute
    retry: 2
  });
};

// Function to get menu items by category
export const useMenuItemsByCategory = (category: MenuItemCategory) => {
  return useQuery({
    queryKey: ['menuItems', 'category', category],
    queryFn: async () => {
      try {
        const menuService = getMenuService();
        return await menuService.getMenuItemsByCategory(category);
      } catch (error) {
        console.error(`Erreur lors de la récupération des éléments de menu pour la catégorie ${category}:`, error);
        return [];
      }
    },
    enabled: !!category,
    staleTime: 60000, // 1 minute
    retry: 2
  });
};

// Function to get menu items by module
export const useMenuItemsByModule = (moduleCode: string) => {
  return useQuery({
    queryKey: ['menuItems', 'module', moduleCode],
    queryFn: async () => {
      try {
        const menuService = getMenuService();
        // Nous ne passons plus explicitement isAdmin ici, il sera géré en interne
        return await menuService.getMenuItemsByModule(moduleCode);
      } catch (error) {
        console.error(`Erreur lors de la récupération des éléments de menu pour le module ${moduleCode}:`, error);
        return [];
      }
    },
    enabled: !!moduleCode,
    staleTime: 60000, // 1 minute
    retry: 2
  });
};

// Function to get menu items by parent
export const useMenuItemsByParent = (parentId: string | null) => {
  return useQuery({
    queryKey: ['menuItems', 'parent', parentId],
    queryFn: async () => {
      try {
        // Import the repository here to avoid circular dependencies
        const menuService = getMenuService();
        return await menuService.getMenuItemsByParent(parentId);
      } catch (error) {
        console.error(`Erreur lors de la récupération des éléments de menu pour le parent ${parentId}:`, error);
        return [];
      }
    },
    enabled: parentId !== undefined,
    staleTime: 60000, // 1 minute
    retry: 2
  });
};
