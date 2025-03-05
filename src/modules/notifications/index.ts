
/**
 * Module de notifications - Point d'entrée unique
 * Exporte tous les composants, hooks et utilitaires liés aux notifications
 */

// Composants
export { NotificationIcon } from '@/components/notifications/NotificationIcon';
export { NotificationItem } from '@/components/notifications/NotificationItem';
export { NotificationPreferences } from '@/components/notifications/NotificationPreferences';
export { NotificationsList } from '@/components/notifications/NotificationsList';

// Hooks
export { useNotifications } from '@/hooks/useNotifications';
export { useNotificationCenter } from '@/hooks/notifications/useNotificationCenter';
export { useNotificationMutations } from '@/hooks/notifications/useNotificationMutations';
export { useNotificationSettings } from '@/hooks/notifications/useNotificationSettings';
export { useNotificationUtils } from '@/hooks/notifications/useNotificationUtils';
export { useNotificationsFetcher } from '@/hooks/notifications/useNotificationsFetcher';
export { useNotificationsRealtime } from '@/hooks/notifications/useNotificationsRealtime';

// Types
export * from '@/components/notifications/types';
export * from '@/hooks/notifications/types';
