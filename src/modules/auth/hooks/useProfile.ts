
/**
 * Hook pour la gestion des profils utilisateurs
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getUserService } from "../services/userDependencyProvider";
import { getAuthService } from "../services/authDependencyProvider";
import { UserUpdateData, Profile } from "../types";

export const useProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userService = getUserService();
  const authService = getAuthService();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) throw new Error("User not found");

        const { profile, error } = await userService.getUserProfile(currentUser.id);
        
        if (error) throw new Error(error);
        if (!profile) throw new Error("Profile not found");
        
        return profile as Profile;
      } catch (error: any) {
        // Check if this is a chrome extension interference error
        if (error.message.includes("chrome-extension") || error.message.includes("rejected")) {
          toast({
            variant: "destructive",
            title: "Erreur d'extension",
            description: "Une extension de votre navigateur interfère avec l'application. Essayez de désactiver vos extensions ou d'utiliser le mode navigation privée.",
          });
        }
        throw error;
      }
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: UserUpdateData) => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) throw new Error("User not found");

        const result = await userService.updateUserProfile(currentUser.id, updatedProfile);
        
        if (!result.success) {
          throw new Error(result.error || "Failed to update profile");
        }
      } catch (error: any) {
        // Check if this is a chrome extension interference error
        if (error.message.includes("chrome-extension") || error.message.includes("rejected")) {
          toast({
            variant: "destructive",
            title: "Erreur d'extension",
            description: "Une extension de votre navigateur interfère avec l'application. Essayez de désactiver vos extensions ou d'utiliser le mode navigation privée.",
          });
        }
        throw error;
      }
    },
    meta: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été enregistrées avec succès",
        });
      },
      onError: (error: Error) => {
        // Only show generic error if it's not already handled above
        if (!error.message.includes("chrome-extension") && !error.message.includes("rejected")) {
          console.error("Error updating profile:", error.message);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de mettre à jour votre profil",
          });
        }
      },
    },
  });

  return {
    profile,
    isLoading,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending
  };
};
