
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NotificationCallbacks, NotificationData } from "./types";
import { useQueryClient } from "@tanstack/react-query";

export function useNotificationsRealtime(
  userId: string | null,
  callbacks?: NotificationCallbacks
) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    console.log("Setting up realtime subscription for notifications");

    // Subscribe to new notifications
    const channel = supabase
      .channel("db-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Notification received:", payload);
          const notification = payload.new as NotificationData;
          
          // Show toast notification if it's newer than 10 seconds
          const notifTime = new Date(notification.created_at).getTime();
          const now = new Date().getTime();
          if (now - notifTime < 10000) {
            // Only show toast for recent notifications (within last 10 seconds)
            toast({
              title: notification.title,
              description: notification.message,
              duration: 5000,
            });
          }
          
          // Invalidate the notifications query to refresh the list
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          
          // Call the callback if provided
          if (callbacks?.onNewNotification) {
            callbacks.onNewNotification(notification);
          }
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
        if (status === "SUBSCRIBED") {
          setConnected(true);
        } else if (status === "CHANNEL_ERROR") {
          setError(new Error("Failed to connect to notifications channel"));
          setConnected(false);
        }
      });

    return () => {
      console.log("Cleaning up notification subscription");
      supabase.removeChannel(channel);
    };
  }, [userId, toast, queryClient, callbacks]);

  return { connected, error };
}
