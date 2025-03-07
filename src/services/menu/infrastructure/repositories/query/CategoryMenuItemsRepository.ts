
import { MenuItemCategory, MenuItem } from '../../../types';
import { MenuCacheService } from '../../services/MenuCacheService';
import { MenuCacheKeys } from '../../constants/CacheKeys';
import { MenuQueryBuilder } from '../../utils/MenuQueryBuilder';

/**
 * Repository pour les éléments de menu par catégorie
 */
export class CategoryMenuItemsRepository {
  constructor(private cacheService: MenuCacheService) {}

  /**
   * Récupère les éléments de menu par catégorie
   */
  async getMenuItemsByCategory(category: MenuItemCategory): Promise<MenuItem[]> {
    try {
      const cacheKey = MenuCacheKeys.getCategoryKey(category);
      
      const cachedItems = this.cacheService.getCachedItems(cacheKey);
      if (cachedItems) {
        console.log(`Repository: Utilisation des éléments en cache pour la catégorie: ${category}`);
        return cachedItems;
      }
      
      console.log(`Repository: Récupération des éléments pour la catégorie: ${category}`);
      
      const allItemsCached = this.cacheService.getCachedItems(MenuCacheKeys.ALL_ITEMS_KEY);
      if (allItemsCached) {
        const filteredItems = allItemsCached.filter(item => item.category === category);
        
        this.cacheService.updateCache(cacheKey, filteredItems);
        console.log(`Repository: Filtré ${filteredItems.length} éléments pour la catégorie ${category} depuis le cache`);
        return filteredItems;
      }
      
      const { data, error } = await MenuQueryBuilder.getItemsByCategory(category);
      
      if (error) {
        console.error(`Repository error for category ${category}:`, error);
        throw error;
      }
      
      const items = data as MenuItem[] || [];
      this.cacheService.updateCache(cacheKey, items);
      
      console.log(`Repository: Récupéré ${items.length} éléments pour la catégorie ${category}`);
      return items;
    } catch (error) {
      console.error(`Erreur lors de la récupération des éléments pour la catégorie ${category}:`, error);
      throw error;
    }
  }
}
