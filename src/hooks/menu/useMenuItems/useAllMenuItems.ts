
import { useQuery } from '@tanstack/react-query';
import { getMenuService } from '@/services/menu/infrastructure/menuServiceProvider';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to fetch all menu items
 */
export const useAllMenuItems = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['menuItems', 'all'],
    queryFn: async () => {
      try {
        const menuService = getMenuService();
        const items = await menuService.getAllMenuItems();
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
