
import { ModuleStatus } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { isAdminModule } from './moduleStatusCore';

/**
 * Update a module's status in the database
 */
export const updateModuleStatusInDb = async (
  moduleId: string, 
  status: ModuleStatus
): Promise<boolean> => {
  // Prevent disabling the Admin module
  if (isAdminModule(moduleId) && status !== 'active') {
    console.error("The Admin module cannot be disabled");
    return false;
  }

  try {
    const { error } = await supabase
      .from('app_modules')
      .update({ 
        status: status,
        updated_at: new Date().toISOString() 
      })
      .eq('id', moduleId);

    if (error) {
      console.error('Error updating module status:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Exception when updating module status:', e);
    return false;
  }
};

/**
 * Update a feature's status in the database
 */
export const updateFeatureStatusInDb = async (
  moduleCode: string, 
  featureCode: string, 
  isEnabled: boolean
): Promise<boolean> => {
  // Prevent disabling Admin module features
  if (isAdminModule(moduleCode) && !isEnabled) {
    console.error("Admin module features cannot be disabled");
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
      console.error('Error updating feature status:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Exception when updating feature status:', e);
    return false;
  }
};

/**
 * Silent update of a feature's status without notifications
 */
export const updateFeatureStatusSilent = async (
  moduleCode: string, 
  featureCode: string, 
  isEnabled: boolean
): Promise<boolean> => {
  return await updateFeatureStatusInDb(moduleCode, featureCode, isEnabled);
};
