
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
import { supabase } from '@/integrations/supabase/client';

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
  
  // Essayer d'abord avec la fonction existante
  let success = false;
  try {
    success = await updateModuleStatusInDb(moduleId, status, isAdminModuleCheck);
  } catch (error) {
    console.error("Erreur avec updateModuleStatusInDb, tentative directe avec Supabase:", error);
    
    // Si échec, essayer directement avec Supabase
    try {
      const { error: dbError } = await supabase
        .from('app_modules')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', moduleId);
        
      if (!dbError) {
        success = true;
      } else {
        console.error("Erreur Supabase lors de la mise à jour du statut du module:", dbError);
      }
    } catch (e) {
      console.error("Exception lors de la mise à jour directe du statut du module:", e);
    }
  }
  
  if (success) {
    try {
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
      try {
        await refreshModules();
      } catch (error) {
        console.error("Erreur lors du rafraîchissement des modules après mise à jour:", error);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du cache après mise à jour réussie:", error);
    }
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
  
  // Essayer d'abord avec la fonction existante
  let success = false;
  try {
    success = await updateFeatureStatusInDb(moduleCode, featureCode, isEnabled, isAdminModuleCheck);
  } catch (error) {
    console.error("Erreur avec updateFeatureStatusInDb, tentative directe avec Supabase:", error);
    
    // Si échec, essayer directement avec Supabase
    try {
      const { error: dbError } = await supabase
        .from('module_features')
        .update({ 
          is_enabled: isEnabled, 
          updated_at: new Date().toISOString() 
        })
        .eq('module_code', moduleCode)
        .eq('feature_code', featureCode);
        
      if (!dbError) {
        success = true;
      } else {
        console.error("Erreur Supabase lors de la mise à jour du statut de la fonctionnalité:", dbError);
      }
    } catch (e) {
      console.error("Exception lors de la mise à jour directe du statut de la fonctionnalité:", e);
    }
  }
  
  if (success) {
    try {
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
      try {
        await refreshFeatures();
      } catch (error) {
        console.error("Erreur lors du rafraîchissement des fonctionnalités après mise à jour:", error);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du cache après mise à jour réussie de la fonctionnalité:", error);
    }
  }
  
  return success;
};
