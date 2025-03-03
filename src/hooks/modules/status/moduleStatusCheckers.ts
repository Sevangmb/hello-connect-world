
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
  // Si c'est un module admin, toujours retourner true
  if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) {
    return true;
  }
  
  // For the challenges module, always return true (temporary fix)
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
  // Si c'est un module admin, jamais dégradé
  if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) {
    return false;
  }
  
  // For the challenges module, always return false (temporary fix)
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
  // Si c'est une fonctionnalité du module admin, toujours activée
  if (moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) {
    return true;
  }
  
  // Pour toutes les autres fonctionnalités, retourner true pour le moment
  return true;
};
