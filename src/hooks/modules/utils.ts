
import { AppModule, ModuleStatus } from "./types";

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
  localStorage.setItem('app_modules_cache', JSON.stringify(moduleCache));
  
  // Déclencher un événement personnalisé pour informer que le cache des modules a été mis à jour
  window.dispatchEvent(new CustomEvent('app_modules_updated'));
};

// Récupérer les statuts des modules du cache
export const getModuleStatusesFromCache = (): Record<string, ModuleStatus> | null => {
  const cached = localStorage.getItem('app_modules_cache');
  if (!cached) return null;
  
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
