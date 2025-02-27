
import React from "react";
import { User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchFriends } from "./SearchFriends";
import { Skeleton } from "@/components/ui/skeleton";
import { FriendCard } from "./FriendCard";
import { PendingFriendRequestsList } from "./PendingFriendRequestsList";
import { useFriends } from "@/hooks/useFriends";

interface FriendsListProps {
  onChatSelect?: (friend: { id: string; username: string }) => void;
}

export const FriendsList = ({ onChatSelect }: FriendsListProps) => {
  const { friends, pendingRequests, loading, handleFriendRequest } = useFriends();

  const handleAccept = (requestId: string) => {
    handleFriendRequest(requestId, 'accepted');
  };

  const handleReject = (requestId: string) => {
    handleFriendRequest(requestId, 'rejected');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchFriends onSelect={(friend) => onChatSelect?.(friend)} />

      <PendingFriendRequestsList 
        requests={pendingRequests}
        isLoading={loading}
        onAccept={handleAccept}
        onReject={handleReject}
      />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-900">Mes amis</h2>
        {friends.length === 0 ? (
          <p className="text-muted-foreground">Vous n'avez pas encore d'amis</p>
        ) : (
          <div className="space-y-3">
            {friends.map((friendship) => (
              <FriendCard 
                key={friendship.id} 
                friend={friendship.friend_profile}
                onSelect={onChatSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
