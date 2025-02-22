
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;  // Adding the id field that was missing
  username: string;
  full_name: string;
  avatar_url: string | null;
  visibility: "public" | "private";
  phone: string | null;
  address: string | null;
  preferred_language: string;
  email_notifications: boolean;
};

export const useProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not found");

        const { data, error } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url, visibility, phone, address, preferred_language, email_notifications")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;
        
        return {
          id: user.id,  // Ensure we always have an id
          username: data?.username || "",
          full_name: data?.full_name || "",
          phone: data?.phone || "",
          address: data?.address || "",
          preferred_language: data?.preferred_language || "fr",
          visibility: (data?.visibility || "public") as "public" | "private",
          email_notifications: data?.email_notifications ?? true,
          avatar_url: data?.avatar_url,
        } as Profile;
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
    mutationFn: async (updatedProfile: Partial<Profile>) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not found");

        const { error } = await supabase
          .from("profiles")
          .update({
            ...updatedProfile,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (error) throw error;
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
