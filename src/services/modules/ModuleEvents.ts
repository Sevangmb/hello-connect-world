
/**
 * Constantes pour les événements liés aux modules
 * Centralise tous les types d'événements pour éviter les erreurs de frappe
 */

export const MODULE_EVENTS = {
  // Événements de chargement
  MODULES_INITIALIZED: 'modules:initialized',
  MODULES_REFRESHED: 'modules:refreshed',
  
  // Événements de changement de statut
  MODULE_STATUS_CHANGED: 'modules:status_changed',
  MODULE_ACTIVATED: 'modules:activated',
  MODULE_DEACTIVATED: 'modules:deactivated',
  MODULE_DEGRADED: 'modules:degraded',
  
  // Événements de fonctionnalités
  FEATURE_STATUS_CHANGED: 'modules:feature_status_changed',
  FEATURE_ENABLED: 'modules:feature_enabled',
  FEATURE_DISABLED: 'modules:feature_disabled',
  
  // Événements de dépendances
  DEPENDENCIES_REFRESHED: 'modules:dependencies_refreshed',
  DEPENDENCY_VIOLATED: 'modules:dependency_violated',
  
  // Événements d'erreur
  MODULE_ERROR: 'modules:error',
  MODULE_WARNING: 'modules:warning',
  
  // Événements de cache
  CACHE_UPDATED: 'modules:cache_updated',
  CACHE_INVALIDATED: 'modules:cache_invalidated',
  
  // Événements de performance
  MODULE_PERFORMANCE: 'modules:performance'
};

// Types d'événements pour le typage TypeScript
export interface ModuleEventPayloads {
  // Événements de chargement
  [MODULE_EVENTS.MODULES_INITIALIZED]: {
    count: number;
    timestamp: number;
    source: 'api' | 'cache';
  };
  [MODULE_EVENTS.MODULES_REFRESHED]: {
    count: number;
    timestamp: number;
    source: 'api' | 'cache' | 'realtime';
  };
  
  // Événements de changement de statut
  [MODULE_EVENTS.MODULE_STATUS_CHANGED]: {
    moduleCode: string;
    moduleId: string;
    oldStatus: string;
    newStatus: string;
    timestamp: number;
  };
  [MODULE_EVENTS.MODULE_ACTIVATED]: {
    moduleCode: string;
    moduleId: string;
    timestamp: number;
  };
  [MODULE_EVENTS.MODULE_DEACTIVATED]: {
    moduleCode: string;
    moduleId: string;
    reason?: string;
    timestamp: number;
  };
  [MODULE_EVENTS.MODULE_DEGRADED]: {
    moduleCode: string;
    moduleId: string;
    reason?: string;
    timestamp: number;
  };
  
  // Événements de fonctionnalités
  [MODULE_EVENTS.FEATURE_STATUS_CHANGED]: {
    moduleCode: string;
    featureCode: string;
    oldStatus: boolean;
    newStatus: boolean;
    timestamp: number;
  };
  [MODULE_EVENTS.FEATURE_ENABLED]: {
    moduleCode: string;
    featureCode: string;
    timestamp: number;
  };
  [MODULE_EVENTS.FEATURE_DISABLED]: {
    moduleCode: string;
    featureCode: string;
    timestamp: number;
  };
  
  // Événements de dépendances
  [MODULE_EVENTS.DEPENDENCIES_REFRESHED]: {
    count: number;
    timestamp: number;
  };
  [MODULE_EVENTS.DEPENDENCY_VIOLATED]: {
    moduleCode: string;
    dependencyCode: string;
    isRequired: boolean;
    timestamp: number;
  };
  
  // Événements d'erreur
  [MODULE_EVENTS.MODULE_ERROR]: {
    error: string;
    context: string;
    moduleCode?: string;
    timestamp: number;
  };
  [MODULE_EVENTS.MODULE_WARNING]: {
    warning: string;
    context: string;
    moduleCode?: string;
    timestamp: number;
  };
  
  // Événements de cache
  [MODULE_EVENTS.CACHE_UPDATED]: {
    type: 'modules' | 'features' | 'dependencies';
    count: number;
    timestamp: number;
  };
  [MODULE_EVENTS.CACHE_INVALIDATED]: {
    type: 'modules' | 'features' | 'dependencies';
    reason: string;
    timestamp: number;
  };
  
  // Événements de performance
  [MODULE_EVENTS.MODULE_PERFORMANCE]: {
    operation: string;
    duration: number;
    moduleCode?: string;
    timestamp: number;
  };
}
