
/**
 * Hook spécialisé pour vérifier l'état actif/dégradé des modules
 */

import { getModuleStatusesFromCache } from "./utils";
import { AppModule } from "./types";
import { checkModuleActive, checkModuleDegraded, checkFeatureEnabled } from "./utils";
import { ADMIN_MODULE_CODE } from "./useModules";

export const useModuleActive = (modules: AppModule[], features: Record<string, Record<string, boolean>>) => {
  // Vérifier si un module est actif
  const isModuleActive = (moduleCode: string): boolean => {
    // Si le module est Admin, toujours retourner true
    if (moduleCode === ADMIN_MODULE_CODE) return true;
    
    // Si les modules ne sont pas encore chargés, vérifier le cache local
    if (modules.length === 0) {
      const cachedStatuses = getModuleStatusesFromCache();
      if (cachedStatuses && cachedStatuses[moduleCode]) {
        return cachedStatuses[moduleCode] === 'active';
      }
      return false; // Par défaut, considérer inactif si pas de cache
    }
    
    return checkModuleActive(modules, moduleCode);
  };

  // Vérifier si un module est en mode dégradé
  const isModuleDegraded = (moduleCode: string): boolean => {
    // Si le module est Admin, jamais en mode dégradé
    if (moduleCode === ADMIN_MODULE_CODE) return false;
    
    // Si les modules ne sont pas encore chargés, vérifier le cache local
    if (modules.length === 0) {
      const cachedStatuses = getModuleStatusesFromCache();
      if (cachedStatuses && cachedStatuses[moduleCode]) {
        return cachedStatuses[moduleCode] === 'degraded';
      }
      return false; // Par défaut, considérer non-dégradé si pas de cache
    }
    
    return checkModuleDegraded(modules, moduleCode);
  };

  // Vérifier si une fonctionnalité spécifique d'un module est activée
  const isFeatureEnabled = (moduleCode: string, featureCode: string): boolean => {
    // Si le module est Admin, toujours activer ses fonctionnalités
    if (moduleCode === ADMIN_MODULE_CODE) return true;
    
    return checkFeatureEnabled(modules, features, moduleCode, featureCode);
  };

  return {
    isModuleActive,
    isModuleDegraded,
    isFeatureEnabled
  };
};
