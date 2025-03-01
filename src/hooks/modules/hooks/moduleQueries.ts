
import { useState, useCallback } from 'react';
import { AppModule, ModuleStatus } from '../types';
import { 
  fetchAllModules, 
  fetchAllFeatures 
} from '../api/moduleSync';
import { 
  checkModuleActiveAsync, 
  checkModuleDegradedAsync, 
  checkFeatureEnabledAsync, 
  updateModuleStatusInDb, 
  updateFeatureStatusInDb,
  updateModuleCache,
  getModuleCache,
  isAdminModule
} from '../api/moduleStatus';
import { broadcastModuleStatusChange } from '../tabSync';
import { triggerModuleStatusChanged } from '../events';
import { ADMIN_MODULE_CODE } from '../useModules';
import { cacheFeaturesData } from '../api/moduleCache';

/**
 * Fonctions pour interroger et mettre à jour les modules et fonctionnalités
 */

/**
 * Vérifie si un module est actif de manière asynchrone
 */
export const isModuleActiveAsync = async (moduleCode: string): Promise<boolean> => {
  return checkModuleActiveAsync(moduleCode);
};

/**
 * Vérifie si un module est en mode dégradé de manière asynchrone
 */
export const isModuleDegradedAsync = async (moduleCode: string): Promise<boolean> => {
  return checkModuleDegradedAsync(moduleCode);
};

/**
 * Vérifie si une fonctionnalité est activée de manière asynchrone
 */
export const isFeatureEnabledAsync = async (
  moduleCode: string, 
  featureCode: string, 
  isModuleActive: (moduleCode: string) => Promise<boolean>
): Promise<boolean> => {
  return checkFeatureEnabledAsync(moduleCode, featureCode, isModuleActive);
};

/**
 * Rafraîchit tous les modules depuis Supabase
 */
export const refreshModulesData = async (
  setInternalModules: React.Dispatch<React.SetStateAction<AppModule[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  internalModules: AppModule[]
): Promise<AppModule[]> => {
  const { inMemoryModulesCache, lastFetchTimestamp } = getModuleCache();
  const now = Date.now();
  const force = true; // Forcer la mise à jour pour s'assurer d'avoir les dernières données

  // Utiliser le cache si récent et pas de forçage
  if (inMemoryModulesCache && inMemoryModulesCache.length > 0 && !force && (now - lastFetchTimestamp < 30000)) {
    console.log(`Using in-memory cache with ${inMemoryModulesCache.length} modules (cache age: ${now - lastFetchTimestamp}ms)`);
    setInternalModules(inMemoryModulesCache);
    return inMemoryModulesCache;
  }

  setLoading(true);
  try {
    console.log("Fetching modules from Supabase...");
    const modulesData = await fetchAllModules(force);
    console.log(`Fetched ${modulesData.length} modules from Supabase`);
    
    // Vérifier que les modules contiennent bien des valeurs ModuleStatus valides
    const validatedModules = modulesData.map(module => {
      if (module.status !== 'active' && module.status !== 'inactive' && module.status !== 'degraded') {
        console.warn(`Invalid module status "${module.status}" for module ${module.code}, defaulting to "inactive"`);
        return { ...module, status: 'inactive' as ModuleStatus };
      }
      return module;
    });
    
    // Mettre à jour les états
    setInternalModules(validatedModules);
    updateModuleCache(validatedModules);
    setLoading(false);
    
    return validatedModules;
  } catch (e: any) {
    console.error('Erreur lors du chargement des modules:', e);
    setError(e.message || 'Erreur lors du chargement des modules');
    setLoading(false);
    
    // Retourner le cache en cas d'erreur
    return inMemoryModulesCache || internalModules || [];
  }
};

/**
 * Rafraîchit toutes les fonctionnalités depuis Supabase
 */
export const refreshFeaturesData = async (
  setFeatures: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  features: Record<string, Record<string, boolean>>
): Promise<Record<string, Record<string, boolean>>> => {
  setLoading(true);
  try {
    const featuresData = await fetchAllFeatures();
    setFeatures(featuresData);
    setLoading(false);
    return featuresData;
  } catch (e: any) {
    setError(e.message || 'Erreur lors du chargement des fonctionnalités');
    setLoading(false);
    return features;
  }
};

/**
 * Met à jour le statut d'un module
 */
export const updateModuleStatusData = async (
  moduleId: string, 
  status: ModuleStatus,
  internalModules: AppModule[],
  setInternalModules: React.Dispatch<React.SetStateAction<AppModule[]>>,
  refreshModules: () => Promise<AppModule[]>
): Promise<boolean> => {
  // Vérifier si c'est le module Admin
  const isAdminModule = internalModules.some(
    m => m.id === moduleId && (m.code === ADMIN_MODULE_CODE || m.code.startsWith('admin'))
  );
  
  const success = await updateModuleStatusInDb(moduleId, status, isAdminModule);
  
  if (success) {
    // Mettre à jour le cache en mémoire
    setInternalModules(prev => 
      prev.map(module => module.id === moduleId ? { ...module, status } : module)
    );
    
    // Mettre à jour également le cache mémoire global
    const { inMemoryModulesCache } = getModuleCache();
    if (inMemoryModulesCache) {
      const updatedCache = inMemoryModulesCache.map(module => 
        module.id === moduleId ? { ...module, status } : module
      );
      updateModuleCache(updatedCache);
    }
    
    // Diffuser le changement
    broadcastModuleStatusChange(moduleId, status);
    triggerModuleStatusChanged();
    
    // Rafraîchir les données
    await refreshModules();
  }
  
  return success;
};

/**
 * Met à jour le statut d'une fonctionnalité
 */
export const updateFeatureStatusData = async (
  moduleCode: string, 
  featureCode: string, 
  isEnabled: boolean,
  features: Record<string, Record<string, boolean>>,
  setFeatures: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>,
  refreshFeatures: () => Promise<Record<string, Record<string, boolean>>>
): Promise<boolean> => {
  const isAdminModule = moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin');
  
  const success = await updateFeatureStatusInDb(moduleCode, featureCode, isEnabled, isAdminModule);
  
  if (success) {
    // Mettre à jour le cache local
    setFeatures(prev => {
      const updated = { ...prev };
      if (!updated[moduleCode]) {
        updated[moduleCode] = {};
      }
      updated[moduleCode][featureCode] = isEnabled;
      return updated;
    });
    
    // Mettre à jour le cache localStorage
    cacheFeaturesData({
      ...features,
      [moduleCode]: {
        ...(features[moduleCode] || {}),
        [featureCode]: isEnabled
      }
    });
    
    // Rafraîchir les données
    await refreshFeatures();
  }
  
  return success;
};
