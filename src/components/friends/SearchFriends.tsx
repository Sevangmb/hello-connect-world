
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SearchFriendsProps {
  onSelect: (friend: { id: string; username: string; avatar_url?: string | null }) => void;
  initialSearchTerm?: string;
}

export const SearchFriends = ({ onSelect, initialSearchTerm = "" }: SearchFriendsProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(initialSearchTerm);

  // Update search when initialSearchTerm changes
  useEffect(() => {
    if (initialSearchTerm) {
      setSearch(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  const { data: friends } = useQuery({
    queryKey: ["friends-search", search],
    queryFn: async () => {
      console.log("Searching friends with query:", search);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data: acceptedFriends, error } = await supabase
        .from('friendships')
        .select(`
          *,
          friend_profile:profiles!friendships_friend_id_fkey(id, username, avatar_url),
          user_profile:profiles!friendships_user_id_fkey(id, username, avatar_url)
        `)
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (error) throw error;

      const formattedFriends = acceptedFriends.map(friendship => {
        const friendProfile = friendship.user_id === user.id 
          ? friendship.friend_profile
          : friendship.user_profile;
        return friendProfile;
      });

      if (search) {
        return formattedFriends.filter(friend => 
          friend.username?.toLowerCase().includes(search.toLowerCase())
        );
      }

      return formattedFriends;
    },
  });

  return (
    <>
      <Button 
        variant="outline" 
        className="w-full justify-start" 
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Rechercher un ami...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput 
            placeholder="Rechercher un ami..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Aucun ami trouvé.</CommandEmpty>
            <CommandGroup heading="Amis">
              {friends?.map((friend) => (
                <CommandItem
                  key={friend.id}
                  value={friend.username || ""}
                  onSelect={() => {
                    onSelect(friend);
                    setOpen(false);
                  }}
                >
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={friend.avatar_url || ""} />
                    <AvatarFallback>{friend.username?.[0]}</AvatarFallback>
                  </Avatar>
                  {friend.username}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};
