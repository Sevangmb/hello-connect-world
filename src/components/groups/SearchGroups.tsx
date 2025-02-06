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
import { Search, Users } from "lucide-react";

interface SearchGroupsProps {
  onSelect: (group: { id: string; name: string }) => void;
}

export const SearchGroups = ({ onSelect }: SearchGroupsProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: groups } = useQuery({
    queryKey: ["groups-search", search],
    queryFn: async () => {
      console.log("Searching groups with query:", search);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const query = supabase
        .from('groups')
        .select(`
          *,
          members:group_members(
            profiles(username, avatar_url),
            role
          )
        `);

      if (search) {
        query.ilike('name', `%${search}%`);
      }

      const { data, error } = await query.limit(5);
      if (error) throw error;

      return data;
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
        Rechercher un groupe...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput 
            placeholder="Rechercher un groupe..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Aucun groupe trouvé.</CommandEmpty>
            <CommandGroup heading="Groupes">
              {groups?.map((group) => (
                <CommandItem
                  key={group.id}
                  value={group.name}
                  onSelect={() => {
                    onSelect(group);
                    setOpen(false);
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  <div className="flex flex-col">
                    <span>{group.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {group.members?.length || 0} membres
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};
