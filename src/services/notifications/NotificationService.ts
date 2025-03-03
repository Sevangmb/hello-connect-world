
import { supabase } from "@/integrations/supabase/client";
import { NotificationType } from "@/components/notifications/types";

export class NotificationService {
  /**
   * Récupère les notifications d'un utilisateur
   */
  static async getUserNotifications(userId: string) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select(`
          id,
          type,
          actor_id,
          user_id,
          post_id,
          read,
          created_at,
          actor:profiles!actor_id(username, avatar_url),
          post:posts(content)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  /**
   * Marque une notification comme lue
   */
  static async markAsRead(notificationId: string, userId: string) {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId)
        .eq("user_id", userId);

      if (error) throw error;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  /**
   * Marque toutes les notifications d'un utilisateur comme lues
   */
  static async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false);

      if (error) throw error;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  /**
   * Supprime une notification
   */
  static async deleteNotification(notificationId: string, userId: string) {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId)
        .eq("user_id", userId);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }

  /**
   * Met à jour les préférences de notification d'un utilisateur
   */
  static async updateNotificationPreferences(
    userId: string, 
    notificationType: NotificationType, 
    enabled: boolean
  ) {
    try {
      // Récupérer les préférences actuelles
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("preferences")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      // Mettre à jour les préférences
      let preferences = userProfile?.preferences || {};
      
      // Ensure preferences is an object
      if (typeof preferences !== 'object' || preferences === null) {
        preferences = {};
      }
      
      // Initialize notifications object if needed
      if (!preferences.hasOwnProperty('notifications')) {
        preferences = {
          ...preferences,
          notifications: {}
        };
      }
      
      // Update the specific notification type preference
      const updatedPreferences = {
        ...preferences,
        notifications: {
          ...(preferences.notifications as Record<string, boolean>),
          [notificationType]: enabled
        }
      };

      // Enregistrer les préférences mises à jour
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ preferences: updatedPreferences })
        .eq("id", userId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      throw error;
    }
  }

  /**
   * Abonnement aux notifications en temps réel
   */
  static subscribeToNotifications(userId: string, callback: (notification: any) => void) {
    return supabase
      .channel(`user-notifications-${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, payload => {
        callback(payload.new);
      })
      .subscribe();
  }
}
