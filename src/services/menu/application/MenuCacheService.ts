
import { MenuItem } from "../types";
import { CACHE_VALIDITY_MS } from "@/hooks/modules/constants";

/**
 * Service de cache pour les éléments de menu
 * Couche Application de la Clean Architecture
 */
export class MenuCacheService {
  private cache: {
    items: MenuItem[];
    timestamp: number;
  } = {
    items: [],
    timestamp: 0
  };
  
  /**
   * Vérifie si le cache est valide
   */
  isCacheValid(): boolean {
    const now = Date.now();
    return this.cache.items.length > 0 && (now - this.cache.timestamp) < CACHE_VALIDITY_MS;
  }
  
  /**
   * Récupère les éléments du cache
   */
  getCachedItems(): MenuItem[] {
    return this.cache.items;
  }
  
  /**
   * Met à jour le cache
   * @param items Nouveaux éléments à mettre en cache
   */
  updateCache(items: MenuItem[]): void {
    this.cache = {
      items,
      timestamp: Date.now()
    };
  }
  
  /**
   * Invalide le cache
   */
  invalidateCache(): void {
    this.cache.timestamp = 0;
  }
}
