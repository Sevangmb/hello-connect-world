
import { useQuery } from '@tanstack/react-query';
import { getMenuService } from '@/services/menu/infrastructure/menuServiceProvider';
import { MenuItem } from '@/services/menu/types';
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
        
        // Si aucun élément n'est retourné, essayons d'afficher des éléments par défaut
        if (!items || items.length === 0) {
          console.warn('No menu items returned from database, using default items');
          return getDefaultMenuItems();
        }
        
        return items;
      } catch (error) {
        console.error('Erreur lors de la récupération de tous les éléments de menu:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les éléments de menu",
          variant: "destructive"
        });
        // En cas d'erreur, retourner des éléments par défaut
        return getDefaultMenuItems();
      }
    },
    staleTime: 60000, // 1 minute
    retry: 3,
    retryDelay: attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)
  });
};

// Import the default menu items utility
import { getDefaultMenuItems } from '../utils/defaultMenuItems';
