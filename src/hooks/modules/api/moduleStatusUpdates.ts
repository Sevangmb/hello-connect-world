
import { ModuleStatus } from '../types';
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';

export const updateModuleStatus = async (moduleId: string, status: ModuleStatus): Promise<boolean> => {
  try {
    if (status === 'active') {
      return await moduleApiGateway.activateModule(moduleId);
    } else if (status === 'inactive') {
      return await moduleApiGateway.deactivateModule(moduleId);
    }
    return false;
  } catch (error) {
    console.error(`Error updating status for module ${moduleId}:`, error);
    return false;
  }
};

export const updateFeatureStatus = async (
  moduleCode: string,
  featureCode: string,
  isEnabled: boolean
): Promise<boolean> => {
  try {
    return await moduleApiGateway.updateFeatureStatus(moduleCode, featureCode, isEnabled);
  } catch (error) {
    console.error(`Error updating feature ${featureCode} for module ${moduleCode}:`, error);
    return false;
  }
};
