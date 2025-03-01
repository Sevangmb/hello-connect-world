
import { useAuth } from "@/hooks/useAuth";
import { useNotificationsFetcher } from "@/hooks/notifications/useNotificationsFetcher";
import { useNotificationMutations } from "@/hooks/notifications/useNotificationMutations";
import { useNotificationSettings } from "@/hooks/notifications/useNotificationSettings";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NotificationData, NotificationCallbacks } from "@/hooks/notifications/types";

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

  // Fonction pour rafraîchir manuellement les notifications
  const refreshNotifications = useCallback(() => {
    console.log("Rafraîchissement des notifications...");
    return refetch();
  }, [refetch]);

  // Fonction pour s'abonner aux notifications
  const subscribeToNotifications = useCallback((callback?: (notification: NotificationData) => void) => {
    if (!user?.id) {
      setConnected(false);
      return () => {}; // Cleanup function
    }

    console.log('Subscribing to notifications for user:', user.id);
    
    try {
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
            
            // Call the callback function if provided
            if (callback && typeof callback === 'function') {
              // Convert payload to NotificationData
              const newNotification = {
                ...payload.new,
                is_read: payload.new.read || false,
                read: payload.new.read || false
              } as NotificationData;
              
              callback(newNotification);
            }
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
  
      // Return cleanup function
      return () => {
        console.log('Cleaning up notifications subscription');
        supabase.removeChannel(notificationsChannel);
        setConnected(false);
      };
    } catch (e) {
      console.error("Erreur lors de l'abonnement aux notifications:", e);
      setError(e as Error);
      setConnected(false);
      return () => {};
    }
  }, [user?.id, refetch, toast]);

  // Set up realtime subscription for notifications automatically
  useEffect(() => {
    const unsubscribe = subscribeToNotifications();
    return unsubscribe;
  }, [subscribeToNotifications]);

  // Ajout d'un effet pour rafraîchir les notifications au démarrage
  useEffect(() => {
    if (user?.id) {
      refreshNotifications();
    }
  }, [user?.id, refreshNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error: error || fetchError,
    markAsRead: (id: string) => markAsRead.mutate(id),
    markAllAsRead: () => markAllAsRead.mutate(),
    deleteNotification: (id: string) => deleteNotification.mutate(id),
    disableNotificationType,
    enableNotificationType,
    refetch,
    refreshNotifications,
    subscribeToNotifications,
    realtimeStatus: {
      connected,
      error,
      subscribeToNotifications
    }
  };
};
