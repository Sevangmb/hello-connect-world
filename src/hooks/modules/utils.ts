
import { AppModule, ModuleStatus } from "./types";

// Vérifier si un module est actif
export const checkModuleActive = (modules: AppModule[], moduleCode: string): boolean => {
  if (!modules.length) return false;
  const module = modules.find(m => m.code === moduleCode);
  return module ? module.status === 'active' : false;
};

// Vérifier si un module est en mode dégradé
export const checkModuleDegraded = (modules: AppModule[], moduleCode: string): boolean => {
  if (!modules.length) return false;
  const module = modules.find(m => m.code === moduleCode);
  return module ? module.status === 'degraded' : false;
};

// Vérifier si une fonctionnalité spécifique d'un module est activée
export const checkFeatureEnabled = (
  modules: AppModule[], 
  features: Record<string, Record<string, boolean>>,
  moduleCode: string, 
  featureCode: string
): boolean => {
  // Si le module n'est pas actif, la fonctionnalité ne l'est pas non plus
  if (!checkModuleActive(modules, moduleCode)) return false;
  
  // Vérifier si la fonctionnalité existe et est activée
  return features[moduleCode]?.[featureCode] === true;
};

// Combiner les modules avec leurs feature flags
export const combineModulesWithFeatures = (
  modules: AppModule[], 
  moduleFeatures: Record<string, Record<string, boolean>>
): AppModule[] => {
  return modules.map(module => ({
    ...module,
    features: moduleFeatures[module.code] || {}
  }));
};
