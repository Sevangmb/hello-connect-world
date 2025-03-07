
import { useQuery } from '@tanstack/react-query';
import { getMenuService } from '@/services/menu/infrastructure/menuServiceProvider';
import { useToast } from '@/hooks/use-toast';

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
