
import { MenuItem } from '../../../types';
import { MenuCacheService } from '../../services/MenuCacheService';
import { MenuQueryBuilder } from '../../utils/MenuQueryBuilder';

/**
 * Repository spécialisé pour récupérer les éléments de menu par module
 */
export class ModuleMenuItemsRepository {
  constructor(private cacheService: MenuCacheService) {}
  
  /**
   * Récupère les éléments de menu par module
   */
  async getMenuItemsByModule(moduleCode: string, isAdmin: boolean = false): Promise<MenuItem[]> {
    try {
      // Vérifier le cache d'abord
      const cacheKey = this.cacheService.moduleKey(moduleCode, isAdmin);
      const cachedItems = this.cacheService.get(cacheKey);
      
      if (cachedItems) {
        console.log(`ModuleMenuItemsRepository: Retrieved items for module ${moduleCode} from cache`);
        return cachedItems;
      }
      
      // Si non trouvé dans le cache, faire une requête à Supabase
      const { data, error } = await MenuQueryBuilder.getItemsByModule(moduleCode, isAdmin);
      
      if (error) {
        console.error(`Error fetching menu items for module ${moduleCode}:`, error);
        return [];
      }
      
      // Stocker dans le cache avant de retourner
      this.cacheService.set(cacheKey, data || []);
      
      console.log(`ModuleMenuItemsRepository: Retrieved ${data?.length || 0} items for module ${moduleCode} from database`);
      return data || [];
    } catch (error) {
      console.error(`Erreur dans ModuleMenuItemsRepository.getMenuItemsByModule pour le module ${moduleCode}:`, error);
      return [];
    }
  }
}
