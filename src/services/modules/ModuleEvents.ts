
/**
 * Événements liés aux modules
 */
export const MODULE_EVENTS = {
  // Événements de chargement initial
  MODULES_INITIALIZATION_STARTED: 'modules:initialization_started',
  MODULES_INITIALIZATION_COMPLETED: 'modules:initialization_completed',
  MODULES_INITIALIZED: 'modules:initialized',
  
  // Événements de chargement de données
  MODULES_LOADED: 'modules:loaded',
  MODULE_LOADED: 'module:loaded',
  MODULES_REFRESHED: 'modules:refreshed',
  MODULES_UPDATED: 'modules:updated',
  DEPENDENCIES_UPDATED: 'dependencies:updated',
  
  // Événements de changement d'état
  MODULE_STATUS_CHANGED: 'module:status_changed',
  MODULE_FEATURE_CHANGED: 'module:feature_changed',
  MODULE_ACTIVATED: 'module:activated',
  MODULE_DEACTIVATED: 'module:deactivated',
  MODULE_DEGRADED: 'module:degraded',
  
  // Événements liés aux fonctionnalités
  FEATURE_STATUS_CHANGED: 'feature:status_changed',
  FEATURE_ENABLED: 'feature:enabled',
  FEATURE_DISABLED: 'feature:disabled',
  
  // Événements d'utilisation
  MODULE_USAGE_RECORDED: 'module:usage_recorded',
  
  // Événements d'erreur
  MODULE_ERROR: 'module:error',
  MODULE_WARNING: 'module:warning',
  
  // Événements d'accès
  MODULE_ACCESS_GRANTED: 'module:access_granted',
  MODULE_ACCESS_DENIED: 'module:access_denied',
  
  // Événements d'administration
  ADMIN_ACCESS_GRANTED: 'admin:access_granted',
  ADMIN_ACCESS_REVOKED: 'admin:access_revoked',
};
