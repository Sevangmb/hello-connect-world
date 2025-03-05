
import { ModuleStatus } from '../../types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Met à jour le statut d'un module de manière asynchrone
 */
export const updateModuleStatusAsync = async (
  moduleId: string,
  status: ModuleStatus
): Promise<boolean> => {
  try {
    // Fix: Remove the third argument
    const { data, error } = await supabase
      .from('app_modules')
      .update({ status })
      .eq('id', moduleId);

    if (error) {
      console.error('Error updating module status:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in updateModuleStatusAsync:', err);
    return false;
  }
};

/**
 * Met à jour le statut d'une fonctionnalité de manière asynchrone
 */
export const updateFeatureStatusAsync = async (
  moduleCode: string,
  featureCode: string,
  isEnabled: boolean
): Promise<boolean> => {
  try {
    // Fix: Remove the fourth argument
    const { data, error } = await supabase
      .from('module_features')
      .update({ is_enabled: isEnabled })
      .eq('module_code', moduleCode)
      .eq('feature_code', featureCode);

    if (error) {
      console.error('Error updating feature status:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in updateFeatureStatusAsync:', err);
    return false;
  }
};

// Add the missing functions that are expected in index.ts
export const updateModuleStatusData = async (
  moduleId: string, 
  status: ModuleStatus,
  modules: any[],
  setModules: any,
  refreshModules: any
): Promise<boolean> => {
  const result = await updateModuleStatusAsync(moduleId, status);
  if (result && modules?.length > 0) {
    const updatedModules = [...modules];
    const moduleIndex = updatedModules.findIndex(m => m.id === moduleId);
    if (moduleIndex !== -1) {
      updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], status };
      setModules(updatedModules);
    }
  }
  
  // Refresh modules anyway to ensure we have the latest data
  if (refreshModules) await refreshModules(true);
  
  return result;
};

export const updateFeatureStatusData = async (
  moduleCode: string,
  featureCode: string,
  isEnabled: boolean,
  features: any,
  setFeatures: any,
  refreshFeatures: any
): Promise<boolean> => {
  const result = await updateFeatureStatusAsync(moduleCode, featureCode, isEnabled);
  
  if (result && features) {
    const updatedFeatures = { ...features };
    if (updatedFeatures[moduleCode]) {
      updatedFeatures[moduleCode] = {
        ...updatedFeatures[moduleCode],
        [featureCode]: isEnabled
      };
      setFeatures(updatedFeatures);
    }
  }
  
  // Refresh features anyway to ensure we have the latest data
  if (refreshFeatures) await refreshFeatures(true);
  
  return result;
};
