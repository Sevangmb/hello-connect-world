
import { ModuleStatus } from '@/hooks/modules/types';
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';

/**
 * Function to get a module's status (async)
 */
export async function getModuleStatus(moduleCode: string): Promise<ModuleStatus | null> {
  try {
    return await moduleApiGateway.getModuleStatus(moduleCode);
  } catch (error) {
    console.error(`Error fetching module status for ${moduleCode}:`, error);
    return null;
  }
}

/**
 * Function to check if a module is active (async)
 */
export async function checkModuleActiveAsync(moduleCode: string): Promise<boolean> {
  const status = await getModuleStatus(moduleCode);
  return status === 'active';
}

/**
 * Function to check if a module is degraded (async)
 */
export async function checkModuleDegradedAsync(moduleCode: string): Promise<boolean> {
  const status = await getModuleStatus(moduleCode);
  return status === 'degraded';
}

/**
 * Function to check if a feature is enabled (async)
 */
export async function checkFeatureEnabledAsync(moduleCode: string, featureCode: string): Promise<boolean> {
  try {
    return await moduleApiGateway.isFeatureEnabled(moduleCode, featureCode);
  } catch (error) {
    console.error(`Error checking if feature ${featureCode} is enabled:`, error);
    return false;
  }
}

/**
 * Function to get active state of module (async)
 */
export async function fetchModuleActiveState(moduleCode: string): Promise<boolean> {
  return checkModuleActiveAsync(moduleCode);
}
