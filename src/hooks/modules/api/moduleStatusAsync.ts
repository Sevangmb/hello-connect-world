
import { ModuleStatus } from '@/hooks/modules/types';
import { ModuleApiGateway } from '@/services/api-gateway/ModuleApiGateway';

const moduleApi = new ModuleApiGateway();

export async function isModuleActive(moduleCode: string): Promise<boolean> {
  return await moduleApi.isModuleActive(moduleCode);
}

export async function getModuleStatus(moduleCode: string): Promise<ModuleStatus | null> {
  const module = await moduleApi.getModuleByCode(moduleCode);
  return module?.status || null;
}

export async function updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<boolean> {
  return await moduleApi.updateModuleStatus(moduleId, status);
}
