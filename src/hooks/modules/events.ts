
// Custom events for module status changes
export const MODULE_STATUS_CHANGED = 'module_status_changed';
export const FEATURE_STATUS_CHANGED = 'feature_status_changed';

// Trigger events to notify components that module statuses have changed
export const triggerModuleStatusChanged = () => {
  window.dispatchEvent(new CustomEvent(MODULE_STATUS_CHANGED));
};

export const triggerFeatureStatusChanged = () => {
  window.dispatchEvent(new CustomEvent(FEATURE_STATUS_CHANGED));
};

// Listener setup helper
export const listenToModuleChanges = (callback: () => void) => {
  window.addEventListener(MODULE_STATUS_CHANGED, callback);
  
  // Return cleanup function
  return () => {
    window.removeEventListener(MODULE_STATUS_CHANGED, callback);
  };
};

export const listenToFeatureChanges = (callback: () => void) => {
  window.addEventListener(FEATURE_STATUS_CHANGED, callback);
  
  // Return cleanup function
  return () => {
    window.removeEventListener(FEATURE_STATUS_CHANGED, callback);
  };
};
