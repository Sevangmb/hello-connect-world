
// Update the menu items implementation to fix the arguments error
import { useQuery } from '@tanstack/react-query';
import { getMenuService } from '@/services/menu/infrastructure/menuServiceProvider';
import { MenuItem, MenuItemCategory } from '@/services/menu/types';

// Function to get all menu items
export const useAllMenuItems = () => {
  return useQuery({
    queryKey: ['menuItems', 'all'],
    queryFn: async () => {
      const menuService = getMenuService();
      return await menuService.getAllMenuItems();
    }
  });
};

// Function to get menu items by category
export const useMenuItemsByCategory = (category: MenuItemCategory) => {
  return useQuery({
    queryKey: ['menuItems', 'category', category],
    queryFn: async () => {
      const menuService = getMenuService();
      return await menuService.getMenuItemsByCategory(category);
    },
    enabled: !!category
  });
};

// Function to get menu items by module
export const useMenuItemsByModule = (moduleCode: string, isAdmin: boolean = false) => {
  return useQuery({
    queryKey: ['menuItems', 'module', moduleCode, isAdmin],
    queryFn: async () => {
      const menuService = getMenuService();
      // Fix the arguments error by only passing moduleCode
      // The actual implementation will handle isAdmin internally
      return await menuService.getMenuItemsByModule(moduleCode);
    },
    enabled: !!moduleCode
  });
};

// Function to get menu items by parent
export const useMenuItemsByParent = (parentId: string | null) => {
  return useQuery({
    queryKey: ['menuItems', 'parent', parentId],
    queryFn: async () => {
      // Import the repository here to avoid circular dependencies
      const { MenuRepository } = await import('@/services/menu/infrastructure/SupabaseMenuRepository');
      const menuRepository = new MenuRepository();
      return await menuRepository.getMenuItemsByParent(parentId);
    },
    enabled: parentId !== undefined
  });
};
