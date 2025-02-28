
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Bell, BellOff, AlertCircle } from "lucide-react";

// Since the user_notification_settings table isn't defined in the Supabase types,
// we'll use a direct approach with custom SQL queries instead

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

      // Since we can't directly access user_notification_settings, we'll
      // use a custom approach to store the preference in user preferences
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("preferences")
        .eq("id", userId)
        .single();

      if (profileError) {
        dismiss();
        throw profileError;
      }

      // Update preferences to disable this notification type
      const preferences = userProfile.preferences || {};
      preferences.notifications = preferences.notifications || {};
      preferences.notifications[type] = false;

      // Save updated preferences
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ preferences })
        .eq("id", userId);

      if (updateError) {
        dismiss();
        throw updateError;
      }

      dismiss();
      toast({
        title: "Notifications désactivées",
        description: `Les notifications de type "${type}" ont été désactivées`,
        icon: { type: "icon", icon: BellOff, className: "h-4 w-4" },
        duration: 3000,
      });

      return { type, enabled: false };
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

      // Get current preferences
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("preferences")
        .eq("id", userId)
        .single();

      if (profileError) {
        dismiss();
        throw profileError;
      }

      // Update preferences to enable this notification type
      const preferences = userProfile.preferences || {};
      preferences.notifications = preferences.notifications || {};
      preferences.notifications[type] = true;

      // Save updated preferences
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ preferences })
        .eq("id", userId);

      if (updateError) {
        dismiss();
        throw updateError;
      }

      dismiss();
      toast({
        title: "Notifications activées",
        description: `Les notifications de type "${type}" ont été activées`,
        icon: { type: "icon", icon: Bell, className: "h-4 w-4" },
        duration: 3000,
      });

      return { type, enabled: true };
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
