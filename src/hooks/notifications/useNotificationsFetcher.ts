
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NotificationData } from "./types";

export function useNotificationsFetcher() {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Récupérer l'utilisateur actuellement connecté
  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };
    getUserId();
  }, []);

  // Requête pour récupérer les notifications
  const {
    data: notifications,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }

      // Calculer le nombre de notifications non lues
      const unread = data.filter(notif => !notif.is_read).length;
      setUnreadCount(unread);

      return data as NotificationData[];
    },
    enabled: !!userId,
    refetchInterval: 60000, // Rafraîchir toutes les minutes
  });

  // Fonction de rafraîchissement explicite
  const refreshNotifications = async () => {
    return await refetch();
  };

  return {
    userId,
    notifications,
    unreadCount,
    isLoading,
    error,
    refreshNotifications,
  };
}
