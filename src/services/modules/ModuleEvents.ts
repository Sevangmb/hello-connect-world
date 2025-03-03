
/**
 * Événements émis par le service de modules
 * Ces constantes servent de contrat entre les services
 */

export const MODULE_EVENTS = {
  // Événements de changements d'état des modules
  MODULE_STATUS_CHANGED: 'module:status_changed',
  MODULE_ACTIVATED: 'module:activated',
  MODULE_DEACTIVATED: 'module:deactivated',
  MODULE_DEGRADED: 'module:degraded',
  
  // Événements liés aux fonctionnalités
  FEATURE_STATUS_CHANGED: 'module:feature_status_changed',
  FEATURE_ACTIVATED: 'module:feature_activated',
  FEATURE_DEACTIVATED: 'module:feature_deactivated',
  
  // Événements liés au cycle de vie
  MODULES_INITIALIZED: 'module:initialized',
  MODULES_REFRESHED: 'module:refreshed',
  
  // Événements de synchronisation
  MODULES_SYNC_REQUESTED: 'module:sync_requested',
  
  // Événements d'erreur
  MODULE_ERROR: 'module:error',
  MODULE_CONNECTION_ERROR: 'module:connection_error',
  MODULE_CONNECTION_RESTORED: 'module:connection_restored'
};

// Types pour les données d'événements
export interface ModuleStatusChangedEvent {
  moduleId: string;
  moduleCode: string;
  oldStatus: string;
  newStatus: string;
  timestamp: number;
}

export interface FeatureStatusChangedEvent {
  moduleCode: string;
  featureCode: string;
  isEnabled: boolean;
  timestamp: number;
}

export interface ModuleErrorEvent {
  error: string;
  context: string;
  timestamp: number;
}

export interface ModuleConnectionEvent {
  isConnected: boolean;
  lastAttempt: number;
  retryCount: number;
}

export interface ModulesRefreshedEvent {
  count: number;
  timestamp: number;
  source: 'api' | 'cache' | 'init';
}
