
// Re-exporting from the correct module status files
import { 
  checkModuleActiveAsync,
  checkModuleDegradedAsync,
  checkFeatureEnabledAsync,
  getModuleStatus,
} from './moduleStatusAsync';

import {
  updateModuleStatus,
  updateFeatureStatus
} from './moduleStatusUpdates';

export {
  checkModuleActiveAsync,
  checkModuleDegradedAsync,
  checkFeatureEnabledAsync,
  getModuleStatus,
  updateModuleStatus,
  updateFeatureStatus
};
