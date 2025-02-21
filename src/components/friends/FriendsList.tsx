
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchFriends } from "./SearchFriends";
import { useFriends } from "@/hooks/useFriends";
import { Skeleton } from "@/components/ui/skeleton";

interface FriendsListProps {
  onChatSelect?: (friend: { id: string; username: string }) => void;
}

export const FriendsList = ({ onChatSelect }: FriendsListProps) => {
  const { friends, pendingRequests, loading, handleFriendRequest } = useFriends();

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

      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Demandes d'ami en attente</h2>
          {pendingRequests.map((request) => (
            <Card key={request.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={request.friend_profile.avatar_url} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{request.friend_profile.username}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleFriendRequest(request.id, 'accepted')}>
                    Accepter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleFriendRequest(request.id, 'rejected')}
                  >
                    Refuser
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Mes amis</h2>
        {friends.length === 0 ? (
          <p className="text-muted-foreground">Vous n'avez pas encore d'amis</p>
        ) : (
          friends.map((friendship) => {
            const friendProfile = friendship.friend_profile;

            return (
              <Card 
                key={friendship.id} 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" 
                onClick={() => onChatSelect?.(friendProfile)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={friendProfile.avatar_url} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{friendProfile.username}</span>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
