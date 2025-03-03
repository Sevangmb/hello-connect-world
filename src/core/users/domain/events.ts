
/**
 * Événements du domaine des utilisateurs
 */

export const USER_EVENTS = {
  PROFILE_UPDATED: 'users:profile_updated',
  PROFILE_FETCHED: 'users:profile_fetched',
  ADMIN_STATUS_CHANGED: 'users:admin_status_changed',
};

// Types pour les événements
export interface UserProfileUpdatedEvent {
  userId: string;
  changes: Record<string, any>;
  timestamp: number;
}

export interface AdminStatusChangedEvent {
  userId: string;
  isAdmin: boolean;
  timestamp: number;
}
