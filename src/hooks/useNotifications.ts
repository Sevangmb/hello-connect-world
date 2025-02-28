
import { useAuth } from "@/hooks/useAuth";
import { useNotificationsFetcher } from "@/hooks/notifications/useNotificationsFetcher";
import { useNotificationMutations } from "@/hooks/notifications/useNotificationMutations";
import { useNotificationSettings } from "@/hooks/notifications/useNotificationSettings";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const {
    notifications,
    unreadCount,
    isLoading,
    error: fetchError,
    refetch
  } = useNotificationsFetcher(user?.id || null);
  
  const {
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotificationMutations(user?.id || null);
  
  const {
    disableNotificationType,
    enableNotificationType
  } = useNotificationSettings(user?.id || null);

  // Set up realtime subscription for notifications
  useEffect(() => {
    if (!user?.id) {
      setConnected(false);
      return;
    }

    // Create channel for notifications
    const notificationsChannel = supabase
      .channel('notifications-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, payload => {
        console.log('New notification received:', payload);
        // Refresh notifications
        refetch();
        // Show toast for new notification
        if (payload.new) {
          toast({
            title: 'Nouvelle notification',
            description: 'Vous avez reçu une nouvelle notification'
          });
        }
      })
      .subscribe((status) => {
        console.log('Notifications subscription status:', status);
        if (status === 'SUBSCRIBED') {
          setConnected(true);
        } else {
          setConnected(false);
        }
      });

    // Clean up subscription
    return () => {
      console.log('Cleaning up notifications subscription');
      supabase.removeChannel(notificationsChannel);
      setConnected(false);
    };
  }, [user?.id, refetch, toast]);

  // Function to manually trigger a subscription
  const subscribeToNotifications = () => {
    console.log('Manually subscribing to notifications');
    // This is a stub - the real implementation is in the useEffect above
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    error: error || fetchError,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    disableNotificationType,
    enableNotificationType,
    refetch,
    realtimeStatus: {
      connected,
      error,
      subscribeToNotifications
    }
  };
};
