
import { ModuleStatus, AppModule } from '../types';
import { ADMIN_MODULE_CODE } from '../useModules';

// Cache pour les modules et features avec durée de validité
let inMemoryModulesCache: AppModule[] | null = null;
let lastFetchTimestamp = 0;
// Cache de statut des modules pour les vérifications fréquentes
const moduleStatusCache: Record<string, {status: ModuleStatus, timestamp: number}> = {};
// Durée de validité du cache: 30 secondes
const CACHE_VALIDITY_MS = 30000;
// Durée de validité du cache de statut: 10 secondes
const STATUS_CACHE_VALIDITY_MS = 10000;

/**
 * Mettre à jour le cache en mémoire
 */
export const updateModuleCache = (modules: AppModule[]) => {
  inMemoryModulesCache = modules;
  lastFetchTimestamp = Date.now();
  
  // Mettre également à jour le cache de statut
  modules.forEach(module => {
    moduleStatusCache[module.code] = {
      status: module.status,
      timestamp: Date.now()
    };
  });
  
  // Enregistrer également dans le localStorage pour persistance
  try {
    localStorage.setItem('modules_cache', JSON.stringify(modules));
    localStorage.setItem('modules_cache_timestamp', lastFetchTimestamp.toString());
  } catch (e) {
    console.error('Erreur lors de la mise en cache des modules:', e);
  }
};

/**
 * Obtenir le cache
 */
export const getModuleCache = () => {
  // Si le cache en mémoire est vide mais qu'il existe dans localStorage, le récupérer
  if (!inMemoryModulesCache) {
    try {
      const cachedModules = localStorage.getItem('modules_cache');
      const cachedTimestamp = localStorage.getItem('modules_cache_timestamp');
      
      if (cachedModules && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp, 10);
        // Vérifier si le cache n'est pas trop ancien (5 minutes max)
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          inMemoryModulesCache = JSON.parse(cachedModules);
          lastFetchTimestamp = timestamp;
          
          // Repeupler le cache de statut
          inMemoryModulesCache.forEach(module => {
            moduleStatusCache[module.code] = {
              status: module.status,
              timestamp: Date.now()
            };
          });
        }
      }
    } catch (e) {
      console.error('Erreur lors de la récupération du cache des modules:', e);
    }
  }
  
  return { inMemoryModulesCache, lastFetchTimestamp };
};

/**
 * Obtenir rapidement le statut d'un module depuis le cache
 * @returns Le statut du module ou null si non trouvé dans le cache
 */
export const getModuleStatusFromCache = (moduleCode: string): ModuleStatus | null => {
  // Si c'est le module Admin, toujours retourner 'active'
  if (isAdminModule(moduleCode)) return 'active';
  
  // Vérifier dans le cache de statut
  const cachedStatus = moduleStatusCache[moduleCode];
  if (cachedStatus && (Date.now() - cachedStatus.timestamp < STATUS_CACHE_VALIDITY_MS)) {
    console.log(`Module ${moduleCode} trouvé dans le cache rapide avec statut: ${cachedStatus.status}`);
    return cachedStatus.status;
  }
  
  // Vérifier dans le cache des modules
  const { inMemoryModulesCache } = getModuleCache();
  if (inMemoryModulesCache) {
    const module = inMemoryModulesCache.find(m => m.code === moduleCode);
    if (module) {
      // Mettre à jour le cache de statut
      moduleStatusCache[moduleCode] = {
        status: module.status,
        timestamp: Date.now()
      };
      console.log(`Module ${moduleCode} trouvé dans le cache mémoire avec statut: ${module.status}`);
      return module.status;
    }
  }
  
  // Vérifier dans le localStorage en direct
  try {
    const cachedModules = localStorage.getItem('modules_cache');
    if (cachedModules) {
      const modules = JSON.parse(cachedModules) as AppModule[];
      const module = modules.find(m => m.code === moduleCode);
      if (module) {
        // Mettre à jour le cache de statut
        moduleStatusCache[moduleCode] = {
          status: module.status,
          timestamp: Date.now()
        };
        console.log(`Module ${moduleCode} trouvé dans le localStorage avec statut: ${module.status}`);
        return module.status;
      }
    }
  } catch (e) {
    console.error('Erreur lors de la récupération directe du cache des modules:', e);
  }
  
  console.log(`Module ${moduleCode} non trouvé dans les caches, retour null`);
  return null;
};

/**
 * Vérifier si un module est le module admin ou commence par admin
 */
export const isAdminModule = (moduleCode: string): boolean => {
  return moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin');
};
