
/**
 * Service de cache pour les modules
 * Gère la mise en cache et la récupération des données de modules
 */
import { AppModule } from '@/hooks/modules/types';

export class ModuleCacheService {
  private CACHE_KEY_MODULES = 'app_modules_cache';
  private CACHE_KEY_TIMESTAMP = 'app_modules_cache_timestamp';
  private CACHE_VALIDITY_MS = 1800000; // 30 minutes
  
  // Cache mémoire pour un accès plus rapide
  private inMemoryCache: AppModule[] | null = null;
  private lastCacheUpdate = 0;

  /**
   * Met en cache les modules
   * @param modules Modules à mettre en cache
   */
  cacheModules(modules: AppModule[]): void {
    try {
      // Mettre en cache en mémoire
      this.inMemoryCache = modules;
      this.lastCacheUpdate = Date.now();
      
      // Mettre en cache dans le localStorage
      localStorage.setItem(this.CACHE_KEY_MODULES, JSON.stringify(modules));
      localStorage.setItem(this.CACHE_KEY_TIMESTAMP, this.lastCacheUpdate.toString());
    } catch (error) {
      console.error('Erreur lors de la mise en cache des modules:', error);
    }
  }

  /**
   * Récupère les modules depuis le cache
   * @returns AppModule[] Modules en cache ou tableau vide si le cache est expiré
   */
  getModulesFromCache(): AppModule[] {
    // Si disponible en mémoire et valide, utiliser le cache mémoire
    if (this.inMemoryCache && (Date.now() - this.lastCacheUpdate < this.CACHE_VALIDITY_MS)) {
      return this.inMemoryCache;
    }
    
    try {
      // Récupérer depuis le localStorage
      const cachedModulesString = localStorage.getItem(this.CACHE_KEY_MODULES);
      const cachedTimestampString = localStorage.getItem(this.CACHE_KEY_TIMESTAMP);
      
      if (cachedModulesString && cachedTimestampString) {
        const timestamp = parseInt(cachedTimestampString, 10);
        
        // Vérifier si le cache est valide
        if (Date.now() - timestamp < this.CACHE_VALIDITY_MS) {
          const modules = JSON.parse(cachedModulesString) as AppModule[];
          // Mettre à jour le cache mémoire
          this.inMemoryCache = modules;
          this.lastCacheUpdate = timestamp;
          return modules;
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du cache des modules:', error);
    }
    
    return [];
  }

  /**
   * Vide le cache
   */
  clearCache(): void {
    try {
      this.inMemoryCache = null;
      this.lastCacheUpdate = 0;
      localStorage.removeItem(this.CACHE_KEY_MODULES);
      localStorage.removeItem(this.CACHE_KEY_TIMESTAMP);
    } catch (error) {
      console.error('Erreur lors du nettoyage du cache des modules:', error);
    }
  }

  /**
   * Vérifie si le cache est valide
   * @returns boolean True si le cache est valide
   */
  isCacheValid(): boolean {
    if (this.inMemoryCache && (Date.now() - this.lastCacheUpdate < this.CACHE_VALIDITY_MS)) {
      return true;
    }
    
    try {
      const cachedTimestampString = localStorage.getItem(this.CACHE_KEY_TIMESTAMP);
      if (cachedTimestampString) {
        const timestamp = parseInt(cachedTimestampString, 10);
        return Date.now() - timestamp < this.CACHE_VALIDITY_MS;
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de validité du cache:', error);
    }
    
    return false;
  }
}

// Exporter une instance unique pour toute l'application
export const moduleCacheService = new ModuleCacheService();
