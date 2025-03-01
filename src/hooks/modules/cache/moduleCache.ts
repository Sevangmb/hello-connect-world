
/**
 * Gestion du cache pour les modules et leurs statuts
 */

import { ModuleStatus } from "../types";
import { CACHE_VALIDITY_MS } from "../constants";

// Cache en mémoire pour éviter des recalculs fréquents
export const isActiveCache: Record<string, { value: boolean, timestamp: number }> = {};
export const isDegradedCache: Record<string, { value: boolean, timestamp: number }> = {};

/**
 * Vérifie si une entrée de cache est valide
 */
export const isCacheValid = (cacheKey: string, cache: Record<string, { value: boolean, timestamp: number }>): boolean => {
  const cachedValue = cache[cacheKey];
  if (!cachedValue) return false;
  
  const now = Date.now();
  return (now - cachedValue.timestamp) < CACHE_VALIDITY_MS;
};

/**
 * Obtient une valeur du cache si elle est valide
 */
export const getCachedValue = (
  cacheKey: string, 
  cache: Record<string, { value: boolean, timestamp: number }>
): boolean | null => {
  if (isCacheValid(cacheKey, cache)) {
    return cache[cacheKey].value;
  }
  return null;
};

/**
 * Met à jour une entrée dans le cache
 */
export const updateCacheValue = (
  cacheKey: string, 
  value: boolean, 
  cache: Record<string, { value: boolean, timestamp: number }>
): void => {
  cache[cacheKey] = { value, timestamp: Date.now() };
};

/**
 * Invalide une entrée dans le cache
 */
export const invalidateCacheEntry = (
  cacheKey: string, 
  cache: Record<string, { value: boolean, timestamp: number }>
): void => {
  delete cache[cacheKey];
};

/**
 * Invalide toutes les entrées dans le cache
 */
export const invalidateAllCache = (): void => {
  Object.keys(isActiveCache).forEach(key => delete isActiveCache[key]);
  Object.keys(isDegradedCache).forEach(key => delete isDegradedCache[key]);
};
