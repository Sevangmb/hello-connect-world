
/**
 * Service responsible for module caching
 */
import { AppModule } from "../types";

// Cache pour optimiser les performances entre les rendus
const modulesCache = new Map<string, {data: AppModule[], timestamp: number}>();
const featuresCache = new Map<string, {data: Record<string, Record<string, boolean>>, timestamp: number}>();
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
export const getModulesFromCache = (cacheKey: string = 'all_modules'): AppModule[] | null => {
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
 * Alias pour updateModulesCache pour la rétrocompatibilité
 */
export const cacheModules = (modules: AppModule[], cacheKey: string = 'all_modules'): void => {
  updateModulesCache(cacheKey, modules);
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

/**
 * Efface tous les caches
 */
export const clearCache = (): void => {
  modulesCache.clear();
  featuresCache.clear();
};

/**
 * Cache des fonctionnalités
 */
export const cacheFeatures = (features: Record<string, Record<string, boolean>>, cacheKey: string = 'all_features'): void => {
  featuresCache.set(cacheKey, {
    data: features,
    timestamp: Date.now()
  });
};

/**
 * Obtient les fonctionnalités depuis le cache
 */
export const getFeaturesFromCache = (cacheKey: string = 'all_features'): Record<string, Record<string, boolean>> | null => {
  const cache = featuresCache.get(cacheKey);
  
  if (!cache || (Date.now() - cache.timestamp > CACHE_VALIDITY)) {
    return null;
  }
  
  return cache.data;
};

/**
 * Récupère le statut d'un module depuis le cache
 */
export const getModuleStatus = (moduleCode: string): string | null => {
  const cachedModules = getModulesFromCache();
  if (!cachedModules) return null;
  
  const module = cachedModules.find(m => m.code === moduleCode);
  return module ? module.status : null;
};
