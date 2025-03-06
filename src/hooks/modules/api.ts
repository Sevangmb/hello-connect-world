
import { ModuleStatus } from './types';

// Import from moduleStatus
import {
  isActiveStatus,
  isDegradedStatus,
  isInactiveStatus,
  isMaintenanceStatus,
  getEffectiveStatus,
  getModuleStatusFromCache,
  isModuleActive,
  isModuleDegraded,
  isModuleInactive,
  isModuleMaintenance
} from './api/moduleStatusCore';

// Import from moduleStatusAsync
import {
  getModuleStatus,
  checkModuleActiveAsync,
  checkModuleDegradedAsync,
  checkFeatureEnabledAsync,
  fetchModuleActiveState
} from './api/moduleStatusAsync';

// Import from moduleStatusUpdates
import {
  updateModuleStatus,
  updateFeatureStatus,
  updateFeatureStatusSilent
} from './api/moduleStatusUpdates';

// Export all the functions
export {
  // From moduleStatus
  isActiveStatus,
  isDegradedStatus,
  isInactiveStatus,
  isMaintenanceStatus,
  getEffectiveStatus,
  getModuleStatusFromCache,
  isModuleActive,
  isModuleDegraded,
  isModuleInactive,
  isModuleMaintenance,
  
  // From moduleStatusAsync
  getModuleStatus,
  checkModuleActiveAsync,
  checkModuleDegradedAsync,
  checkFeatureEnabledAsync,
  fetchModuleActiveState,
  
  // From moduleStatusUpdates
  updateModuleStatus,
  updateFeatureStatus,
  updateFeatureStatusSilent
};
