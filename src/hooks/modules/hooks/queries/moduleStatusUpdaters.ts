
import { AppModule, ModuleStatus } from '../../types';
import { 
  updateModuleStatusInDb, 
  updateFeatureStatusInDb,
  getModuleCache,
  updateModuleCache,
  isAdminModule
} from '../../api/moduleStatus';
import { broadcastModuleStatusChange } from '../../tabSync';
import { triggerModuleStatusChanged } from '../../events';
import { ADMIN_MODULE_CODE } from '../../constants';
import { cacheFeaturesData } from '../../api/moduleCache';

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
  const isAdminModuleCheck = internalModules.some(
    m => m.id === moduleId && (m.code === ADMIN_MODULE_CODE || m.code.startsWith('admin'))
  );
  
  const success = await updateModuleStatusInDb(moduleId, status, isAdminModuleCheck);
  
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
  const isAdminModuleCheck = moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin');
  
  const success = await updateFeatureStatusInDb(moduleCode, featureCode, isEnabled, isAdminModuleCheck);
  
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
