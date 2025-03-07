
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';
import { ModuleStatus } from '../types';

export const getModuleStatusAsync = async (moduleCode: string): Promise<ModuleStatus | null> => {
  try {
    return await moduleApiGateway.getModuleStatus(moduleCode);
  } catch (error) {
    console.error('Error fetching module status:', error);
    return null;
  }
};

export const checkModuleActiveAsync = async (moduleCode: string): Promise<boolean> => {
  const status = await getModuleStatusAsync(moduleCode);
  return status === 'active';
};

export const checkModuleDegradedAsync = async (moduleCode: string): Promise<boolean> => {
  const status = await getModuleStatusAsync(moduleCode);
  return status === 'degraded';
};

export const checkFeatureEnabledAsync = async (moduleCode: string, featureCode: string): Promise<boolean> => {
  try {
    return await moduleApiGateway.isFeatureEnabled(moduleCode, featureCode);
  } catch (error) {
    console.error('Error checking feature status:', error);
    return false;
  }
};

export const fetchModuleActiveState = async (moduleCode: string): Promise<boolean> => {
  return await checkModuleActiveAsync(moduleCode);
};
