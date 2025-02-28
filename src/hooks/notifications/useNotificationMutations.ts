
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, AlertCircle, Bell, BellOff } from "lucide-react";

export function useNotificationMutations(userId: string | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
        icon: { type: "icon", icon: Loader2, className: "h-4 w-4 animate-spin" },
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
        icon: { type: "icon", icon: Check, className: "h-4 w-4 text-green-500" },
        duration: 3000,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("Error in markAllAsRead:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de marquer toutes les notifications comme lues",
        icon: { type: "icon", icon: AlertCircle, className: "h-4 w-4" }
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
        icon: { type: "icon", icon: Check, className: "h-4 w-4 text-green-500" },
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("Error in deleteNotification:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la notification",
        icon: { type: "icon", icon: AlertCircle, className: "h-4 w-4" }
      });
    }
  });

  return {
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
}
