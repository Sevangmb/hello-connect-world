
import { useQuery } from '@tanstack/react-query';
import { getMenuService } from '@/services/menu/infrastructure/menuServiceProvider';
import { useToast } from '@/hooks/use-toast';

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
