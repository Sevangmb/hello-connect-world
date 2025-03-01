
/**
 * Fonctions pour mettre à jour le statut des modules et fonctionnalités
 */

import { supabase } from "@/integrations/supabase/client";
import { AppModule, ModuleStatus } from "../types";
import { isAdminModule } from "../utils/statusValidation";
import { invalidateAllCache } from "../cache/moduleCache";
import { ADMIN_MODULE_CODE } from "../constants";

/**
 * Met à jour le statut d'un module en tenant compte des restrictions pour Admin
 */
export const updateModuleStatus = async (
  moduleId: string, 
  status: ModuleStatus,
  modules: AppModule[]
): Promise<boolean> => {
  const moduleToUpdate = modules.find(m => m.id === moduleId);
  
  // Empêcher la désactivation du module Admin
  if (moduleToUpdate && (moduleToUpdate.code === ADMIN_MODULE_CODE || moduleToUpdate.code.startsWith('admin')) && status !== 'active') {
    console.error("Le module Admin ne peut pas être désactivé");
    return false;
  }
  
  try {
    const { error } = await supabase
      .from('app_modules')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', moduleId);
    
    if (error) {
      console.error("Erreur lors de la mise à jour du statut du module:", error);
      return false;
    }
    
    // Invalider les caches
    invalidateAllCache();
    
    return true;
  } catch (e) {
    console.error("Exception lors de la mise à jour du statut du module:", e);
    return false;
  }
};

/**
 * Met à jour le statut d'une fonctionnalité en tenant compte des restrictions pour Admin
 */
export const updateFeatureStatus = async (
  moduleCode: string, 
  featureCode: string, 
  isEnabled: boolean
): Promise<boolean> => {
  // Empêcher la désactivation des fonctionnalités du module Admin
  if ((moduleCode === ADMIN_MODULE_CODE || moduleCode.startsWith('admin')) && !isEnabled) {
    console.error("Les fonctionnalités du module Admin ne peuvent pas être désactivées");
    return false;
  }
  
  try {
    const { error } = await supabase
      .from('module_features')
      .update({ 
        is_enabled: isEnabled, 
        updated_at: new Date().toISOString() 
      })
      .eq('module_code', moduleCode)
      .eq('feature_code', featureCode);
    
    if (error) {
      console.error("Erreur lors de la mise à jour du statut de la fonctionnalité:", error);
      return false;
    }
    
    return true;
  } catch (e) {
    console.error("Exception lors de la mise à jour du statut de la fonctionnalité:", e);
    return false;
  }
};

/**
 * Wrapper pour la mise à jour silencieuse d'une fonctionnalité
 */
export const updateFeatureStatusSilent = async (
  moduleCode: string, 
  featureCode: string, 
  isEnabled: boolean
): Promise<boolean> => {
  return updateFeatureStatus(moduleCode, featureCode, isEnabled);
};
