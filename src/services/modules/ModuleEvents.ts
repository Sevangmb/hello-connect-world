
/**
 * Événements liés aux modules
 * Utilisés pour la communication entre les composants
 */

export const MODULE_EVENTS = {
  MODULE_LOADED: 'module:loaded',
  MODULE_ERROR: 'module:error',
  MODULE_STATUS_CHANGED: 'module:status-changed',
  FEATURE_STATUS_CHANGED: 'module:feature-status-changed',
  DEPENDENCIES_LOADED: 'module:dependencies-loaded',
  MODULE_USAGE_RECORDED: 'module:usage-recorded',
  // Ajout des constantes manquantes
  MODULE_WARNING: 'module:warning',
  MODULES_REFRESHED: 'modules:refreshed',
  MODULES_INITIALIZED: 'modules:initialized',
  MODULE_ACTIVATED: 'module:activated',
  MODULE_DEACTIVATED: 'module:deactivated',
  MODULE_DEGRADED: 'module:degraded',
  FEATURE_ACTIVATED: 'module:feature-activated',
  FEATURE_DEACTIVATED: 'module:feature-deactivated',
  MODULE_CONNECTION_RESTORED: 'module:connection-restored',
  MODULE_CONNECTION_ERROR: 'module:connection-error',
  CIRCUIT_OPENED: 'circuit:opened',
  CIRCUIT_CLOSED: 'circuit:closed',
  CIRCUIT_HALF_OPEN: 'circuit:half-open'
};
