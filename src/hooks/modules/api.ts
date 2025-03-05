
// Re-export all module status functions
export {
  isActiveStatus,
  isDegradedStatus,
  isInactiveStatus,
  isMaintenanceStatus,
  getEffectiveStatus,
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
  fetchModuleStatus,
  fetchModuleActiveState,
  checkModuleActiveAsync,
  checkModuleDegradedAsync,
  checkFeatureEnabledAsync
} from './api/moduleStatusAsync';

export {
  updateModuleStatus,
  updateFeatureStatus,
  updateModuleStatusInDb,
  updateFeatureStatusInDb,
  updateFeatureStatusSilent
} from './api/moduleStatusUpdates';
