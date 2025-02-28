
/**
 * Custom events for module status changes
 */

// Define event names
const MODULE_STATUS_CHANGED = 'module_status_changed';
const FEATURE_STATUS_CHANGED = 'feature_status_changed';

/**
 * Trigger a custom event when a module status changes
 */
export const triggerModuleStatusChanged = (detail: any = {}) => {
  const event = new CustomEvent(MODULE_STATUS_CHANGED, { 
    detail,
    bubbles: true 
  });
  window.dispatchEvent(event);
  console.log('Module status changed event triggered', detail);
};

/**
 * Trigger a custom event when a feature status changes
 */
export const triggerFeatureStatusChanged = (detail: any = {}) => {
  const event = new CustomEvent(FEATURE_STATUS_CHANGED, { 
    detail,
    bubbles: true 
  });
  window.dispatchEvent(event);
  console.log('Feature status changed event triggered', detail);
};

/**
 * Add an event listener for module status changes
 */
export const onModuleStatusChanged = (callback: (event: CustomEvent) => void) => {
  window.addEventListener(MODULE_STATUS_CHANGED, callback as EventListener);
  return () => window.removeEventListener(MODULE_STATUS_CHANGED, callback as EventListener);
};

/**
 * Add an event listener for feature status changes
 */
export const onFeatureStatusChanged = (callback: (event: CustomEvent) => void) => {
  window.addEventListener(FEATURE_STATUS_CHANGED, callback as EventListener);
  return () => window.removeEventListener(FEATURE_STATUS_CHANGED, callback as EventListener);
};

/**
 * Listen to module changes for alerts
 */
export const listenToModuleChanges = (callback: () => void) => {
  const handleModuleStatusChanged = () => {
    callback();
  };
  
  window.addEventListener(MODULE_STATUS_CHANGED, handleModuleStatusChanged);
  
  return () => {
    window.removeEventListener(MODULE_STATUS_CHANGED, handleModuleStatusChanged);
  };
};

/**
 * Create event listeners for feature status changes
 */
export const createFeatureEventsListener = (callback: (event: CustomEvent) => void) => {
  window.addEventListener(FEATURE_STATUS_CHANGED, callback as EventListener);
  return () => window.removeEventListener(FEATURE_STATUS_CHANGED, callback as EventListener);
};

/**
 * Create event listeners for module status changes
 */
export const createModuleEventsListener = (callback: (event: CustomEvent) => void) => {
  window.addEventListener(MODULE_STATUS_CHANGED, callback as EventListener);
  return () => window.removeEventListener(MODULE_STATUS_CHANGED, callback as EventListener);
};
