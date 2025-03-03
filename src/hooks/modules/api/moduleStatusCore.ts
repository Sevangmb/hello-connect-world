import { ModuleStatus, AppModule } from '../types';
import { ADMIN_MODULE_CODE } from '../constants';

// Cache pour les modules et features avec durée de validité
let inMemoryModulesCache: AppModule[] | null = null;
let lastFetchTimestamp = 0;

// Cache de statut des modules pour les vérifications fréquentes
const moduleStatusCache: Record<string, {status: ModuleStatus, timestamp: number}> = {};

// Durée de validité du cache: 60 secondes (augmenté pour plus de performance)
const CACHE_VALIDITY_MS = 60000;

// Durée de validité du cache de statut: 30 secondes (augmenté pour plus de performance)
const STATUS_CACHE_VALIDITY_MS = 30000;

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
    const modulesToCache = modules.map(m => ({
      id: m.id,
      code: m.code,
      status: m.status,
      name: m.name,
      is_core: m.is_core
    }));
    
    localStorage.setItem('modules_cache', JSON.stringify(modulesToCache));
    localStorage.setItem('modules_cache_timestamp', lastFetchTimestamp.toString());
    
    // Mettre à jour également le cache séparé des statuts
    const statuses: Record<string, ModuleStatus> = {};
    modules.forEach(m => {
      statuses[m.code] = m.status;
    });
    localStorage.setItem('app_modules_status_cache', JSON.stringify(statuses));
    localStorage.setItem('app_modules_status_timestamp', Date.now().toString());
  } catch (e) {
    console.error('Erreur lors de la mise en cache des modules:', e);
  }
  
  // Déclencher un événement pour informer les composants
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('module_cache_updated'));
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
        // Augmenté à 30 minutes pour réduire les rechargements
        if (Date.now() - timestamp < 30 * 60 * 1000) {
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
 * Vérifie si un module est un module d'administration
 */
export const isAdminModule = (moduleCode: string): boolean => {
  // Liste des modules d'administration
  const adminModules = ['admin', 'admin_dashboard', 'admin_users', 'admin_modules', 'admin_settings'];
  
  console.log(`Vérification si ${moduleCode} est un module admin. Résultat: ${adminModules.includes(moduleCode) || moduleCode.startsWith('admin_')}`);
  
  return adminModules.includes(moduleCode) || moduleCode.startsWith('admin_');
};

/**
 * Obtenir rapidement le statut d'un module depuis le cache
 * @returns Le statut du module ou null si non trouvé dans le cache
 */
export const getModuleStatusFromCache = (moduleCode: string): ModuleStatus | null => {
  // Si c'est le module Admin, toujours retourner 'active'
  if (isAdminModule(moduleCode)) return 'active';
  
  // Pour le déboggage, temporairement considérer 'challenges' comme actif
  if (moduleCode === 'challenges') {
    console.log("getModuleStatusFromCache: Force module challenges à actif");
    return 'active';
  }
  
  // Vérifier dans le cache de statut
  const cachedStatus = moduleStatusCache[moduleCode];
  if (cachedStatus && (Date.now() - cachedStatus.timestamp < STATUS_CACHE_VALIDITY_MS)) {
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
      return module.status;
    }
  }
  
  // Vérifier dans le localStorage en direct (optimisé)
  try {
    const cachedStatusesJson = localStorage.getItem('app_modules_status_cache');
    if (cachedStatusesJson) {
      const cachedStatuses = JSON.parse(cachedStatusesJson);
      if (cachedStatuses[moduleCode] !== undefined) {
        // Mettre à jour le cache de statut
        moduleStatusCache[moduleCode] = {
          status: cachedStatuses[moduleCode] as ModuleStatus,
          timestamp: Date.now()
        };
        return cachedStatuses[moduleCode] as ModuleStatus;
      }
    }
  } catch (e) {
    console.error('Erreur lors de la récupération directe du cache des statuts:', e);
  }
  
  // Par défaut actif
  return 'active';
};

/**
 * Purger tous les caches pour forcer un rechargement
 */
export const purgeModuleCaches = () => {
  // Vider le cache en mémoire
  inMemoryModulesCache = null;
  
  // Réinitialiser le cache de statut
  Object.keys(moduleStatusCache).forEach(key => {
    delete moduleStatusCache[key];
  });
  
  // Supprimer du localStorage
  try {
    localStorage.removeItem('modules_cache');
    localStorage.removeItem('modules_cache_timestamp');
    localStorage.removeItem('app_modules_status_cache');
    localStorage.removeItem('app_modules_status_timestamp');
  } catch (e) {
    console.error('Erreur lors de la purge des caches:', e);
  }
};
