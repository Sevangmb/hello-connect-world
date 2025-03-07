
import { MenuItem } from '../../../types';
import { MenuCacheService } from '../../services/MenuCacheService';
import { MenuQueryBuilder } from '../../utils/MenuQueryBuilder';

/**
 * Repository spécialisé pour récupérer tous les éléments de menu
 */
export class AllMenuItemsRepository {
  constructor(private cacheService: MenuCacheService) {}
  
  /**
   * Récupère tous les éléments de menu
   */
  async getAllMenuItems(): Promise<MenuItem[]> {
    try {
      // Essayer de récupérer depuis le cache d'abord
      const cacheKey = this.cacheService.allItemsKey();
      const cachedItems = this.cacheService.get(cacheKey);
      
      if (cachedItems) {
        console.log('AllMenuItemsRepository: Retrieved items from cache');
        return cachedItems;
      }
      
      // Si non trouvé dans le cache, faire une requête à Supabase
      const { data, error } = await MenuQueryBuilder.getAllItems();
      
      if (error) {
        console.error('Error fetching all menu items:', error);
        return [];
      }
      
      // Stocker dans le cache avant de retourner
      this.cacheService.set(cacheKey, data || []);
      
      console.log(`AllMenuItemsRepository: Retrieved ${data?.length || 0} items from database`);
      return data || [];
    } catch (error) {
      console.error('Erreur dans AllMenuItemsRepository.getAllMenuItems:', error);
      return [];
    }
  }
}
