
/**
 * Service responsible for module caching
 */
import { AppModule } from "../types";

// Cache pour optimiser les performances entre les rendus
const modulesCache = new Map<string, {data: AppModule[], timestamp: number}>();
const CACHE_VALIDITY = 60000; // 1 minute

/**
 * Vérifie si un module existe dans le cache et s'il est valide
 */
export const isModuleCacheValid = (cacheKey: string): boolean => {
  if (!modulesCache.has(cacheKey)) return false;
  
  const cache = modulesCache.get(cacheKey);
  if (!cache) return false;
  
  return (Date.now() - cache.timestamp < CACHE_VALIDITY);
};

/**
 * Récupère des modules depuis le cache
 */
export const getModulesFromCache = (cacheKey: string): AppModule[] | null => {
  if (!isModuleCacheValid(cacheKey)) return null;
  const cache = modulesCache.get(cacheKey);
  return cache?.data || null;
};

/**
 * Met à jour le cache des modules
 */
export const updateModulesCache = (cacheKey: string, modules: AppModule[]): void => {
  if (modules && modules.length > 0) {
    modulesCache.set(cacheKey, {
      data: modules,
      timestamp: Date.now()
    });
  }
};

/**
 * Invalide une entrée spécifique du cache
 */
export const invalidateModuleCache = (cacheKey: string): void => {
  if (modulesCache.has(cacheKey)) {
    modulesCache.delete(cacheKey);
  }
};

/**
 * Invalide tout le cache des modules
 */
export const invalidateAllModuleCache = (): void => {
  modulesCache.clear();
};
