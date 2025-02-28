
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Bell, BellOff, Loader2, Check, AlertCircle } from "lucide-react";

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  is_read: boolean;
  created_at: string;
}

// Hook principal de gestion des notifications
export function useNotifications() {
  const { toast } = useToast();
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

      return data as Notification[];
    },
    enabled: !!userId,
    refetchInterval: 60000, // Rafraîchir toutes les minutes
  });

  // Mutation pour marquer une notification comme lue
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!userId) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId)
        .eq("user_id", userId)
        .select();

      if (error) {
        console.error("Error marking notification as read:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("Error in markAsRead:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de marquer la notification comme lue"
      });
    }
  });

  // Mutation pour marquer toutes les notifications comme lues
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User not authenticated");

      // Toast de chargement
      const { dismiss } = toast({
        title: "En cours",
        description: "Marquage de toutes les notifications comme lues...",
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        duration: 5000,
      });

      const { data, error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false)
        .select();

      if (error) {
        dismiss();
        throw error;
      }

      dismiss();
      toast({
        title: "Terminé",
        description: "Toutes les notifications ont été marquées comme lues",
        icon: <Check className="h-4 w-4 text-green-500" />,
        duration: 3000,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setUnreadCount(0);
    },
    onError: (error) => {
      console.error("Error in markAllAsRead:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de marquer toutes les notifications comme lues",
        icon: <AlertCircle className="h-4 w-4" />
      });
    }
  });

  // Mutation pour supprimer une notification
  const deleteNotification = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!userId) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId)
        .eq("user_id", userId)
        .select();

      if (error) {
        console.error("Error deleting notification:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast({
        title: "Notification supprimée",
        description: "La notification a été supprimée avec succès",
        icon: <Check className="h-4 w-4 text-green-500" />,
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("Error in deleteNotification:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la notification",
        icon: <AlertCircle className="h-4 w-4" />
      });
    }
  });

  // Mutation pour désactiver les notifications d'un type spécifique
  const disableNotificationType = useMutation({
    mutationFn: async (type: string) => {
      if (!userId) throw new Error("User not authenticated");

      // Toast de chargement
      const { dismiss } = toast({
        title: "En cours",
        description: `Désactivation des notifications de type "${type}"...`,
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        duration: 5000,
      });

      const { data: settings, error: settingsError } = await supabase
        .from("user_notification_settings")
        .select("*")
        .eq("user_id", userId)
        .eq("notification_type", type)
        .maybeSingle();

      if (settingsError) {
        dismiss();
        throw settingsError;
      }

      let result;
      if (settings) {
        // Mettre à jour le paramètre existant
        const { data, error } = await supabase
          .from("user_notification_settings")
          .update({ enabled: false })
          .eq("id", settings.id)
          .select();

        if (error) {
          dismiss();
          throw error;
        }
        result = data;
      } else {
        // Créer un nouveau paramètre
        const { data, error } = await supabase
          .from("user_notification_settings")
          .insert({
            user_id: userId,
            notification_type: type,
            enabled: false
          })
          .select();

        if (error) {
          dismiss();
          throw error;
        }
        result = data;
      }

      dismiss();
      toast({
        title: "Notifications désactivées",
        description: `Les notifications de type "${type}" ont été désactivées`,
        icon: <BellOff className="h-4 w-4" />,
        duration: 3000,
      });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
    },
    onError: (error) => {
      console.error("Error disabling notification type:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de désactiver ce type de notifications",
        icon: <AlertCircle className="h-4 w-4" />
      });
    }
  });

  // Mutation pour activer les notifications d'un type spécifique
  const enableNotificationType = useMutation({
    mutationFn: async (type: string) => {
      if (!userId) throw new Error("User not authenticated");

      // Toast de chargement
      const { dismiss } = toast({
        title: "En cours",
        description: `Activation des notifications de type "${type}"...`,
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        duration: 5000,
      });

      const { data: settings, error: settingsError } = await supabase
        .from("user_notification_settings")
        .select("*")
        .eq("user_id", userId)
        .eq("notification_type", type)
        .maybeSingle();

      if (settingsError) {
        dismiss();
        throw settingsError;
      }

      let result;
      if (settings) {
        // Mettre à jour le paramètre existant
        const { data, error } = await supabase
          .from("user_notification_settings")
          .update({ enabled: true })
          .eq("id", settings.id)
          .select();

        if (error) {
          dismiss();
          throw error;
        }
        result = data;
      } else {
        // Créer un nouveau paramètre ou ne rien faire car par défaut c'est activé
        const { data, error } = await supabase
          .from("user_notification_settings")
          .insert({
            user_id: userId,
            notification_type: type,
            enabled: true
          })
          .select();

        if (error) {
          dismiss();
          throw error;
        }
        result = data;
      }

      dismiss();
      toast({
        title: "Notifications activées",
        description: `Les notifications de type "${type}" ont été activées`,
        icon: <Bell className="h-4 w-4" />,
        duration: 3000,
      });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
    },
    onError: (error) => {
      console.error("Error enabling notification type:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'activer ce type de notifications",
        icon: <AlertCircle className="h-4 w-4" />
      });
    }
  });

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
        const notification = payload.new as Notification;
        toast({
          title: notification.title,
          description: notification.message,
          icon: <Bell className="h-4 w-4" />,
          duration: 5000,
        });
        
        // Rafraîchir les données
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient, toast]);

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
    }, {} as Record<string, Notification[]>);
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    disableNotificationType,
    enableNotificationType,
    unreadNotifications,
    getGroupedNotifications,
    refetch
  };
}
