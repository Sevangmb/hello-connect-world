
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

  const handleSelectUser = (user: SuggestedUser) => {
    // Handle user selection - e.g., send friend request
    console.log('Selected user:', user);
    toast({
      title: "Demande envoyée",
      description: `Demande d'ami envoyée à ${user.username}`,
    });
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
