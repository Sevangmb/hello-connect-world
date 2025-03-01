
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
