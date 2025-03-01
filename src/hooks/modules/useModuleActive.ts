
/**
 * Hook spécialisé pour vérifier l'état actif/dégradé des modules
 */

import { getModuleStatusesFromCache } from "./utils";
import { AppModule } from "./types";
import { checkModuleActive, checkModuleDegraded, checkFeatureEnabled } from "./utils";
import { ADMIN_MODULE_CODE } from "./useModules";
import { getModuleStatusFromCache } from "./api/moduleStatusCore";

// Cache de vérification en mémoire pour éviter des calculs répétés
const verificationCache = {
  modules: new Map<string, {result: boolean, timestamp: number}>(),
  features: new Map<string, {result: boolean, timestamp: number}>()
};

// Durée de validité du cache: 5 secondes
const CACHE_VALIDITY_MS = 5000;

export const useModuleActive = (modules: AppModule[], features: Record<string, Record<string, boolean>>) => {
  // Vérifier si un module est actif
  const isModuleActive = (moduleCode: string): boolean => {
    // Si le module est Admin, toujours retourner true
    if (moduleCode === ADMIN_MODULE_CODE) {
      console.log(`useModuleActive: ${moduleCode} est le module admin, retour true`);
      return true;
    }
    
    // Vérifier le cache de vérification
    const cacheKey = `active:${moduleCode}`;
    const cached = verificationCache.modules.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_VALIDITY_MS)) {
      console.log(`useModuleActive: Utilisation du cache pour ${moduleCode}: ${cached.result}`);
      return cached.result;
    }
    
    // Vérifier d'abord dans le cache rapide
    const cachedStatus = getModuleStatusFromCache(moduleCode);
    if (cachedStatus !== null) {
      const result = cachedStatus === 'active';
      // Mettre à jour le cache
      verificationCache.modules.set(cacheKey, {result, timestamp: Date.now()});
      console.log(`useModuleActive: Status de ${moduleCode} depuis le cache rapide: ${cachedStatus} => ${result}`);
      return result;
    }
    
    // Si les modules ne sont pas encore chargés, vérifier le cache local
    if (modules.length === 0) {
      const cachedStatuses = getModuleStatusesFromCache();
      if (cachedStatuses && cachedStatuses[moduleCode]) {
        const result = cachedStatuses[moduleCode] === 'active';
        // Mettre à jour le cache
        verificationCache.modules.set(cacheKey, {result, timestamp: Date.now()});
        console.log(`useModuleActive: Status de ${moduleCode} depuis le localStorage: ${cachedStatuses[moduleCode]} => ${result}`);
        return result;
      }
      console.log(`useModuleActive: ${moduleCode} non trouvé dans les caches, modules non chargés, retour false`);
      return false; // Par défaut, considérer inactif si pas de cache
    }
    
    const result = checkModuleActive(modules, moduleCode);
    // Mettre à jour le cache
    verificationCache.modules.set(cacheKey, {result, timestamp: Date.now()});
    console.log(`useModuleActive: Vérification complète pour ${moduleCode}: ${result}`);
    return result;
  };

  // Vérifier si un module est en mode dégradé
  const isModuleDegraded = (moduleCode: string): boolean => {
    // Si le module est Admin, jamais en mode dégradé
    if (moduleCode === ADMIN_MODULE_CODE) return false;
    
    // Vérifier le cache de vérification
    const cacheKey = `degraded:${moduleCode}`;
    const cached = verificationCache.modules.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_VALIDITY_MS)) {
      return cached.result;
    }
    
    // Vérifier d'abord dans le cache rapide
    const cachedStatus = getModuleStatusFromCache(moduleCode);
    if (cachedStatus !== null) {
      const result = cachedStatus === 'degraded';
      // Mettre à jour le cache
      verificationCache.modules.set(cacheKey, {result, timestamp: Date.now()});
      return result;
    }
    
    // Si les modules ne sont pas encore chargés, vérifier le cache local
    if (modules.length === 0) {
      const cachedStatuses = getModuleStatusesFromCache();
      if (cachedStatuses && cachedStatuses[moduleCode]) {
        const result = cachedStatuses[moduleCode] === 'degraded';
        // Mettre à jour le cache
        verificationCache.modules.set(cacheKey, {result, timestamp: Date.now()});
        return result;
      }
      return false; // Par défaut, considérer non-dégradé si pas de cache
    }
    
    const result = checkModuleDegraded(modules, moduleCode);
    // Mettre à jour le cache
    verificationCache.modules.set(cacheKey, {result, timestamp: Date.now()});
    return result;
  };

  // Vérifier si une fonctionnalité spécifique d'un module est activée
  const isFeatureEnabled = (moduleCode: string, featureCode: string): boolean => {
    // Si le module est Admin, toujours activer ses fonctionnalités
    if (moduleCode === ADMIN_MODULE_CODE) return true;
    
    // Vérifier le cache de vérification
    const cacheKey = `feature:${moduleCode}:${featureCode}`;
    const cached = verificationCache.features.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_VALIDITY_MS)) {
      return cached.result;
    }
    
    // Vérifier d'abord si le module est actif
    if (!isModuleActive(moduleCode)) {
      // Mettre à jour le cache
      verificationCache.features.set(cacheKey, {result: false, timestamp: Date.now()});
      return false;
    }
    
    const result = checkFeatureEnabled(modules, features, moduleCode, featureCode);
    // Mettre à jour le cache
    verificationCache.features.set(cacheKey, {result, timestamp: Date.now()});
    return result;
  };

  return {
    isModuleActive,
    isModuleDegraded,
    isFeatureEnabled
  };
};
