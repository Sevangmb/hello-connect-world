
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

export type SuggestedUser = {
  id: string;
  username: string;
  avatar_url: string | null;
};

export const useSuggestedFriends = () => {
  // Récupérer les utilisateurs suggérés
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggested-friends"],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Non authentifié");

        // Récupérer les profils publics qui ne sont pas déjà amis
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .neq('id', user.id)
          .eq('visibility', 'public')
          .limit(10);

        if (error) throw error;

        // Récupérer les amitiés existantes
        const { data: friendships } = await supabase
          .from('friendships')
          .select('friend_id, user_id')
          .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

        // Filtrer les profils qui ne sont pas déjà amis
        return profiles.filter(profile => 
          !friendships?.some(friendship => 
            friendship.user_id === profile.id || 
            friendship.friend_id === profile.id
          )
        );
      } catch (error) {
        console.error("Erreur lors de la récupération des suggestions:", error);
        return [];
      }
    },
  });

  const sendFriendRequest = async (user: SuggestedUser) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("Non authentifié");

      // Vérifier si une demande d'ami existe déjà
      const { data: existingFriendship } = await supabase
        .from('friendships')
        .select('*')
        .or(`user_id.eq.${currentUser.id},friend_id.eq.${currentUser.id}`)
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .single();

      if (existingFriendship) {
        toast.info("Vous êtes déjà amis ou une demande est en attente");
        return;
      }

      // Créer une nouvelle demande d'ami
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: currentUser.id,
          friend_id: user.id,
          status: 'pending'
        });

      if (error) throw error;
      
      toast.success("Demande d'ami envoyée !", {
        description: `Vous avez envoyé une demande d'ami à ${user.username}`,
        icon: <UserPlus className="h-4 w-4 text-green-500" />
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande d'ami:", error);
      toast.error("Erreur lors de l'envoi de la demande d'ami");
    }
  };

  return {
    suggestedUsers,
    isLoading,
    sendFriendRequest
  };
};
