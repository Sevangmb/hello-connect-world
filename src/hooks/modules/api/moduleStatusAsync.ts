
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';
import { ModuleStatus } from '@/hooks/modules/types';

export const getModuleStatus = async (moduleCode: string): Promise<ModuleStatus | null> => {
  return moduleApiGateway.getModuleStatus(moduleCode);
};

export const checkModuleActive = async (moduleCode: string): Promise<boolean> => {
  return moduleApiGateway.isModuleActive(moduleCode);
};

export const checkModuleDegraded = async (moduleCode: string): Promise<boolean> => {
  return moduleApiGateway.isModuleDegraded(moduleCode);
};

export const checkFeatureEnabled = async (
  moduleCode: string,
  featureCode: string
): Promise<boolean> => {
  return moduleApiGateway.isFeatureEnabled(moduleCode, featureCode);
};
