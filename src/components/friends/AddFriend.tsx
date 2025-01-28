import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { UserPlus, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";

export const AddFriend = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { data: searchResults } = useQuery({
    queryKey: ["users-search", search],
    queryFn: async () => {
      console.log("Searching users with query:", search);
      if (!search) return [];

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      // Rechercher les utilisateurs par nom d'utilisateur
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .ilike('username', `%${search}%`)
        .neq('id', user.id)
        .limit(5);

      if (error) throw error;

      // Filtrer les utilisateurs déjà amis
      const { data: friendships } = await supabase
        .from('friendships')
        .select('friend_id, user_id, status')
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

      return users.filter(searchedUser => 
        !friendships?.some(friendship => 
          (friendship.user_id === searchedUser.id || friendship.friend_id === searchedUser.id) &&
          (friendship.status === 'accepted' || friendship.status === 'pending')
        )
      );
    },
    enabled: search.length > 0,
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

      setOpen(false);
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
      <h2 className="text-2xl font-bold mb-4">Ajouter un ami</h2>
      <Button 
        variant="outline" 
        className="w-full justify-start" 
        onClick={() => setOpen(true)}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Rechercher un utilisateur...
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput 
            placeholder="Rechercher un utilisateur..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Aucun utilisateur trouvé.</CommandEmpty>
            <CommandGroup heading="Utilisateurs">
              {searchResults?.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.username || ""}
                  onSelect={() => handleAddFriend(user)}
                  disabled={loading}
                >
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={user.avatar_url || ""} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  {user.username}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </Card>
  );
};