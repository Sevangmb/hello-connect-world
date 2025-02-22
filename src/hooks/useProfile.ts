
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from("profiles")
        .select("username, full_name, avatar_url, visibility, phone, address, preferred_language, email_notifications")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      
      return {
        ...data,
        username: data?.username || "",
        full_name: data?.full_name || "",
        phone: data?.phone || "",
        address: data?.address || "",
        preferred_language: data?.preferred_language || "fr",
        visibility: (data?.visibility || "public") as "public" | "private",
        email_notifications: data?.email_notifications ?? true,
      } as Profile;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: Partial<Profile>) => {
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
        console.error("Error updating profile:", error.message);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de mettre à jour votre profil",
        });
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
