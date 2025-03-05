
/**
 * Événements liés aux modules
 */

export const MODULE_EVENTS = {
  // Événements d'initialisation
  MODULES_INITIALIZATION_STARTED: 'modules:initialization:started',
  MODULES_INITIALIZATION_COMPLETED: 'modules:initialization:completed',
  
  // Événements de chargement
  MODULES_LOADED: 'modules:loaded',
  MODULE_LOADED: 'module:loaded',
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
  FEATURE_ACTIVATED: 'feature:activated',
  FEATURE_DEACTIVATED: 'feature:deactivated',
  
  // Événements de synchronisation
  MODULE_SYNC_STARTED: 'module:sync:started',
  MODULE_SYNC_COMPLETED: 'module:sync:completed',
  MODULE_SYNC_FAILED: 'module:sync:failed',
  
  // Événements de connexion
  MODULE_CONNECTION_RESTORED: 'module:connection:restored',
  MODULE_CONNECTION_ERROR: 'module:connection:error',
  
  // Événements d'erreur
  MODULE_ERROR: 'module:error',
  MODULE_WARNING: 'module:warning',
  
  // Événements Circuit Breaker
  CIRCUIT_OPENED: 'circuit:opened',
  CIRCUIT_CLOSED: 'circuit:closed',
  CIRCUIT_HALF_OPEN: 'circuit:half:open',
  
  // Événements d'utilisation
  MODULE_USAGE_RECORDED: 'module:usage:recorded',
  
  // Événements d'accès administrateur
  ADMIN_ACCESS_GRANTED: 'admin:access:granted',
  ADMIN_ACCESS_REVOKED: 'admin:access:revoked',
};
