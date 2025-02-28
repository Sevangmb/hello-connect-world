
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Notification } from "@/components/notifications/types";

export const useNotifications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fonction pour rafraîchir les notifications
  const refreshNotifications = async () => {
    return queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  // Fetch notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      console.log("Fetching notifications...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from("notifications")
        .select(`
          *,
          actor:profiles!notifications_actor_id_fkey(username, avatar_url),
          post:posts(content)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }

      // Cast to unknown first, then to Notification[] to avoid type issues
      return (data as unknown as Notification[]) || [];
    },
  });

  // Subscribe to realtime changes
  const subscribeToNotifications = useCallback((onNewNotification?: (notification: Notification) => void) => {
    const channel = supabase
      .channel('notifications-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
        },
        (payload) => {
          console.log('Realtime notification update:', payload);
          
          // Refresh notifications
          refreshNotifications();
          
          // S'il s'agit d'une nouvelle notification et qu'un callback est fourni
          if (payload.eventType === 'INSERT' && onNewNotification) {
            // Récupérer les détails complets de la notification
            supabase
              .from("notifications")
              .select(`
                *,
                actor:profiles!notifications_actor_id_fkey(username, avatar_url),
                post:posts(content)
              `)
              .eq("id", payload.new.id)
              .single()
              .then(({ data, error }) => {
                if (!error && data) {
                  onNewNotification(data as unknown as Notification);
                }
              });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de marquer la notification comme lue",
      });
    }
  };

  // Create a notification manually (for testing or special cases)
  const createNotification = async (type: string, actorId?: string, postId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase
        .from("notifications")
        .insert({
          user_id: user.id,
          type,
          actor_id: actorId,
          post_id: postId,
        });

      if (error) throw error;

      refreshNotifications();
    } catch (error) {
      console.error("Error creating notification:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la notification",
      });
    }
  };

  return {
    notifications,
    isLoading,
    markAsRead,
    subscribeToNotifications,
    refreshNotifications,
    createNotification
  };
};
