
import React, { useState } from 'react';
import { FindFriendsTabs } from '@/components/friends/FindFriendsTabs';
import { SuggestedUser } from '@/hooks/useSuggestedFriends';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Friends = () => {
  const [activeTab, setActiveTab] = useState('discover');
  
  // Fetch suggested friends
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ['suggestedFriends'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .limit(10);
        
      if (error) throw error;
      return data as SuggestedUser[];
    }
  });

  const handleSelectUser = (user: { id: string; username: string; avatar_url: string | null }) => {
    // Handle user selection
    console.log('Selected user:', user);
  };

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Amis</h1>
      <FindFriendsTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        suggestedUsers={suggestedUsers}
        isLoading={isLoading}
        onSelectUser={handleSelectUser}
      />
    </div>
  );
};

export default Friends;
