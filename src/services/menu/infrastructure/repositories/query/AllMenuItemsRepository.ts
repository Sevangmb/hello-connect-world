
import { MenuQueryBuilder } from '../../utils/MenuQueryBuilder';
import { MenuCacheService } from '../../services/MenuCacheService';
import { MenuCacheKeys } from '../../constants/CacheKeys';
import { MenuItem } from '../../../types';

/**
 * Repository pour la récupération de tous les éléments de menu
 */
export class AllMenuItemsRepository {
  constructor(private cacheService: MenuCacheService) {}

  /**
   * Récupère tous les éléments de menu
   */
  async getAllMenuItems(): Promise<MenuItem[]> {
    try {
      const cachedItems = this.cacheService.getCachedItems(MenuCacheKeys.ALL_ITEMS_KEY);
      
      if (cachedItems) {
        console.log('Repository: Utilisation des éléments de menu en cache');
        return cachedItems;
      }
      
      console.log('Repository: Récupération de tous les éléments de menu');
      const { data, error } = await MenuQueryBuilder.getAllItems();
      
      if (error) {
        console.error('Repository error:', error);
        throw error;
      }
      
      const items = data as MenuItem[] || [];
      this.cacheService.updateCache(MenuCacheKeys.ALL_ITEMS_KEY, items);
      
      console.log(`Repository: Récupéré ${items.length} éléments de menu`);
      return items;
    } catch (error) {
      console.error('Erreur lors de la récupération des éléments de menu:', error);
      throw error;
    }
  }
}
