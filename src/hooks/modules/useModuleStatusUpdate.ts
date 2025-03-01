
/**
 * Hook pour la gestion des mises à jour de statut des modules
 */

import { supabase } from "@/integrations/supabase/client";
import { ModuleStatus, AppModule } from "./types";
import { broadcastModuleStatusChange, broadcastFeatureStatusChange } from "./tabSync";
import { cacheModuleStatuses } from "./utils";
import { ADMIN_MODULE_CODE } from "./constants";

export const useModuleStatusUpdate = () => {
  /**
   * Mettre à jour l'état d'un module (pour les admins)
   */
  const updateModuleStatus = async (
    moduleId: string, 
    status: ModuleStatus, 
    modules: AppModule[], 
    updateModule: Function, 
    setModules: Function
  ) => {
    try {
      // Vérifier si le module est le module Admin
      const moduleToUpdate = modules.find(m => m.id === moduleId);
      if (moduleToUpdate && moduleToUpdate.code === ADMIN_MODULE_CODE && status !== 'active') {
        console.error("Le module Admin ne peut pas être désactivé");
        return false;
      }
      
      // Mettre à jour dans la base de données directement
      const { error } = await supabase
        .from('app_modules')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', moduleId);
      
      if (error) throw error;
      
      // Mettre à jour l'état local
      await updateModule(moduleId, status, modules, setModules);
      
      // Mettre à jour le cache local
      if (modules.length > 0) {
        cacheModuleStatuses(modules);
      }
      
      // Broadcast the change to other tabs
      broadcastModuleStatusChange(moduleId, status);
      
      return true;
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut du module:", err);
      return false;
    }
  };

  /**
   * Mettre à jour l'état d'une fonctionnalité silencieuse
   */
  const updateFeatureStatusSilent = async (
    moduleCode: string, 
    featureCode: string, 
    isEnabled: boolean,
    updateFeatureSilent: Function
  ) => {
    // Vérifier si c'est une fonctionnalité du module Admin
    if (moduleCode === ADMIN_MODULE_CODE && !isEnabled) {
      console.error("Les fonctionnalités du module Admin ne peuvent pas être désactivées");
      return false;
    }
    
    await updateFeatureSilent(moduleCode, featureCode, isEnabled);
    
    // Broadcast the change to other tabs
    broadcastFeatureStatusChange(moduleCode, featureCode, isEnabled);
    
    return true;
  };
  
  /**
   * Mettre à jour l'état d'une fonctionnalité avec notification
   */
  const updateFeatureStatus = async (
    moduleCode: string, 
    featureCode: string, 
    isEnabled: boolean,
    updateFeature: Function,
    setModules: Function,
    features: Record<string, Record<string, boolean>>
  ) => {
    // Vérifier si c'est une fonctionnalité du module Admin
    if (moduleCode === ADMIN_MODULE_CODE && !isEnabled) {
      console.error("Les fonctionnalités du module Admin ne peuvent pas être désactivées");
      return false;
    }
    
    await updateFeature(moduleCode, featureCode, isEnabled, setModules, features);
    
    // Broadcast the change to other tabs
    broadcastFeatureStatusChange(moduleCode, featureCode, isEnabled);
    
    return true;
  };

  return {
    updateModuleStatus,
    updateFeatureStatus,
    updateFeatureStatusSilent
  };
};
