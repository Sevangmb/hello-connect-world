
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Notification, ToastStatus } from "@/components/notifications/types";
import { Check, Loader2, AlertCircle } from "lucide-react";

export const useNotifications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [processingIds, setProcessingIds] = useState<Record<string, ToastStatus>>({});

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
                  const notification = data as unknown as Notification;
                  onNewNotification(notification);
                  
                  // Afficher une toast pour la nouvelle notification
                  showNotificationToast(notification);
                }
              });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  // Montrer une toast pour une nouvelle notification
  const showNotificationToast = (notification: Notification) => {
    const { message, icon } = getNotificationContent(notification);
    
    toast({
      title: "Nouvelle notification",
      description: message,
      variant: "default",
    });
  };

  // Récupérer le contenu adapté pour notification
  const getNotificationContent = (notification: Notification) => {
    const { message, icon } = require("@/components/notifications/NotificationIcon")
      .NotificationIcon.getNotificationContent(notification);
    
    return { message, icon };
  };

  // Mark notification as read with loading state
  const markAsRead = async (notificationId: string) => {
    try {
      // Set loading state
      setProcessingIds(prev => ({ ...prev, [notificationId]: 'loading' }));
      
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;

      // Set success state
      setProcessingIds(prev => ({ ...prev, [notificationId]: 'success' }));
      
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      
      // Show toast with success icon
      toast({
        title: "Notification marquée comme lue",
        description: "Notification mise à jour avec succès",
        variant: "default",
      });

      // Clear status after delay
      setTimeout(() => {
        setProcessingIds(prev => {
          const newState = { ...prev };
          delete newState[notificationId];
          return newState;
        });
      }, 2000);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Set error state
      setProcessingIds(prev => ({ ...prev, [notificationId]: 'error' }));
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de marquer la notification comme lue",
      });
      
      // Clear error status after delay
      setTimeout(() => {
        setProcessingIds(prev => {
          const newState = { ...prev };
          delete newState[notificationId];
          return newState;
        });
      }, 3000);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      toast({
        title: "Mise à jour en cours",
        description: "Marquage de toutes les notifications comme lues...",
        variant: "default",
      });

      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      
      toast({
        title: "Succès",
        description: "Toutes les notifications ont été marquées comme lues",
        variant: "default",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de marquer toutes les notifications comme lues",
      });
    }
  };

  // Create a notification manually (for testing or special cases)
  const createNotification = async (
    type: string, 
    actorId?: string, 
    postId?: string, 
    message?: string,
    data?: Record<string, any>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      // Montrer une toast de chargement
      toast({
        title: "Création en cours",
        description: "Création d'une nouvelle notification...",
        variant: "default",
      });

      const { data: notificationData, error } = await supabase
        .from("notifications")
        .insert({
          user_id: user.id,
          type,
          actor_id: actorId,
          post_id: postId,
          message,
          data
        })
        .select()
        .single();

      if (error) throw error;

      // Rafraîchir la liste des notifications
      refreshNotifications();
      
      // Montrer une toast de succès
      toast({
        title: "Notification créée",
        description: "La notification a été créée avec succès",
        variant: "default",
      });
      
      return notificationData;
    } catch (error) {
      console.error("Error creating notification:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la notification",
      });
      return null;
    }
  };

  // Effets pour le nettoyage
  useEffect(() => {
    const unsubscribe = subscribeToNotifications();
    return () => {
      unsubscribe();
    };
  }, [subscribeToNotifications]);

  // Get notification status
  const getNotificationStatus = (notificationId: string): ToastStatus => {
    return processingIds[notificationId] || 'idle';
  };

  // Statut icon based on status
  const getStatusIcon = (status: ToastStatus) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <Check className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Check className="h-4 w-4" />;
    }
  };

  return {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    subscribeToNotifications,
    refreshNotifications,
    createNotification,
    getNotificationStatus,
    getStatusIcon,
    processingIds
  };
};
