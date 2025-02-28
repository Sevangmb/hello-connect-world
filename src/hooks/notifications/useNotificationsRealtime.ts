
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";
import { NotificationData, NotificationCallbacks } from "./types";

export function useNotificationsRealtime(
  userId: string | null, 
  callbacks?: NotificationCallbacks
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Abonnement aux nouvelles notifications en temps réel
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        console.log('Nouvelle notification:', payload);
        
        // Afficher un toast pour la nouvelle notification
        const notification = payload.new as NotificationData;
        toast({
          title: notification.title,
          description: notification.message,
          icon: <Bell className="h-4 w-4" />,
          duration: 5000,
        });
        
        // Rafraîchir les données
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        
        // Appeler le callback si fourni
        if (callbacks?.onNewNotification) {
          callbacks.onNewNotification(notification);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient, toast, callbacks]);

  // Fonction pour s'abonner aux notifications avec un callback personnalisé
  const subscribeToNotifications = (callback: (notification: any) => void) => {
    return () => {
      // Cette fonction sera appelée lors du nettoyage
      // La logique d'abonnement est gérée par le useEffect
      console.log("Nettoyage de l'abonnement aux notifications");
    };
  };

  return {
    subscribeToNotifications
  };
}
