
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SuggestedUserCard } from './SuggestedUserCard';
import { SuggestedUser } from '@/hooks/useSuggestedFriends';
import { SearchFriends } from './SearchFriends';
import { FriendsList } from './FriendsList';
import { PendingFriendRequestsList } from './PendingFriendRequestsList';

export interface FindFriendsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  suggestedUsers: SuggestedUser[];
  isLoading: boolean;
  onSelectUser: (user: SuggestedUser) => void;
}

export const FindFriendsTabs: React.FC<FindFriendsTabsProps> = ({
  activeTab,
  onTabChange,
  suggestedUsers,
  isLoading,
  onSelectUser
}) => {
  const handleFriendSelect = (friend: { id: string; username: string }) => {
    console.log('Friend selected:', friend);
  };

  // Données simulées pour les demandes d'amitié en attente
  const pendingRequests = [];
  const pendingRequestsLoading = false;
  
  const handleAcceptRequest = (requestId: string) => {
    console.log('Accept friend request:', requestId);
  };
  
  const handleRejectRequest = (requestId: string) => {
    console.log('Reject friend request:', requestId);
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="all">Tous</TabsTrigger>
        <TabsTrigger value="discover">Découvrir</TabsTrigger>
        <TabsTrigger value="pending">En attente</TabsTrigger>
        <TabsTrigger value="search">Rechercher</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <FriendsList />
      </TabsContent>
      
      <TabsContent value="discover">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isLoading ? (
            <div className="col-span-2 text-center py-8">Chargement des suggestions...</div>
          ) : suggestedUsers && suggestedUsers.length > 0 ? (
            suggestedUsers.map(user => (
              <SuggestedUserCard 
                key={user.id} 
                user={user} 
                onSelect={() => onSelectUser(user)} 
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-8">
              Aucune suggestion d'ami pour le moment
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="pending">
        <PendingFriendRequestsList 
          requests={pendingRequests}
          isLoading={pendingRequestsLoading}
          onAccept={handleAcceptRequest}
          onReject={handleRejectRequest}
        />
      </TabsContent>
      
      <TabsContent value="search">
        <SearchFriends onSelect={handleFriendSelect} />
      </TabsContent>
    </Tabs>
  );
};
