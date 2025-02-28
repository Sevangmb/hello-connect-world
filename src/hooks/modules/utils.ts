
/**
 * Utilitaires pour les modules
 * Ce fichier centralise les fonctions utilitaires pour la gestion des modules
 */

import { AppModule, ModuleStatus } from "./types";

// Clé pour le stockage des modules dans le cache
const MODULE_CACHE_KEY = 'app_modules_cache';
const MODULE_CACHE_TIMESTAMP_KEY = 'app_modules_cache_timestamp';
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes

// Vérifier si un module est actif
export const checkModuleActive = (modules: AppModule[], moduleCode: string): boolean => {
  const module = modules.find(m => m.code === moduleCode);
  return module?.status === 'active';
};

// Vérifier si un module est en mode dégradé
export const checkModuleDegraded = (modules: AppModule[], moduleCode: string): boolean => {
  const module = modules.find(m => m.code === moduleCode);
  return module?.status === 'degraded';
};

// Vérifier si une fonctionnalité spécifique d'un module est activée
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
  
  // Vérifier ensuite si la fonctionnalité est activée
  return !!features[moduleCode]?.[featureCode];
};

// Mettre à jour les modules avec leurs feature flags
export const combineModulesWithFeatures = (
  modules: AppModule[], 
  features: Record<string, Record<string, boolean>>
): AppModule[] => {
  return modules.map(module => ({
    ...module,
    features: features[module.code] || {}
  }));
};

// Préparer les modules pour le stockage en cache local
export const prepareModulesForCache = (modules: AppModule[]): Record<string, ModuleStatus> => {
  const moduleCache: Record<string, ModuleStatus> = {};
  
  modules.forEach(module => {
    moduleCache[module.code] = module.status;
  });
  
  return moduleCache;
};

// Stocker dans le localStorage pour optimiser les performances
export const cacheModuleStatuses = (modules: AppModule[]): void => {
  const moduleCache = prepareModulesForCache(modules);
  localStorage.setItem(MODULE_CACHE_KEY, JSON.stringify(moduleCache));
  localStorage.setItem(MODULE_CACHE_TIMESTAMP_KEY, Date.now().toString());
  
  // Déclencher un événement personnalisé pour informer que le cache des modules a été mis à jour
  window.dispatchEvent(new CustomEvent('app_modules_updated'));
};

// Récupérer les statuts des modules du cache
export const getModuleStatusesFromCache = (): Record<string, ModuleStatus> | null => {
  const cached = localStorage.getItem(MODULE_CACHE_KEY);
  const timestamp = localStorage.getItem(MODULE_CACHE_TIMESTAMP_KEY);
  
  if (!cached || !timestamp) return null;
  
  // Vérifier si le cache est expiré
  const now = Date.now();
  const cacheTime = parseInt(timestamp, 10);
  
  if (now - cacheTime > CACHE_EXPIRY_TIME) {
    // Le cache est expiré, on le supprime
    localStorage.removeItem(MODULE_CACHE_KEY);
    localStorage.removeItem(MODULE_CACHE_TIMESTAMP_KEY);
    return null;
  }
  
  try {
    return JSON.parse(cached) as Record<string, ModuleStatus>;
  } catch (e) {
    console.error("Erreur lors de la lecture du cache des modules:", e);
    return null;
  }
};

// Vérifier l'état d'un canal Supabase
export const checkChannelStatus = (channel: any): string => {
  if (!channel) return 'non initialisé';
  
  return channel.state || 'inconnu';
};

// Fonction pour gérer les erreurs Supabase de manière cohérente
export const handleSupabaseError = (error: any): string => {
  if (!error) return 'Erreur inconnue';
  
  if (typeof error === 'string') return error;
  
  if (error.message) return error.message;
  
  if (error.error_description) return error.error_description;
  
  return 'Une erreur est survenue avec Supabase';
};

// Stocker les modules complets dans le cache pour accès rapide
export const cacheFullModules = (modules: AppModule[]) => {
  try {
    localStorage.setItem('app_modules_full_cache', JSON.stringify(modules));
    localStorage.setItem('app_modules_full_cache_timestamp', Date.now().toString());
  } catch (e) {
    console.error("Erreur lors de la mise en cache des modules complets:", e);
  }
};

// Récupérer les modules complets du cache
export const getFullModulesFromCache = (): AppModule[] | null => {
  try {
    const cached = localStorage.getItem('app_modules_full_cache');
    const timestamp = localStorage.getItem('app_modules_full_cache_timestamp');
    
    if (!cached || !timestamp) return null;
    
    // Vérifier si le cache est expiré
    const now = Date.now();
    const cacheTime = parseInt(timestamp, 10);
    
    if (now - cacheTime > CACHE_EXPIRY_TIME) {
      // Le cache est expiré, on le supprime
      localStorage.removeItem('app_modules_full_cache');
      localStorage.removeItem('app_modules_full_cache_timestamp');
      return null;
    }
    
    return JSON.parse(cached) as AppModule[];
  } catch (e) {
    console.error("Erreur lors de la lecture du cache des modules complets:", e);
    return null;
  }
};
