import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SearchFriends } from "./SearchFriends";

interface FriendsListProps {
  onChatSelect?: (friend: { id: string; username: string }) => void;
}

export const FriendsList = ({ onChatSelect }: FriendsListProps) => {
  const [friends, setFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  const fetchFriends = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setCurrentUser(user);

      // Récupérer les amis acceptés
      const { data: acceptedFriends, error: friendsError } = await supabase
        .from('friendships')
        .select(`
          *,
          friend_profile:profiles!friendships_friend_id_fkey(id, username, avatar_url),
          user_profile:profiles!friendships_user_id_fkey(id, username, avatar_url)
        `)
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (friendsError) throw friendsError;

      // Récupérer les demandes en attente
      const { data: pending, error: pendingError } = await supabase
        .from('friendships')
        .select(`
          *,
          friend_profile:profiles!friendships_friend_id_fkey(id, username, avatar_url)
        `)
        .eq('friend_id', user.id)
        .eq('status', 'pending');

      if (pendingError) throw pendingError;

      setFriends(acceptedFriends || []);
      setPendingRequests(pending || []);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des amis:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste d'amis",
      });
    }
  };

  const handleFriendRequest = async (friendshipId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status })
        .eq('id', friendshipId);

      if (error) throw error;

      toast({
        title: status === 'accepted' ? "Ami ajouté" : "Demande refusée",
        description: status === 'accepted' 
          ? "Vous êtes maintenant amis !" 
          : "La demande d'ami a été refusée",
      });

      fetchFriends();
    } catch (error: any) {
      console.error('Erreur lors de la gestion de la demande:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de gérer la demande d'ami",
      });
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div className="space-y-6">
      <SearchFriends onSelect={(friend) => onChatSelect?.(friend)} />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Demandes d'ami en attente</h2>
        {pendingRequests.length === 0 ? (
          <p className="text-muted-foreground">Aucune demande en attente</p>
        ) : (
          pendingRequests.map((request) => (
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
                  <Button
                    size="sm"
                    onClick={() => handleFriendRequest(request.id, 'accepted')}
                  >
                    <Check className="h-4 w-4" />
                    Accepter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleFriendRequest(request.id, 'rejected')}
                  >
                    <X className="h-4 w-4" />
                    Refuser
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Mes amis</h2>
        {friends.length === 0 ? (
          <p className="text-muted-foreground">Vous n'avez pas encore d'amis</p>
        ) : (
          friends.map((friendship) => {
            const friendProfile = friendship.user_id === currentUser?.id 
              ? friendship.friend_profile
              : friendship.user_profile;

            return (
              <Card 
                key={friendship.id} 
                className="p-4 cursor-pointer hover:bg-gray-50" 
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