
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { NotificationService } from "@/services/notifications/NotificationService";
import { Notification, NotificationType } from "@/components/notifications/types";
import { Bell } from "lucide-react";

export const useNotificationCenter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [realtimeConnected, setRealtimeConnected] = useState(false);

  // Fonction pour récupérer les notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await NotificationService.getUserNotifications(user.id);
      setNotifications(data as Notification[]);
      setUnreadCount(data.filter((notification: Notification) => !notification.read).length);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Fonction pour marquer une notification comme lue
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user?.id) return;
    
    try {
      await NotificationService.markAsRead(notificationId, user.id);
      
      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      // Mettre à jour le compteur de notifications non lues
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
      toast({
        title: "Erreur",
        description: "Impossible de marquer la notification comme lue",
        variant: "destructive"
      });
    }
  }, [user?.id, toast]);

  // Fonction pour marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      await NotificationService.markAllAsRead(user.id);
      
      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      // Réinitialiser le compteur de notifications non lues
      setUnreadCount(0);
      
      toast({
        title: "Succès",
        description: "Toutes les notifications ont été marquées comme lues",
      });
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      toast({
        title: "Erreur",
        description: "Impossible de marquer toutes les notifications comme lues",
        variant: "destructive"
      });
    }
  }, [user?.id, toast]);

  // Fonction pour supprimer une notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!user?.id) return;
    
    try {
      await NotificationService.deleteNotification(notificationId, user.id);
      
      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
      
      // Mettre à jour le compteur si la notification n'était pas lue
      const wasUnread = notifications.find(n => n.id === notificationId && !n.read);
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast({
        title: "Succès",
        description: "La notification a été supprimée",
      });
    } catch (err) {
      console.error("Error deleting notification:", err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la notification",
        variant: "destructive"
      });
    }
  }, [user?.id, notifications, toast]);

  // Fonction pour mettre à jour les préférences de notification
  const updateNotificationPreference = useCallback(async (
    notificationType: NotificationType, 
    enabled: boolean
  ) => {
    if (!user?.id) return;
    
    try {
      await NotificationService.updateNotificationPreferences(
        user.id, 
        notificationType, 
        enabled
      );
      
      toast({
        title: enabled ? "Notifications activées" : "Notifications désactivées",
        description: `Les notifications de type "${notificationType}" ont été ${enabled ? 'activées' : 'désactivées'}`,
      });
    } catch (err) {
      console.error("Error updating notification preference:", err);
      toast({
        title: "Erreur",
        description: `Impossible de ${enabled ? 'activer' : 'désactiver'} ce type de notifications`,
        variant: "destructive"
      });
    }
  }, [user?.id, toast]);

  // Abonnement aux notifications en temps réel
  useEffect(() => {
    if (!user?.id) {
      setRealtimeConnected(false);
      return;
    }

    const subscription = NotificationService.subscribeToNotifications(
      user.id,
      (newNotification) => {
        // Ajouter la nouvelle notification à l'état
        setNotifications(prev => [newNotification, ...prev]);
        
        // Incrémenter le compteur de notifications non lues
        setUnreadCount(prev => prev + 1);
        
        // Afficher une notification toast
        toast({
          title: "Nouvelle notification",
          description: "Vous avez reçu une nouvelle notification",
          icon: { type: "icon", icon: Bell, className: "h-4 w-4" }
        });
      }
    );

    setRealtimeConnected(true);

    // Nettoyage lors du démontage du composant
    return () => {
      subscription.unsubscribe();
      setRealtimeConnected(false);
    };
  }, [user?.id, toast]);

  // Charger les notifications au montage du composant
  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    realtimeConnected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateNotificationPreference,
    refreshNotifications: fetchNotifications
  };
};
