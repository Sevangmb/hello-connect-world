
import { MenuItem, MenuItemCategory } from '../../../types';
import { MenuCacheService } from '../../services/MenuCacheService';
import { MenuQueryBuilder } from '../../utils/MenuQueryBuilder';

/**
 * Repository spécialisé pour récupérer les éléments de menu par catégorie
 */
export class CategoryMenuItemsRepository {
  constructor(private cacheService: MenuCacheService) {}
  
  /**
   * Récupère les éléments de menu par catégorie
   */
  async getMenuItemsByCategory(category: MenuItemCategory): Promise<MenuItem[]> {
    try {
      // Vérifier le cache d'abord
      const cacheKey = this.cacheService.categoryKey(category);
      const cachedItems = this.cacheService.get(cacheKey);
      
      if (cachedItems) {
        console.log(`CategoryMenuItemsRepository: Retrieved items for category ${category} from cache`);
        return cachedItems;
      }
      
      // Si non trouvé dans le cache, faire une requête à Supabase
      const { data, error } = await MenuQueryBuilder.getItemsByCategory(category);
      
      if (error) {
        console.error(`Error fetching menu items for category ${category}:`, error);
        return [];
      }
      
      // Stocker dans le cache avant de retourner
      this.cacheService.set(cacheKey, data || []);
      
      console.log(`CategoryMenuItemsRepository: Retrieved ${data?.length || 0} items for category ${category} from database`);
      return data || [];
    } catch (error) {
      console.error(`Erreur dans CategoryMenuItemsRepository.getMenuItemsByCategory pour la catégorie ${category}:`, error);
      return [];
    }
  }
}
