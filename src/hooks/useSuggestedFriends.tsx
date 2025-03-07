
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface SuggestedUser {
  id: string;
  username: string;
  avatar_url: string | null;
}

export const useSuggestedFriends = () => {
  const { user } = useAuth();

  return useQuery({
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
};
