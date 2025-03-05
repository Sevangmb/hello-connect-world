
/**
 * Événements liés aux modules
 */

export const MODULE_EVENTS = {
  // Événements d'initialisation
  MODULES_INITIALIZATION_STARTED: 'modules:initialization:started',
  MODULES_INITIALIZATION_COMPLETED: 'modules:initialization:completed',
  
  // Événements de chargement
  MODULES_LOADED: 'modules:loaded',
  MODULES_REFRESHED: 'modules:refreshed',
  MODULES_INITIALIZED: 'modules:initialized',
  
  // Événements de statut
  MODULE_STATUS_CHANGED: 'module:status:changed',
  MODULE_ACTIVATED: 'module:activated',
  MODULE_DEACTIVATED: 'module:deactivated',
  MODULE_DEGRADED: 'module:degraded',
  
  // Événements de fonctionnalités
  FEATURE_STATUS_CHANGED: 'feature:status:changed',
  FEATURE_ENABLED: 'feature:enabled',
  FEATURE_DISABLED: 'feature:disabled',
  
  // Événements de synchronisation
  MODULE_SYNC_STARTED: 'module:sync:started',
  MODULE_SYNC_COMPLETED: 'module:sync:completed',
  MODULE_SYNC_FAILED: 'module:sync:failed',
  
  // Événements d'erreur
  MODULE_ERROR: 'module:error',
  
  // Événements d'accès administrateur
  ADMIN_ACCESS_GRANTED: 'admin:access:granted',
  ADMIN_ACCESS_REVOKED: 'admin:access:revoked',
};
