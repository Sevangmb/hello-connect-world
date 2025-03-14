
import { useQuery } from '@tanstack/react-query';
import { getMenuService } from '@/services/menu/infrastructure/menuServiceProvider';
import { MenuItemCategory } from '@/services/menu/types';
import { useToast } from '@/hooks/use-toast';
import { getDefaultMenuItems } from '../utils/defaultMenuItems';

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
        
        // Si aucun élément n'est retourné pour la catégorie, utiliser des éléments par défaut
        if (!items || items.length === 0) {
          console.warn(`No menu items for category ${category}, using defaults`);
          const defaultItems = getDefaultMenuItems();
          return defaultItems.filter(item => item.category === category);
        }
        
        return items;
      } catch (error) {
        console.error(`Erreur lors de la récupération des éléments de menu pour la catégorie ${category}:`, error);
        toast({
          title: "Erreur de chargement",
          description: `Impossible de charger les éléments de la catégorie ${category}`,
          variant: "destructive"
        });
        // En cas d'erreur, filtrer les éléments par défaut pour cette catégorie
        const defaultItems = getDefaultMenuItems();
        return defaultItems.filter(item => item.category === category);
      }
    },
    enabled: !!category,
    staleTime: 60000, // 1 minute
    retry: 3,
    retryDelay: attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)
  });
};
