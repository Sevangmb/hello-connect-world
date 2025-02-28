
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NotificationData } from "./types";

export function useNotificationsFetcher(userId: string | null) {
  const notificationsQuery = useQuery({
    queryKey: ["notifications", userId],
    queryFn: async (): Promise<NotificationData[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("notifications")
        .select(`
          id,
          user_id,
          actor_id,
          post_id,
          read,
          created_at,
          type,
          message,
          data
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match our NotificationData interface
      return data.map((notification) => ({
        id: notification.id,
        user_id: notification.user_id,
        actor_id: notification.actor_id,
        post_id: notification.post_id,
        is_read: notification.read || false,
        created_at: notification.created_at,
        type: notification.type,
        message: notification.message || '',
        data: notification.data || {}
      })) as NotificationData[];
    },
    enabled: !!userId,
  });

  // Calculate unread count
  const unreadCount = notificationsQuery.data
    ? notificationsQuery.data.filter(notification => !notification.is_read).length
    : 0;

  return {
    notifications: notificationsQuery.data || [],
    unreadCount,
    isLoading: notificationsQuery.isLoading,
    error: notificationsQuery.error,
    refetch: notificationsQuery.refetch,
  };
}
