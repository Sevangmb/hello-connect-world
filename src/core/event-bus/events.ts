
/**
 * Types et constantes pour les événements de l'Event Bus
 * Définit un contrat qui permet aux services d'interagir entre eux
 */

// Types d'événements système
export const SYSTEM_EVENTS = {
  // Événements liés au cycle de vie de l'application
  APP_INITIALIZED: 'system:app_initialized',
  APP_READY: 'system:app_ready',
  APP_ERROR: 'system:app_error',
  
  // Événements de performance
  PERFORMANCE_METRIC: 'system:performance_metric',
  
  // Événements de navigation
  ROUTE_CHANGED: 'system:route_changed',
  
  // Événements d'authentification
  AUTH_STATE_CHANGED: 'system:auth_state_changed',
  
  // Événements de connexion
  CONNECTION_STATE_CHANGED: 'system:connection_state_changed'
};

// Types d'événements d'API
export const API_EVENTS = {
  // Événements génériques d'API
  REQUEST_STARTED: 'api:request_started',
  REQUEST_SUCCEEDED: 'api:request_succeeded',
  REQUEST_FAILED: 'api:request_failed',
  
  // Événements de performance
  METRICS: 'api:metrics',
  
  // Événements d'erreur
  ERROR: 'api:error',
  
  // Événements de cache
  CACHE_HIT: 'api:cache_hit',
  CACHE_MISS: 'api:cache_miss',
  CACHE_UPDATED: 'api:cache_updated'
};

// Types pour les données d'événements système
export interface AppInitializedEvent {
  timestamp: number;
  duration: number;
  services: string[];
}

export interface AppErrorEvent {
  error: string;
  context: string;
  timestamp: number;
  isFatal: boolean;
}

export interface PerformanceMetricEvent {
  operation: string;
  duration: number;
  timestamp: number;
  context?: string;
}

export interface RouteChangedEvent {
  previousRoute: string;
  currentRoute: string;
  timestamp: number;
}

export interface ConnectionStateChangedEvent {
  isOnline: boolean;
  timestamp: number;
}

// Types pour les données d'événements d'API
export interface ApiRequestEvent {
  service: string;
  operation: string;
  timestamp: number;
  requestId: string;
  parameters?: Record<string, any>;
}

export interface ApiResponseEvent extends ApiRequestEvent {
  duration: number;
  status: number;
  success: boolean;
}

export interface ApiErrorEvent {
  service: string;
  operation: string;
  error: string;
  timestamp: number;
  requestId?: string;
  [key: string]: any;
}

export interface ApiMetricsEvent {
  service: string;
  operation: string;
  duration: number;
  timestamp: number;
  success?: boolean;
  resultCount?: number;
  cacheUsed?: boolean;
  retries?: number;
}

export interface ApiCacheEvent {
  service: string;
  operation: string;
  key: string;
  timestamp: number;
  size?: number;
}
