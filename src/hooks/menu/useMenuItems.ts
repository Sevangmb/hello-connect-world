
import { useQuery } from '@tanstack/react-query';
import { getMenuService } from '@/services/menu/infrastructure/menuServiceProvider';
import { MenuItem, MenuItemCategory } from '@/services/menu/types';
import { useToast } from '@/hooks/use-toast';

// Function to get all menu items
export const useAllMenuItems = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['menuItems', 'all'],
    queryFn: async () => {
      try {
        console.log('Fetching all menu items');
        const menuService = getMenuService();
        const items = await menuService.getAllMenuItems();
        console.log(`Retrieved ${items.length} menu items`);
        return items;
      } catch (error) {
        console.error('Erreur lors de la récupération de tous les éléments de menu:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les éléments de menu",
          variant: "destructive"
        });
        return [];
      }
    },
    staleTime: 60000, // 1 minute
    retry: 3,
    retryDelay: attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)
  });
};

// Function to get menu items by category
export const useMenuItemsByCategory = (category: MenuItemCategory) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['menuItems', 'category', category],
    queryFn: async () => {
      try {
        console.log(`Fetching menu items for category: ${category}`);
        const menuService = getMenuService();
        const items = await menuService.getMenuItemsByCategory(category);
        console.log(`Retrieved ${items.length} items for category ${category}`);
        return items;
      } catch (error) {
        console.error(`Erreur lors de la récupération des éléments de menu pour la catégorie ${category}:`, error);
        toast({
          title: "Erreur de chargement",
          description: `Impossible de charger les éléments de la catégorie ${category}`,
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: !!category,
    staleTime: 60000, // 1 minute
    retry: 3,
    retryDelay: attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)
  });
};

// Function to get menu items by module
export const useMenuItemsByModule = (moduleCode: string, isAdmin: boolean = false) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['menuItems', 'module', moduleCode, isAdmin],
    queryFn: async () => {
      try {
        console.log(`Fetching menu items for module: ${moduleCode}, isAdmin: ${isAdmin}`);
        const menuService = getMenuService();
        const items = await menuService.getMenuItemsByModule(moduleCode, isAdmin);
        console.log(`Retrieved ${items.length} items for module ${moduleCode}`);
        return items;
      } catch (error) {
        console.error(`Erreur lors de la récupération des éléments de menu pour le module ${moduleCode}:`, error);
        toast({
          title: "Erreur de chargement",
          description: `Impossible de charger les éléments du module ${moduleCode}`,
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: !!moduleCode,
    staleTime: 60000, // 1 minute
    retry: 3,
    retryDelay: attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)
  });
};

// Function to get menu items by parent
export const useMenuItemsByParent = (parentId: string | null) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['menuItems', 'parent', parentId],
    queryFn: async () => {
      try {
        console.log(`Fetching menu items with parent_id: ${parentId}`);
        const menuService = getMenuService();
        const items = await menuService.getMenuItemsByParent(parentId);
        console.log(`Retrieved ${items.length} child items for parent ${parentId}`);
        return items;
      } catch (error) {
        console.error(`Erreur lors de la récupération des éléments de menu pour le parent ${parentId}:`, error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les sous-éléments de menu",
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: parentId !== undefined,
    staleTime: 60000, // 1 minute
    retry: 3,
    retryDelay: attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)
  });
};
