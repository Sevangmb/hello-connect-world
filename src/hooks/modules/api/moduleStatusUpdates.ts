
import { ModuleStatus } from '@/hooks/modules/types';
import { ModuleApiGateway } from '@/services/api-gateway/ModuleApiGateway';

const moduleApi = new ModuleApiGateway();

export async function updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean> {
  return await moduleApi.updateModuleStatus(moduleId, status);
}

export async function updateFeatureStatus(
  moduleCode: string,
  featureCode: string,
  isEnabled: boolean
): Promise<boolean> {
  return await moduleApi.updateFeatureStatus(moduleCode, featureCode, isEnabled);
}
