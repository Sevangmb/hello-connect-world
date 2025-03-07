
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';
import { ModuleStatus } from '../types';

export const updateModuleStatusAsync = async (
  moduleId: string, 
  status: ModuleStatus
): Promise<boolean> => {
  try {
    return await moduleApiGateway.updateModuleStatus(moduleId, status);
  } catch (error) {
    console.error('Error updating module status:', error);
    return false;
  }
};

export const updateFeatureStatusAsync = async (
  moduleCode: string,
  featureCode: string,
  isEnabled: boolean
): Promise<boolean> => {
  try {
    return await moduleApiGateway.updateFeatureStatus(moduleCode, featureCode, isEnabled);
  } catch (error) {
    console.error('Error updating feature status:', error);
    return false;
  }
};

export const updateFeatureStatusSilentAsync = async (
  moduleCode: string,
  featureCode: string,
  isEnabled: boolean
): Promise<boolean> => {
  try {
    return await moduleApiGateway.updateFeatureStatusSilent(moduleCode, featureCode, isEnabled);
  } catch (error) {
    console.error('Error updating feature status silently:', error);
    return false;
  }
};
