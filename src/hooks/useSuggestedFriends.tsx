
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface SuggestedUser {
  id: string;
  username: string;
  avatar_url: string | null;
}

export const useSuggestedFriends = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['suggestedFriends'],
    queryFn: async (): Promise<SuggestedUser[]> => {
      if (!user) return [];

      // Récupérer les utilisateurs suggérés (à l'exclusion de l'utilisateur actuel)
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .neq('id', user.id)
        .limit(10);

      if (error) {
        console.error('Error fetching suggested friends:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user,
  });

  const sendFriendRequest = async (suggestedUser: SuggestedUser) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: user.id,
          friend_id: suggestedUser.id,
          status: 'pending'
        });
        
      if (error) throw error;
      
      toast({
        title: "Demande envoyée",
        description: `Demande d'ami envoyée à ${suggestedUser.username}`,
      });
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer la demande d'ami",
      });
    }
  };

  return {
    suggestedUsers: query.data || [],
    isLoading: query.isLoading,
    sendFriendRequest,
    ...query
  };
};
