
import { ADMIN_MODULE_CODE } from '../useModules';
import { getModuleStatusesFromCache } from '../utils';
import { getModuleCache } from '../api/moduleStatus';

/**
 * Fonctions synchrones pour vérifier rapidement le statut d'un module
 */

/**
 * Vérifie si un module est actif (version synchrone)
 */
export const getModuleActiveStatus = (
  moduleCode: string, 
  internalModules: any[]
): boolean => {
  // Si c'est le module Admin, toujours actif
  if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) return true;

  // DEBUG: Log module check
  console.log(`Checking active status for module: ${moduleCode}`);

  // Vérifier le cache en mémoire
  const { inMemoryModulesCache } = getModuleCache();
  if (inMemoryModulesCache && inMemoryModulesCache.length > 0) {
    const module = inMemoryModulesCache.find(m => m.code === moduleCode);
    if (module) {
      console.log(`Found module ${moduleCode} in memory cache with status: ${module.status}`);
      return module.status === 'active';
    }
  }
  
  // Utiliser les modules internes si disponibles
  if (internalModules.length > 0) {
    const module = internalModules.find(m => m.code === moduleCode);
    if (module) {
      console.log(`Found module ${moduleCode} in internal modules with status: ${module.status}`);
      return module.status === 'active';
    }
  }

  // Vérifier le cache localStorage
  const cachedStatuses = getModuleStatusesFromCache();
  if (cachedStatuses && cachedStatuses[moduleCode] !== undefined) {
    console.log(`Found module ${moduleCode} in localStorage cache with status: ${cachedStatuses[moduleCode]}`);
    return cachedStatuses[moduleCode] === 'active';
  }

  // Log if module not found
  console.log(`Module ${moduleCode} not found in any cache, defaulting to true`);
  
  // Par défaut, actif pour éviter des problèmes d'affichage
  return true;
};

/**
 * Vérifie si un module est en mode dégradé (version synchrone)
 */
export const getModuleDegradedStatus = (
  moduleCode: string,
  internalModules: any[]
): boolean => {
  // Si c'est le module Admin, jamais dégradé
  if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) return false;

  // Vérifier le cache en mémoire
  const { inMemoryModulesCache } = getModuleCache();
  if (inMemoryModulesCache) {
    const module = inMemoryModulesCache.find(m => m.code === moduleCode);
    if (module) {
      return module.status === 'degraded';
    }
  }
  
  // Utiliser les modules internes si disponibles
  if (internalModules.length > 0) {
    const module = internalModules.find(m => m.code === moduleCode);
    if (module) {
      return module.status === 'degraded';
    }
  }

  // Vérifier le cache localStorage
  const cachedStatuses = getModuleStatusesFromCache();
  if (cachedStatuses && cachedStatuses[moduleCode] !== undefined) {
    return cachedStatuses[moduleCode] === 'degraded';
  }

  // Par défaut non dégradé
  return false;
};

/**
 * Vérifie si une fonctionnalité est activée (version synchrone)
 */
export const getFeatureEnabledStatus = (
  moduleCode: string,
  featureCode: string,
  features: Record<string, Record<string, boolean>>,
  getModuleActiveStatus: (moduleCode: string) => boolean
): boolean => {
  // Si c'est le module Admin, toutes les fonctionnalités sont actives
  if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) return true;

  // Vérifier d'abord si le module est actif
  const moduleActive = getModuleActiveStatus(moduleCode);
  if (!moduleActive) return false;

  // Vérifier dans les fonctionnalités locales
  if (features[moduleCode]) {
    const featureEnabled = features[moduleCode][featureCode];
    if (featureEnabled !== undefined) {
      return featureEnabled;
    }
  }

  // Par défaut activé
  return true;
};
