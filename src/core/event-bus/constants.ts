
/**
 * Constantes pour les événements de l'application
 * Centralise tous les types d'événements pour éviter les erreurs de frappe
 */

export const EVENTS = {
  // Événements de navigation
  NAVIGATION: {
    ROUTE_CHANGED: 'navigation:route-changed',
    PAGE_VIEW: 'navigation:page-view',
    MENU_OPEN: 'navigation:menu-open',
    MENU_CLOSE: 'navigation:menu-close',
  },
  
  // Événements d'authentification
  AUTH: {
    SIGNED_IN: 'auth:signed-in',
    SIGNED_OUT: 'auth:signed-out',
    SESSION_EXPIRED: 'auth:session-expired',
    USER_UPDATED: 'auth:user-updated',
    ADMIN_STATUS_CHANGED: 'auth:admin-status-changed',
  },
  
  // Événements de modules
  MODULE: {
    INITIALIZED: 'module:initialized',
    STATUS_CHANGED: 'module:status-changed',
    FEATURE_ENABLED: 'module:feature-enabled',
    FEATURE_DISABLED: 'module:feature-disabled',
  },
  
  // Événements utilisateur
  USER: {
    PROFILE_UPDATED: 'user:profile-updated',
    PREFERENCES_CHANGED: 'user:preferences-changed',
  },
  
  // Événements de notification
  NOTIFICATION: {
    NEW: 'notification:new',
    READ: 'notification:read',
    CLEAR_ALL: 'notification:clear-all',
  },
  
  // Événements système
  SYSTEM: {
    ERROR: 'system:error',
    WARNING: 'system:warning',
    INFO: 'system:info',
  },
  
  // Événements d'application
  APP: {
    INITIALIZED: 'app:initialized',
    ROUTES_INITIALIZED: 'app:routes-initialized',
    CONFIG_LOADED: 'app:config-loaded',
  },
};
