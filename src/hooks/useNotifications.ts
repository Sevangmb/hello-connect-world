
import { useCallback } from "react";
import { useNotificationsFetcher } from "./notifications/useNotificationsFetcher";
import { useNotificationMutations } from "./notifications/useNotificationMutations";
import { useNotificationSettings } from "./notifications/useNotificationSettings";
import { useNotificationsRealtime } from "./notifications/useNotificationsRealtime";
import { useNotificationUtils } from "./notifications/useNotificationUtils";
import { Notification } from "@/components/notifications/types";

// Hook principal de gestion des notifications
export function useNotifications() {
  const {
    userId,
    notifications: rawNotifications,
    unreadCount,
    isLoading,
    error,
    refreshNotifications: refetch
  } = useNotificationsFetcher();

  const {
    markAsRead: markAsReadMutation,
    markAllAsRead,
    deleteNotification
  } = useNotificationMutations(userId);

  const {
    disableNotificationType,
    enableNotificationType
  } = useNotificationSettings(userId);

  const {
    subscribeToNotifications
  } = useNotificationsRealtime(userId);

  const {
    unreadNotifications,
    getGroupedNotifications,
    adaptNotifications
  } = useNotificationUtils(rawNotifications);

  // Adapter les données pour l'interface utilisateur
  const notifications = adaptNotifications;

  // Wrappers pour les mutations principales
  const markAsRead = useCallback(async (notificationId: string) => {
    return await markAsReadMutation.mutateAsync(notificationId);
  }, [markAsReadMutation]);

  const refreshNotifications = useCallback(async () => {
    return await refetch();
  }, [refetch]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    disableNotificationType,
    enableNotificationType,
    unreadNotifications,
    getGroupedNotifications,
    subscribeToNotifications,
    refreshNotifications
  };
}
