// Re-export all functionality from the smaller files
import { 
  updateModuleCache, 
  getModuleCache, 
  isAdminModule 
} from './moduleStatusCore';

import { 
  checkModuleActiveAsync, 
  checkModuleDegradedAsync, 
  checkFeatureEnabledAsync 
} from './moduleStatusAsync';

import { 
  updateModuleStatusInDb, 
  updateFeatureStatusInDb 
} from './moduleStatusUpdates';

// Export everything
export {
  // From moduleStatusCore
  updateModuleCache,
  getModuleCache,
  isAdminModule,
  
  // From moduleStatusAsync
  checkModuleActiveAsync,
  checkModuleDegradedAsync,
  checkFeatureEnabledAsync,
  
  // From moduleStatusUpdates
  updateModuleStatusInDb,
  updateFeatureStatusInDb
};

// Fix function parameters to match their implementations
export const checkModuleActive = (moduleCode: string): boolean => {
  // Admin modules are always active
  if (moduleCode === 'admin' || moduleCode.startsWith('admin_')) {
    return true;
  }

  const { inMemoryModulesCache } = getModuleCache();
  
  if (inMemoryModulesCache) {
    const module = inMemoryModulesCache.find(m => m.code === moduleCode);
    return module?.status === 'active';
  }
  
  return false;
};

export const checkModuleDegraded = (moduleCode: string): boolean => {
  const { inMemoryModulesCache } = getModuleCache();
  
  if (inMemoryModulesCache) {
    const module = inMemoryModulesCache.find(m => m.code === moduleCode);
    return module?.status === 'degraded';
  }
  
  return false;
};

export const checkFeatureEnabled = (moduleCode: string, featureCode: string): boolean => {
  // First, check if the module is active
  if (!checkModuleActive(moduleCode)) {
    return false;
  }
  
  // Further feature checking logic would go here
  // For now, just assume all features of active modules are enabled
  return true;
};
