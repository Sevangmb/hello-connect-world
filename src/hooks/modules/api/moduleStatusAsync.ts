
import { ModuleStatus } from '../types';
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';

export const fetchModuleStatus = async (moduleCode: string): Promise<ModuleStatus | null> => {
  try {
    return await moduleApiGateway.getModuleStatus(moduleCode);
  } catch (error) {
    console.error(`Error fetching status for module ${moduleCode}:`, error);
    return null;
  }
};

export const fetchModuleActiveState = async (moduleCode: string): Promise<boolean> => {
  try {
    return await moduleApiGateway.isModuleActive(moduleCode);
  } catch (error) {
    console.error(`Error fetching active state for module ${moduleCode}:`, error);
    return false;
  }
};
