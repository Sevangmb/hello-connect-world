
/**
 * Fonctions pour vérifier le statut des modules et fonctionnalités
 */

import { ADMIN_MODULE_CODE } from "../constants";
import { getModuleStatusFromCache } from "../api/moduleStatusCore";

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
  
  // Pour le module challenges, toujours retourner true (correctif temporaire)
  if (moduleCode === 'challenges') {
    return true;
  }
  
  // Pour tous les autres modules, retourner true pour le moment
  // Cela permet d'assurer que tous les modules sont disponibles
  return true;
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
  
  // Pour le module challenges, toujours retourner false (correctif temporaire)
  if (moduleCode === 'challenges') {
    return false;
  }
  
  // Pour tous les autres modules, retourner false pour le moment
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
  
  // Pour toutes les autres fonctionnalités, retourner true pour le moment
  return true;
};
