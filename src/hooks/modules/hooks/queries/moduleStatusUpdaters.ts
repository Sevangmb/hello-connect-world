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
