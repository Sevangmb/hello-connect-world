import { useState } from "react";
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

interface UserSearchProps {
  onSelect: (user: { id: string; username: string; avatar_url: string | null }) => void;
  placeholder?: string;
}

export const UserSearch = ({ onSelect, placeholder = "Rechercher un utilisateur..." }: UserSearchProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: users } = useQuery({
    queryKey: ["users-search", search],
    queryFn: async () => {
      console.log("Searching users with query:", search);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .neq('id', user.id)
        .ilike('username', `%${search}%`)
        .limit(10);

      if (error) throw error;
      return profiles;
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
        {placeholder}
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput 
            placeholder={placeholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Aucun utilisateur trouvé.</CommandEmpty>
            <CommandGroup heading="Utilisateurs">
              {users?.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.username || ""}
                  onSelect={() => {
                    onSelect(user);
                    setOpen(false);
                  }}
                >
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={user.avatar_url || ""} />
                    <AvatarFallback>{user.username?.[0]}</AvatarFallback>
                  </Avatar>
                  {user.username}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};