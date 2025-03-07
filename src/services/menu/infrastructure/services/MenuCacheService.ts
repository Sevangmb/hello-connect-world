
import { MenuItem, MenuItemCategory } from '../../types';

type CacheKey = string;
type CacheValue = MenuItem[];

/**
 * Service pour gérer le cache des éléments de menu
 * Optimise les performances en mettant en cache les résultats des requêtes
 */
export class MenuCacheService {
  private cache: Map<CacheKey, CacheValue> = new Map();
  private timeoutIds: Map<CacheKey, NodeJS.Timeout> = new Map();
  private MAX_CACHE_AGE = 1000 * 60 * 5; // 5 minutes
  
  /**
   * Réinitialise tout le cache
   */
  resetCache(): void {
    this.cache.clear();
    
    // Nettoyer tous les timeouts
    this.timeoutIds.forEach(timeout => clearTimeout(timeout));
    this.timeoutIds.clear();
    
    console.log('Menu cache reset');
  }
  
  /**
   * Récupère des éléments du cache
   */
  get(key: CacheKey): CacheValue | undefined {
    return this.cache.get(key);
  }
  
  /**
   * Stocke des éléments dans le cache
   */
  set(key: CacheKey, value: CacheValue): void {
    this.cache.set(key, value);
    
    // Nettoyer l'ancien timeout s'il existe
    if (this.timeoutIds.has(key)) {
      clearTimeout(this.timeoutIds.get(key)!);
    }
    
    // Définir un timeout pour expirer cet élément de cache
    const timeoutId = setTimeout(() => {
      this.cache.delete(key);
      this.timeoutIds.delete(key);
    }, this.MAX_CACHE_AGE);
    
    this.timeoutIds.set(key, timeoutId);
  }
  
  /**
   * Supprime un élément spécifique du cache
   */
  delete(key: CacheKey): void {
    this.cache.delete(key);
    
    // Nettoyer le timeout
    if (this.timeoutIds.has(key)) {
      clearTimeout(this.timeoutIds.get(key)!);
      this.timeoutIds.delete(key);
    }
  }
  
  /**
   * Génère une clé de cache pour tous les éléments
   */
  allItemsKey(): string {
    return 'all_items';
  }
  
  /**
   * Génère une clé de cache pour les éléments par catégorie
   */
  categoryKey(category: MenuItemCategory): string {
    return `category_${category}`;
  }
  
  /**
   * Génère une clé de cache pour les éléments par module
   */
  moduleKey(moduleCode: string, isAdmin: boolean = false): string {
    return `module_${moduleCode}_${isAdmin ? 'admin' : 'user'}`;
  }
  
  /**
   * Génère une clé de cache pour les éléments par parent
   */
  parentKey(parentId: string | null): string {
    return `parent_${parentId || 'null'}`;
  }
  
  /**
   * Récupère des éléments du cache - alias pour get
   */
  getCachedItems(key: CacheKey): CacheValue | undefined {
    return this.get(key);
  }
  
  /**
   * Met à jour le cache - alias pour set
   */
  updateCache(key: CacheKey, value: CacheValue): void {
    this.set(key, value);
  }
}
