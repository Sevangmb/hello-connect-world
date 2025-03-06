
import { ModuleStatus } from '@/hooks/modules/types';
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';

/**
 * Update module status in the database
 */
export async function updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean> {
  try {
    return await moduleApiGateway.updateModuleStatus(moduleId, status);
  } catch (error) {
    console.error(`Error updating module status for ${moduleId}:`, error);
    return false;
  }
}

/**
 * Update feature status in the database
 */
export async function updateFeatureStatus(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
  try {
    return await moduleApiGateway.updateFeatureStatus(moduleCode, featureCode, isEnabled);
  } catch (error) {
    console.error(`Error updating feature status for ${moduleCode}/${featureCode}:`, error);
    return false;
  }
}

/**
 * Update feature status silently without notifications
 */
export async function updateFeatureStatusSilent(moduleCode: string, featureCode: string, isEnabled: boolean): Promise<boolean> {
  try {
    return await moduleApiGateway.updateFeatureStatus(moduleCode, featureCode, isEnabled);
  } catch (error) {
    console.error(`Error silently updating feature status for ${moduleCode}/${featureCode}:`, error);
    return false;
  }
}
