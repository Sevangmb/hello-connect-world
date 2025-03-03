
/**
 * Fonctions pour vérifier le statut des modules et fonctionnalités
 */

import { ADMIN_MODULE_CODE } from "../constants";
import { getModuleStatusFromCache } from "../api/moduleStatusCore";
import { supabase } from "@/integrations/supabase/client";

/**
 * Vérifie si un module est actif
 * Retourne toujours true pour le module Admin
 */
export const checkModuleActive = (moduleCode: string): boolean => {
  // Tableau des codes de modules admin
  const adminModuleCodes = [
    ADMIN_MODULE_CODE,
    'admin',
    'admin_modules',
    'admin_dashboard',
    'admin_users',
    'admin_shops',
    'admin_orders',
    'admin_marketplace',
    'admin_content',
    'admin_stats',
    'admin_marketing',
    'admin_settings',
    'admin_help'
  ];

  // Si c'est un module admin ou commence par admin_, toujours retourner true
  if (adminModuleCodes.includes(moduleCode) || moduleCode.startsWith('admin_')) {
    console.log(`Module ${moduleCode} est un module admin, toujours actif`);
    return true;
  }
  
  // Pour les autres modules, vérifier dans le cache
  const cachedStatus = getModuleStatusFromCache(moduleCode);
  if (cachedStatus !== null) {
    return cachedStatus === 'active';
  }
  
  // Si pas de cache, vérifier dans localStorage
  try {
    const modulesCache = localStorage.getItem('modules_cache');
    if (modulesCache) {
      const modules = JSON.parse(modulesCache);
      const module = modules.find((m: any) => m.code === moduleCode);
      if (module) {
        return module.status === 'active';
      }
    }
  } catch (e) {
    console.error("Erreur lors de la lecture du cache des modules:", e);
  }
  
  // Par défaut, considérer comme inactif si non trouvé
  return false;
};

/**
 * Vérifie si un module est en mode dégradé
 * Retourne toujours false pour le module Admin
 */
export const checkModuleDegraded = (moduleCode: string): boolean => {
  // Tableau des codes de modules admin
  const adminModuleCodes = [
    ADMIN_MODULE_CODE,
    'admin',
    'admin_modules',
    'admin_dashboard',
    'admin_users',
    'admin_shops',
    'admin_orders',
    'admin_marketplace',
    'admin_content',
    'admin_stats',
    'admin_marketing',
    'admin_settings',
    'admin_help'
  ];
  
  // Si c'est un module admin ou commence par admin_, jamais dégradé
  if (adminModuleCodes.includes(moduleCode) || moduleCode.startsWith('admin_')) {
    return false;
  }
  
  // Pour les autres modules, vérifier dans le cache
  const cachedStatus = getModuleStatusFromCache(moduleCode);
  if (cachedStatus !== null) {
    return cachedStatus === 'degraded';
  }
  
  // Si pas de cache, vérifier dans localStorage
  try {
    const modulesCache = localStorage.getItem('modules_cache');
    if (modulesCache) {
      const modules = JSON.parse(modulesCache);
      const module = modules.find((m: any) => m.code === moduleCode);
      if (module) {
        return module.status === 'degraded';
      }
    }
  } catch (e) {
    console.error("Erreur lors de la lecture du cache des modules:", e);
  }
  
  // Par défaut, considérer comme non dégradé si non trouvé
  return false;
};

/**
 * Vérifie si une fonctionnalité est activée
 * Retourne toujours true pour les fonctionnalités du module Admin
 */
export const checkFeatureEnabled = (moduleCode: string, featureCode: string): boolean => {
  // Tableau des codes de modules admin
  const adminModuleCodes = [
    ADMIN_MODULE_CODE,
    'admin',
    'admin_modules',
    'admin_dashboard',
    'admin_users',
    'admin_shops',
    'admin_orders',
    'admin_marketplace',
    'admin_content',
    'admin_stats',
    'admin_marketing',
    'admin_settings',
    'admin_help'
  ];
  
  // Si c'est une fonctionnalité d'un module admin, toujours activée
  if (adminModuleCodes.includes(moduleCode) || moduleCode.startsWith('admin_')) {
    return true;
  }
  
  // D'abord vérifier si le module lui-même est actif
  if (!checkModuleActive(moduleCode)) {
    return false;
  }
  
  // Pour les autres fonctionnalités, vérifier dans le cache
  try {
    const featuresCache = localStorage.getItem('features_cache');
    if (featuresCache) {
      const features = JSON.parse(featuresCache);
      if (features[moduleCode] && features[moduleCode][featureCode] !== undefined) {
        return features[moduleCode][featureCode];
      }
    }
  } catch (e) {
    console.error("Erreur lors de la lecture du cache des fonctionnalités:", e);
  }
  
  // Par défaut, permettre l'accès si le module est actif
  return true;
};
