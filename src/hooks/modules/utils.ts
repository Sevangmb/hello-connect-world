
import { AppModule, ModuleStatus } from './types';

/**
 * Met en cache les statuts des modules pour un accès rapide
 */
export const cacheModuleStatuses = (modules: AppModule[]) => {
  try {
    const statuses: Record<string, ModuleStatus> = {};
    
    for (const module of modules) {
      statuses[module.code] = module.status;
    }
    
    localStorage.setItem('app_modules_status_cache', JSON.stringify(statuses));
    localStorage.setItem('app_modules_status_timestamp', Date.now().toString());
    
    console.log(`Cached ${Object.keys(statuses).length} module statuses to localStorage`);
  } catch (e) {
    console.error('Erreur lors de la mise en cache des statuts de modules:', e);
  }
};

/**
 * Récupère les statuts des modules depuis le cache
 */
export const getModuleStatusesFromCache = (): Record<string, ModuleStatus> | null => {
  try {
    const cachedData = localStorage.getItem('app_modules_status_cache');
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      return parsed;
    }
  } catch (e) {
    console.error('Erreur lors de la lecture du cache des statuts de modules:', e);
  }
  return null;
};

/**
 * Met en cache les modules complets
 */
export const cacheFullModules = (modules: AppModule[]) => {
  try {
    localStorage.setItem('app_modules_cache', JSON.stringify(modules));
    localStorage.setItem('app_modules_cache_timestamp', Date.now().toString());
    
    // Mettre également à jour le cache des statuts
    cacheModuleStatuses(modules);
    
    console.log(`Cached ${modules.length} full modules to localStorage`);
  } catch (e) {
    console.error('Erreur lors de la mise en cache des modules:', e);
  }
};

/**
 * Récupère les modules complets depuis le cache
 */
export const getFullModulesFromCache = (): AppModule[] | null => {
  try {
    const cachedData = localStorage.getItem('app_modules_cache');
    const cachedTimestamp = localStorage.getItem('app_modules_cache_timestamp');
    
    if (cachedData && cachedTimestamp) {
      // Validité du cache: 5 minutes
      const now = Date.now();
      const cacheTime = parseInt(cachedTimestamp, 10);
      
      if (now - cacheTime <= 5 * 60 * 1000) {
        const parsed = JSON.parse(cachedData);
        console.log(`Retrieved ${parsed.length} modules from localStorage cache`);
        return parsed;
      } else {
        console.log("Cache expired, will fetch fresh data");
      }
    }
  } catch (e) {
    console.error('Erreur lors de la lecture du cache des modules:', e);
  }
  return null;
};

/**
 * Vérifie si un module est actif
 */
export const checkModuleActive = (modules: AppModule[], moduleCode: string): boolean => {
  const module = modules.find(m => m.code === moduleCode);
  return module ? module.status === 'active' : false;
};

/**
 * Vérifie si un module est en mode dégradé
 */
export const checkModuleDegraded = (modules: AppModule[], moduleCode: string): boolean => {
  const module = modules.find(m => m.code === moduleCode);
  return module ? module.status === 'degraded' : false;
};

/**
 * Vérifie si une fonctionnalité est activée
 */
export const checkFeatureEnabled = (
  modules: AppModule[],
  features: Record<string, Record<string, boolean>>,
  moduleCode: string,
  featureCode: string
): boolean => {
  // Vérifier d'abord si le module est actif
  if (!checkModuleActive(modules, moduleCode)) {
    return false;
  }
  
  // Vérifier si la fonctionnalité est activée
  if (features[moduleCode] && features[moduleCode][featureCode] !== undefined) {
    return features[moduleCode][featureCode];
  }
  
  return false; // Par défaut, considérer désactivé
};

/**
 * Combine les modules avec les fonctionnalités
 */
export const combineModulesWithFeatures = (
  modules: AppModule[],
  features: Record<string, Record<string, boolean>>
): AppModule[] => {
  return modules.map(module => {
    const moduleFeatures = features[module.code] || {};
    return {
      ...module,
      features: moduleFeatures
    };
  });
};
