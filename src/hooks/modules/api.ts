
// Re-export all module API functionality from individual files
export {
  getModuleStatusFromCache,
  updateModuleCache,
  getModuleCache,
  isModuleActive,
  isModuleDegraded,
  isModuleMaintenance,
  isModuleInactive,
  isAdminModule
} from './api/moduleStatusCore';

export {
  checkModuleActiveAsync,
  checkModuleDegradedAsync,
  checkFeatureEnabledAsync
} from './api/moduleStatusAsync';

export {
  updateModuleStatusInDb,
  updateFeatureStatusInDb,
  updateFeatureStatusSilent
} from './api/moduleStatusUpdates';
