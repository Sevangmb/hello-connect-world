
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Bell, BellOff, AlertCircle } from "lucide-react";

export function useNotificationSettings(userId: string | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation pour désactiver les notifications d'un type spécifique
  const disableNotificationType = useMutation({
    mutationFn: async (type: string) => {
      if (!userId) throw new Error("User not authenticated");

      // Toast de chargement
      const { dismiss } = toast({
        title: "En cours",
        description: `Désactivation des notifications de type "${type}"...`,
        icon: { type: "icon", icon: Loader2, className: "h-4 w-4 animate-spin" },
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
        icon: { type: "icon", icon: BellOff, className: "h-4 w-4" },
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
        icon: { type: "icon", icon: AlertCircle, className: "h-4 w-4" }
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
        icon: { type: "icon", icon: Loader2, className: "h-4 w-4 animate-spin" },
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
        icon: { type: "icon", icon: Bell, className: "h-4 w-4" },
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
        icon: { type: "icon", icon: AlertCircle, className: "h-4 w-4" }
      });
    }
  });

  return {
    disableNotificationType,
    enableNotificationType
  };
}
