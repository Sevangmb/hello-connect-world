
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Notification } from "@/components/notifications/types";

export const useNotifications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      console.log("Fetching notifications...");
      const { data, error } = await supabase
        .from("notifications")
        .select(`
          *,
          actor:profiles!notifications_actor_id_fkey(username, avatar_url),
          post:posts(content)
        `)
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
  const subscribeToNotifications = () => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          console.log('Realtime notification update:', payload);
          queryClient.invalidateQueries({ queryKey: ["notifications"] });

          // Show toast for new notifications
          if (payload.eventType === 'INSERT') {
            toast({
              title: "Nouvelle notification",
              description: "Vous avez reçu une nouvelle notification",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

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

  return {
    notifications,
    isLoading,
    markAsRead,
    subscribeToNotifications
  };
};
