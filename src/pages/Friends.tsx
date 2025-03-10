
import React, { useState } from 'react';
import { FindFriendsTabs } from '@/components/friends/FindFriendsTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SuggestedUser } from '@/hooks/useSuggestedFriends';
import { toast } from '@/components/ui/use-toast';

const Friends = () => {
  const [activeTab, setActiveTab] = useState('discover');
  
  // Fetch suggested friends
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ['suggestedFriends'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .limit(10);
          
        if (error) throw error;
        return data as SuggestedUser[];
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les suggestions d'amis",
          variant: "destructive"
        });
        console.error("Error fetching suggested friends:", error);
        return [];
      }
    }
  });

  const handleSelectUser = async (user: SuggestedUser) => {
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

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Amis</CardTitle>
        </CardHeader>
        <CardContent>
          <FindFriendsTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            suggestedUsers={suggestedUsers || []}
            isLoading={isLoading}
            onSelectUser={handleSelectUser}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Friends;
