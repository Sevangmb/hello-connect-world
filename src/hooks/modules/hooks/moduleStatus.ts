
import { ADMIN_MODULE_CODE } from '../constants';
import { getModuleStatusesFromCache } from '../utils';
import { getModuleCache } from '../api/moduleStatusCore';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fonctions synchrones pour vérifier rapidement le statut d'un module
 */

// Cache en mémoire par session pour les résultats des vérifications
const statusVerificationCache: Record<string, {result: boolean, timestamp: number}> = {};
const VERIFICATION_CACHE_VALIDITY_MS = 5000; // 5 secondes

/**
 * Vérifie si un module est actif (version synchrone)
 */
export const getModuleActiveStatus = (
  moduleCode: string, 
  internalModules: any[]
): boolean => {
  // Si c'est le module Admin, toujours actif
  if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) return true;

  // Vérifier le cache de vérification en premier pour les performances optimales
  const cacheKey = `active:${moduleCode}`;
  const now = Date.now();
  const cached = statusVerificationCache[cacheKey];
  if (cached && (now - cached.timestamp < VERIFICATION_CACHE_VALIDITY_MS)) {
    return cached.result;
  }

  // Vérifier le cache en mémoire
  const { inMemoryModulesCache } = getModuleCache();
  if (inMemoryModulesCache && inMemoryModulesCache.length > 0) {
    const module = inMemoryModulesCache.find(m => m.code === moduleCode);
    if (module) {
      // Par défaut, considérer actif sauf si explicitement désactivé
      const result = module.status !== 'inactive';
      statusVerificationCache[cacheKey] = { result, timestamp: now };
      return result;
    }
  }
  
  // Utiliser les modules internes si disponibles
  if (internalModules.length > 0) {
    const module = internalModules.find(m => m.code === moduleCode);
    if (module) {
      // Par défaut, considérer actif sauf si explicitement désactivé
      const result = module.status !== 'inactive';
      statusVerificationCache[cacheKey] = { result, timestamp: now };
      return result;
    }
  }

  // Vérifier le cache localStorage
  const cachedStatuses = getModuleStatusesFromCache();
  if (cachedStatuses && cachedStatuses[moduleCode] !== undefined) {
    // Par défaut, considérer actif sauf si explicitement désactivé
    const result = cachedStatuses[moduleCode] !== 'inactive';
    statusVerificationCache[cacheKey] = { result, timestamp: now };
    return result;
  }
  
  // Par défaut, actif pour rendre tous les modules accessibles
  statusVerificationCache[cacheKey] = { result: true, timestamp: now };
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

  // Vérifier le cache de vérification en premier
  const cacheKey = `degraded:${moduleCode}`;
  const now = Date.now();
  const cached = statusVerificationCache[cacheKey];
  if (cached && (now - cached.timestamp < VERIFICATION_CACHE_VALIDITY_MS)) {
    return cached.result;
  }

  // Vérifier le cache en mémoire
  const { inMemoryModulesCache } = getModuleCache();
  if (inMemoryModulesCache) {
    const module = inMemoryModulesCache.find(m => m.code === moduleCode);
    if (module) {
      const result = module.status === 'degraded';
      statusVerificationCache[cacheKey] = { result, timestamp: now };
      return result;
    }
  }
  
  // Utiliser les modules internes si disponibles
  if (internalModules.length > 0) {
    const module = internalModules.find(m => m.code === moduleCode);
    if (module) {
      const result = module.status === 'degraded';
      statusVerificationCache[cacheKey] = { result, timestamp: now };
      return result;
    }
  }

  // Vérifier le cache localStorage
  const cachedStatuses = getModuleStatusesFromCache();
  if (cachedStatuses && cachedStatuses[moduleCode] !== undefined) {
    const result = cachedStatuses[moduleCode] === 'degraded';
    statusVerificationCache[cacheKey] = { result, timestamp: now };
    return result;
  }

  // Par défaut non dégradé
  statusVerificationCache[cacheKey] = { result: false, timestamp: now };
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

  // Vérifier le cache de vérification en premier
  const cacheKey = `feature:${moduleCode}:${featureCode}`;
  const now = Date.now();
  const cached = statusVerificationCache[cacheKey];
  if (cached && (now - cached.timestamp < VERIFICATION_CACHE_VALIDITY_MS)) {
    return cached.result;
  }

  // Vérifier d'abord si le module est actif
  const moduleActive = getModuleActiveStatus(moduleCode);
  if (!moduleActive) {
    statusVerificationCache[cacheKey] = { result: false, timestamp: now };
    return false;
  }

  // Vérifier dans les fonctionnalités locales
  if (features[moduleCode]) {
    const featureEnabled = features[moduleCode][featureCode];
    if (featureEnabled !== undefined) {
      statusVerificationCache[cacheKey] = { result: featureEnabled, timestamp: now };
      return featureEnabled;
    }
  }

  // Par défaut activé
  statusVerificationCache[cacheKey] = { result: true, timestamp: now };
  return true;
};

// Fonction d'optimisation pour pré-charger les statuts depuis Supabase
export const preloadModuleStatuses = async (): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('app_modules')
      .select('code, status')
      .order('name');

    if (!error && data) {
      const statuses: Record<string, string> = {};
      data.forEach(module => {
        statuses[module.code] = module.status;
      });
      
      // Mettre à jour le cache localStorage
      try {
        localStorage.setItem('app_modules_status_cache', JSON.stringify(statuses));
        localStorage.setItem('app_modules_status_timestamp', Date.now().toString());
      } catch (e) {
        console.error('Erreur lors de la mise en cache des statuts de modules:', e);
      }
      
      // Mettre à jour le cache en mémoire
      updateModuleCache(data);
    }
  } catch (e) {
    console.error('Erreur lors du préchargement des statuts de modules:', e);
  }
};

// Fonction utilitaire pour mise à jour du cache
const updateModuleCache = (modules: any[]) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('module_cache_updated', { 
      detail: { modules }
    }));
  }
};
