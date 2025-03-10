
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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSuggestedFriends = async () => {
      try {
        setIsLoading(true);
        
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
        setIsLoading(false);
      }
    };

    fetchSuggestedFriends();
  }, [toast]);

  const sendFriendRequest = async (user: SuggestedUser) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour envoyer une demande d'ami",
          variant: "destructive"
        });
        return;
      }
      
      // Vérifier si la demande d'ami existe déjà
      const { data: existingRequest, error: checkError } = await supabase
        .from('friendships')
        .select()
        .or(`user_id.eq.${currentUser.id},friend_id.eq.${currentUser.id}`)
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);
        
      if (checkError) throw checkError;
      
      if (existingRequest && existingRequest.length > 0) {
        toast({
          title: "Information",
          description: "Une demande d'ami existe déjà avec cet utilisateur",
        });
        return;
      }
      
      // Créer la nouvelle demande d'ami
      const { error } = await supabase
        .from('friendships')
        .insert([
          { 
            user_id: currentUser.id, 
            friend_id: user.id, 
            status: 'pending' 
          }
        ]);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: `Demande d'ami envoyée à ${user.username}`,
      });
      
    } catch (error: any) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande d'ami",
        variant: "destructive"
      });
    }
  };

  return { suggestedUsers, isLoading, sendFriendRequest };
};

export default useSuggestedFriends;
