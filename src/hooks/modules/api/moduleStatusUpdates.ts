
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';
import { ModuleStatus } from '../types';

/**
 * Update module status asynchronously via the API
 */
export const updateModuleStatusAsync = async (moduleId: string, status: ModuleStatus): Promise<boolean> => {
  try {
    const result = await moduleApiGateway.updateModuleStatus(moduleId, status);
    return result !== null;
  } catch (error) {
    console.error(`Error in updateModuleStatusAsync for ${moduleId}:`, error);
    return false;
  }
};

/**
 * Update feature status asynchronously via the API
 */
export const updateFeatureStatusAsync = async (featureId: string, isEnabled: boolean): Promise<boolean> => {
  try {
    const result = await moduleApiGateway.updateFeatureStatus(featureId, isEnabled);
    return result !== null;
  } catch (error) {
    console.error(`Error in updateFeatureStatusAsync for ${featureId}:`, error);
    return false;
  }
};

/**
 * Update feature status silently (without notifications)
 */
export const updateFeatureStatusSilentAsync = async (featureId: string, isEnabled: boolean): Promise<boolean> => {
  try {
    return await moduleApiGateway.updateFeatureStatusSilent(featureId, isEnabled);
  } catch (error) {
    console.error(`Error in updateFeatureStatusSilentAsync for ${featureId}:`, error);
    return false;
  }
};

// Add aliases for backwards compatibility
export const updateModuleStatus = updateModuleStatusAsync;
export const updateFeatureStatus = updateFeatureStatusAsync;
export const updateFeatureStatusSilent = updateFeatureStatusSilentAsync;
