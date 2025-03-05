
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
  
  // Événements de changement d'état
  MODULE_STATUS_CHANGED: 'module:status_changed',
  MODULE_FEATURE_CHANGED: 'module:feature_changed',
  
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
