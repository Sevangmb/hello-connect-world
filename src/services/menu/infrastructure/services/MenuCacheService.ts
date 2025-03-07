
import { MenuItem } from '../../types';

/**
 * Service de cache pour les éléments de menu
 */
export class MenuCacheService {
  private _cachedItems: Record<string, MenuItem[]> = {};
  private _lastCacheTime = 0;
  
  private readonly CACHE_TTL = 10000; // 10 secondes de durée de vie du cache
  
  /**
   * Vérifie si le cache est toujours valide
   */
  public isCacheValid(cacheKey: string): boolean {
    return !!this._cachedItems[cacheKey] && 
           Date.now() - this._lastCacheTime < this.CACHE_TTL;
  }
  
  /**
   * Réinitialise le cache entier
   */
  public resetCache(): void {
    this._cachedItems = {};
    this._lastCacheTime = 0;
    console.log('Cache du menu réinitialisé');
  }
  
  /**
   * Met à jour le cache avec de nouvelles données
   */
  public updateCache(cacheKey: string, data: MenuItem[]): void {
    this._cachedItems[cacheKey] = data;
    this._lastCacheTime = Date.now();
    console.log(`Cache mis à jour pour la clé: ${cacheKey} avec ${data.length} éléments`);
  }
  
  /**
   * Récupère les éléments du cache
   */
  public getCachedItems(cacheKey: string): MenuItem[] | null {
    if (this.isCacheValid(cacheKey)) {
      return this._cachedItems[cacheKey];
    }
    return null;
  }
}
