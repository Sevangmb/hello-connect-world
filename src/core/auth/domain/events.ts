
/**
 * Événements du domaine d'authentification
 */

export const AUTH_EVENTS = {
  SIGNED_IN: 'auth:signed_in',
  SIGNED_UP: 'auth:signed_up',
  SIGNED_OUT: 'auth:signed_out',
  SESSION_EXPIRED: 'auth:session_expired',
  USER_UPDATED: 'auth:user_updated',
  PASSWORD_RECOVERY: 'auth:password_recovery',
  PASSWORD_RESET: 'auth:password_reset',
};

// Types d'événements
export interface AuthEventSignedIn {
  user: any;
}

export interface AuthEventSignedUp {
  user: any;
}

export interface AuthEventUserUpdated {
  user: any;
}

export interface AuthEventPasswordRecovery {
  email: string;
}

export interface AuthEventPasswordReset {
  success: boolean;
}
