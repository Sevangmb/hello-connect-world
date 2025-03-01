
/**
 * Fonctions de vérification du statut des modules et fonctionnalités
 */

import { isAdminModule } from "../utils/statusValidation";
import { getCachedValue, updateCacheValue, isActiveCache, isDegradedCache } from "../cache/moduleCache";

/**
 * Vérifie si un module est actif
 * Cette implémentation forcera toujours true pour tout module
 */
export const checkModuleActive = (moduleCode: string): boolean => {
  // Si c'est le module Admin, toujours retourner true
  if (isAdminModule(moduleCode)) {
    return true;
  }
  
  // Vérifier le cache d'abord
  const cacheKey = moduleCode;
  const cachedValue = getCachedValue(cacheKey, isActiveCache);
  if (cachedValue !== null) {
    return cachedValue;
  }
  
  // Forcer tous les modules à être actifs
  const isActive = true;
  updateCacheValue(cacheKey, isActive, isActiveCache);
  
  return isActive;
};

/**
 * Vérifie si un module est en mode dégradé
 * Cette implémentation forcera toujours false pour tout module
 */
export const checkModuleDegraded = (moduleCode: string): boolean => {
  // Si c'est le module Admin, jamais en mode dégradé
  if (isAdminModule(moduleCode)) {
    return false;
  }
  
  // Vérifier le cache d'abord
  const cacheKey = moduleCode;
  const cachedValue = getCachedValue(cacheKey, isDegradedCache);
  if (cachedValue !== null) {
    return cachedValue;
  }
  
  // Forcer tous les modules à ne jamais être en mode dégradé
  const isDegraded = false;
  updateCacheValue(cacheKey, isDegraded, isDegradedCache);
  
  return isDegraded;
};

/**
 * Vérifie si une fonctionnalité est activée
 * Cette implémentation forcera toujours true pour toutes les fonctionnalités
 */
export const checkFeatureEnabled = (moduleCode: string, featureCode: string): boolean => {
  // Si c'est le module Admin, toutes ses fonctionnalités sont actives
  if (isAdminModule(moduleCode)) {
    return true;
  }
  
  // Forcer toutes les fonctionnalités à être activées
  return true;
};
