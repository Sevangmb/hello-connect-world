
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';
import { MenuCacheService } from '../../services/MenuCacheService';
import { MenuCacheKeys } from '../../constants/CacheKeys';
import { MenuQueryBuilder } from '../../utils/MenuQueryBuilder';
import { MenuItem } from '../../../types';

/**
 * Repository pour les éléments de menu par module
 */
export class ModuleMenuItemsRepository {
  constructor(private cacheService: MenuCacheService) {}

  /**
   * Récupère les éléments de menu par module
   */
  async getMenuItemsByModule(moduleCode: string, isAdmin: boolean = false): Promise<MenuItem[]> {
    try {
      const cacheKey = MenuCacheKeys.getModuleKey(moduleCode, isAdmin);
      
      const cachedItems = this.cacheService.getCachedItems(cacheKey);
      if (cachedItems) {
        console.log(`Repository: Utilisation des éléments en cache pour le module: ${moduleCode}`);
        return cachedItems;
      }
      
      console.log(`Repository: Récupération des éléments pour le module ${moduleCode}, isAdmin: ${isAdmin}`);
      const isModuleActive = await moduleApiGateway.isModuleActive(moduleCode);
      
      if (!isModuleActive && !isAdmin && moduleCode !== 'admin' && !moduleCode.startsWith('admin_')) {
        console.log(`Module ${moduleCode} inactif, aucun élément de menu affiché`);
        this.cacheService.updateCache(cacheKey, []);
        return [];
      }
      
      const allItemsCached = this.cacheService.getCachedItems(MenuCacheKeys.ALL_ITEMS_KEY);
      if (allItemsCached) {
        let filteredItems = allItemsCached.filter(item => item.module_code === moduleCode);
        
        if (!isAdmin) {
          filteredItems = filteredItems.filter(item => 
            !item.requires_admin && item.is_visible !== false
          );
        }
        
        this.cacheService.updateCache(cacheKey, filteredItems);
        console.log(`Repository: Filtré ${filteredItems.length} éléments pour le module ${moduleCode} depuis le cache`);
        return filteredItems;
      }
      
      const { data, error } = await MenuQueryBuilder.getItemsByModule(moduleCode, isAdmin);
      
      if (error) {
        console.error(`Repository error for module ${moduleCode}:`, error);
        throw error;
      }
      
      const items = data || [];
      this.cacheService.updateCache(cacheKey, items);
      
      console.log(`Repository: Récupéré ${items.length} éléments pour le module ${moduleCode}`);
      return items;
    } catch (err) {
      console.error(`Exception lors du chargement des éléments pour le module ${moduleCode}:`, err);
      throw err;
    }
  }
}
