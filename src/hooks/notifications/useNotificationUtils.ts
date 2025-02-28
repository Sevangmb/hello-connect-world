
import { useCallback, useMemo } from "react";
import { NotificationData } from "./types";
import { Notification as UINotification } from "@/components/notifications/types";

export function useNotificationUtils(notifications: NotificationData[] | undefined) {
  // Calcul des notifications non lues
  const unreadNotifications = useMemo(() => {
    return notifications?.filter(notif => !notif.is_read) || [];
  }, [notifications]);

  // Fonction utilitaire pour grouper les notifications par date
  const getGroupedNotifications = useCallback(() => {
    if (!notifications) return {};

    return notifications.reduce((groups, notification) => {
      const date = new Date(notification.created_at).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    }, {} as Record<string, NotificationData[]>);
  }, [notifications]);

  // Fonction pour adapter le format des notifications pour l'UI
  const adaptNotifications = useMemo(() => {
    if (!notifications) return [];
    
    return notifications.map((notification): UINotification => ({
      id: notification.id,
      type: notification.type,
      actor_id: notification.data?.actor_id || null,
      post_id: notification.data?.post_id || null,
      read: notification.is_read,
      created_at: notification.created_at,
      actor: notification.data?.actor || null,
      post: notification.data?.post || undefined,
      message: notification.message,
      data: notification.data || {}
    }));
  }, [notifications]);

  return {
    unreadNotifications,
    getGroupedNotifications,
    adaptNotifications
  };
}
