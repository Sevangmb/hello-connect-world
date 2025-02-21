
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useFriends = () => {
  const [friends, setFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setCurrentUser(user);

      // Récupérer les amis acceptés
      const { data: acceptedFriends, error: friendsError } = await supabase
        .from('friendships')
        .select(`
          *,
          friend_profile:profiles!friendships_friend_id_fkey(id, username, avatar_url),
          user_profile:profiles!friendships_user_id_fkey(id, username, avatar_url)
        `)
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (friendsError) throw friendsError;

      // Récupérer les demandes en attente
      const { data: pending, error: pendingError } = await supabase
        .from('friendships')
        .select(`
          *,
          friend_profile:profiles!friendships_friend_id_fkey(id, username, avatar_url)
        `)
        .eq('friend_id', user.id)
        .eq('status', 'pending');

      if (pendingError) throw pendingError;

      setFriends(acceptedFriends || []);
      setPendingRequests(pending || []);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des amis:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste d'amis",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFriendRequest = async (friendshipId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status })
        .eq('id', friendshipId);

      if (error) throw error;

      toast({
        title: status === 'accepted' ? "Ami ajouté" : "Demande refusée",
        description: status === 'accepted' 
          ? "Vous êtes maintenant amis !" 
          : "La demande d'ami a été refusée",
      });

      fetchFriends();
    } catch (error: any) {
      console.error('Erreur lors de la gestion de la demande:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de gérer la demande d'ami",
      });
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return {
    friends,
    pendingRequests,
    currentUser,
    loading,
    handleFriendRequest,
    refreshFriends: fetchFriends
  };
};
