
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface SuggestedUser {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string | null;
}

export const useSuggestedFriends = () => {
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSuggestedFriends = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .limit(10);
          
        if (error) throw error;
        
        setSuggestedUsers(data as SuggestedUser[]);
      } catch (error: any) {
        console.error('Error fetching suggested friends:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les suggestions d'amis",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedFriends();
  }, [toast]);

  return { suggestedUsers, loading };
};

export default useSuggestedFriends;
