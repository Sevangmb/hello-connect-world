import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { UserPlus, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export const AddFriend = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { data: potentialFriends } = useQuery({
    queryKey: ["potential-friends"],
    queryFn: async () => {
      console.log("Fetching potential friends");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      // Récupérer tous les profils publics
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .neq('id', user.id)
        .eq('visibility', 'public');

      if (error) throw error;

      // Récupérer les amitiés existantes pour filtrer
      const { data: friendships } = await supabase
        .from('friendships')
        .select('friend_id, user_id, status')
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

      // Filtrer les profils qui ne sont pas déjà amis ou en attente
      return profiles.filter(profile => 
        !friendships?.some(friendship => 
          (friendship.user_id === profile.id || friendship.friend_id === profile.id) &&
          (friendship.status === 'accepted' || friendship.status === 'pending')
        )
      );
    },
  });

  const handleAddFriend = async (foundUser: { id: string; username: string }) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      // Créer la demande d'ami
      const { error: createError } = await supabase
        .from('friendships')
        .insert({
          user_id: user.id,
          friend_id: foundUser.id,
          status: 'pending'
        });

      if (createError) throw createError;

      toast({
        title: "Demande envoyée",
        description: `Demande d'ami envoyée à ${foundUser.username}`,
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout d\'ami:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-2xl font-bold mb-4">Ajouter des amis</h2>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {!potentialFriends?.length ? (
            <p className="text-muted-foreground">Aucun utilisateur disponible pour devenir ami</p>
          ) : (
            potentialFriends.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.username}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddFriend(user)}
                    disabled={loading}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
