
/**
 * Fonctions d'utilitaires pour la validation des statuts de modules
 */

import { ModuleStatus } from "../types";
import { ADMIN_MODULE_CODE } from "../constants";

/**
 * Vérifie si un code de module correspond au module Admin
 */
export const isAdminModule = (moduleCode: string): boolean => {
  return moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin');
};

/**
 * Valide le statut d'un module et retourne un statut ModuleStatus valide
 */
export const validateModuleStatus = (status: string): ModuleStatus => {
  if (status === 'active' || status === 'inactive' || status === 'degraded' || status === 'maintenance') {
    return status as ModuleStatus;
  }
  return 'inactive' as ModuleStatus;
};

/**
 * Force le statut actif pour le module Admin
 */
export const enforceAdminActiveStatus = (moduleCode: string, status: ModuleStatus): ModuleStatus => {
  if (isAdminModule(moduleCode)) {
    return 'active';
  }
  return status;
};
