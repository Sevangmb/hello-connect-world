
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';
import { ModuleStatus } from '../types';

/**
 * Get module status asynchronously from the API
 */
export const getModuleStatusAsync = async (moduleCode: string): Promise<ModuleStatus> => {
  try {
    return await moduleApiGateway.getModuleStatus(moduleCode);
  } catch (error) {
    console.error(`Error in getModuleStatusAsync for ${moduleCode}:`, error);
    return 'inactive';
  }
};

/**
 * Check if a module is active asynchronously
 */
export const checkModuleActiveAsync = async (moduleCode: string): Promise<boolean> => {
  try {
    const status = await getModuleStatusAsync(moduleCode);
    return status === 'active';
  } catch (error) {
    console.error(`Error in checkModuleActiveAsync for ${moduleCode}:`, error);
    return false;
  }
};

/**
 * Check if a module is in degraded mode asynchronously
 */
export const checkModuleDegradedAsync = async (moduleCode: string): Promise<boolean> => {
  try {
    const status = await getModuleStatusAsync(moduleCode);
    return status === 'degraded';
  } catch (error) {
    console.error(`Error in checkModuleDegradedAsync for ${moduleCode}:`, error);
    return false;
  }
};

/**
 * Check if a feature is enabled asynchronously
 */
export const checkFeatureEnabledAsync = async (moduleCode: string, featureCode: string): Promise<boolean> => {
  try {
    // Implement feature check logic
    return true; // Placeholder - implement actual feature check
  } catch (error) {
    console.error(`Error in checkFeatureEnabledAsync for ${moduleCode}/${featureCode}:`, error);
    return false;
  }
};

/**
 * Fetch the active state of a module
 */
export const fetchModuleActiveState = async (moduleCode: string): Promise<boolean> => {
  return checkModuleActiveAsync(moduleCode);
};

// Add an alias for getModuleStatusAsync for backwards compatibility
export const getModuleStatus = getModuleStatusAsync;
