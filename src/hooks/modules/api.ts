
import { ModuleStatus } from './types';
import { supabase } from '@/integrations/supabase/client';
import { 
  updateModuleCache, 
  getModuleCache, 
  isAdminModule 
} from './api/moduleStatusCore';

import { 
  checkModuleActiveAsync, 
  checkModuleDegradedAsync, 
  checkFeatureEnabledAsync 
} from './api/moduleStatusAsync';

import { 
  updateModuleStatusInDb, 
  updateFeatureStatusInDb 
} from './api/moduleStatusUpdates';

// Fonctions principales pour la gestion des modules

/**
 * Vérifie si un module est actif (version synchrone)
 */
export const isModuleActive = (moduleCode: string): boolean => {
  // Les modules Admin sont toujours actifs
  if (isAdminModule(moduleCode)) {
    return true;
  }

  // Vérifier le cache
  const moduleData = getModuleCache(moduleCode);
  return moduleData?.status === 'active';
};

/**
 * Vérifie si une fonctionnalité de module est activée (version synchrone)
 */
export const isFeatureEnabled = (moduleCode: string, featureCode: string): boolean => {
  // Si le module n'est pas actif, la fonctionnalité n'est pas disponible
  if (!isModuleActive(moduleCode)) {
    return false;
  }

  // Vérifier le cache
  const moduleData = getModuleCache(moduleCode);
  return moduleData?.features?.[featureCode] === true;
};

/**
 * Met à jour le statut d'un module
 */
export const updateModuleStatus = async (
  moduleId: string, 
  status: ModuleStatus
): Promise<boolean> => {
  const isAdmin = isAdminModule(moduleId);
  
  // Mettre à jour en base de données
  const success = await updateModuleStatusInDb(moduleId, status, isAdmin);
  
  if (success) {
    // Mettre à jour le cache local
    updateModuleCache(moduleId, { status });
  }
  
  return success;
};

/**
 * Met à jour le statut d'une fonctionnalité de module
 */
export const updateFeatureStatus = async (
  moduleCode: string, 
  featureCode: string, 
  isEnabled: boolean
): Promise<boolean> => {
  const isAdmin = isAdminModule(moduleCode);
  
  // Mettre à jour en base de données
  const success = await updateFeatureStatusInDb(moduleCode, featureCode, isEnabled, isAdmin);
  
  if (success) {
    // Mettre à jour le cache local
    const moduleData = getModuleCache(moduleCode) || {};
    const features = { ...(moduleData.features || {}), [featureCode]: isEnabled };
    updateModuleCache(moduleCode, { features });
  }
  
  return success;
};

export {
  // Ré-exporter les fonctions asynchrones
  checkModuleActiveAsync,
  checkModuleDegradedAsync,
  checkFeatureEnabledAsync
};
