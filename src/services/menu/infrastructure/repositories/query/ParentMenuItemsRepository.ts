
import { MenuCacheService } from '../../services/MenuCacheService';
import { MenuCacheKeys } from '../../constants/CacheKeys';
import { MenuQueryBuilder } from '../../utils/MenuQueryBuilder';
import { MenuItem } from '../../../types';

/**
 * Repository pour les éléments de menu par parent
 */
export class ParentMenuItemsRepository {
  constructor(private cacheService: MenuCacheService) {}

  /**
   * Récupère les éléments de menu par parent
   */
  async getMenuItemsByParent(parentId: string | null): Promise<MenuItem[]> {
    try {
      const cacheKey = MenuCacheKeys.getParentKey(parentId);
      
      const cachedItems = this.cacheService.getCachedItems(cacheKey);
      if (cachedItems) {
        console.log(`Repository: Utilisation des éléments en cache pour le parent: ${parentId || 'root'}`);
        return cachedItems;
      }
      
      console.log(`Repository: Récupération des éléments avec parent_id: ${parentId || 'root'}`);
      
      const allItemsCached = this.cacheService.getCachedItems(MenuCacheKeys.ALL_ITEMS_KEY);
      if (allItemsCached) {
        const filteredItems = allItemsCached.filter(item => {
          if (parentId === null) {
            return item.parent_id === null || !item.parent_id;
          }
          return item.parent_id === parentId;
        });
        
        this.cacheService.updateCache(cacheKey, filteredItems);
        console.log(`Repository: Filtré ${filteredItems.length} éléments enfants pour le parent ${parentId || 'root'} depuis le cache`);
        return filteredItems;
      }
      
      const { data, error } = await MenuQueryBuilder.getItemsByParent(parentId);
        
      if (error) {
        console.error(`Repository error for parent ${parentId}:`, error);
        throw error;
      }
      
      const items = data || [];
      this.cacheService.updateCache(cacheKey, items);
      
      console.log(`Repository: Récupéré ${items.length} éléments enfants pour le parent ${parentId || 'root'}`);
      return items;
    } catch (error) {
      console.error(`Erreur lors de la récupération des éléments pour le parent ${parentId}:`, error);
      throw error;
    }
  }
}
