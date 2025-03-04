
import { MenuItem } from "../types";
import { CACHE_VALIDITY_MS } from "@/hooks/modules/constants";

/**
 * Service de cache pour les éléments de menu
 * Couche Application de la Clean Architecture
 */
export class MenuCacheService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  
  /**
   * Récupère des données du cache
   * @param key Clé du cache
   * @returns Données en cache ou null si non trouvées ou expirées
   */
  getCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }
    
    const now = Date.now();
    if (now - cached.timestamp > CACHE_VALIDITY_MS) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  }
  
  /**
   * Met en cache des données
   * @param key Clé du cache
   * @param data Données à mettre en cache
   */
  setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  /**
   * Invalide le cache complet
   */
  invalidateCache(): void {
    this.cache.clear();
  }
  
  /**
   * Efface le cache complet
   * Alias de invalidateCache pour la compatibilité
   */
  clearCache(): void {
    this.invalidateCache();
  }
}
