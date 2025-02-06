import { useState } from "react";
import { Command } from "cmdk";
import { Search as SearchIcon, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SearchFilters = {
  query: string;
  type: "clothes" | "outfits" | "users" | "hashtags" | "all";
  sortBy: "recent" | "popular" | "relevant";
};

export const SearchFilters = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    type: "all",
    sortBy: "relevant",
  });

  // Fetch hashtags for autocompletion
  const { data: hashtags } = useQuery({
    queryKey: ["hashtags", filters.query],
    queryFn: async () => {
      console.log("Fetching hashtags for autocompletion");
      if (!filters.query) return [];
      
      const { data, error } = await supabase
        .from("hashtags")
        .select("name")
        .ilike("name", `%${filters.query}%`)
        .limit(5);
        
      if (error) throw error;
      return data;
    },
    enabled: filters.query.startsWith("#"),
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="search"
          placeholder="Rechercher des vêtements, tenues, utilisateurs..."
          value={filters.query}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          className="pl-10"
        />
        {filters.query.startsWith("#") && hashtags?.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
            <Command>
              <Command.List>
                {hashtags.map((hashtag) => (
                  <Command.Item
                    key={hashtag.name}
                    onSelect={() => setFilters({ ...filters, query: `#${hashtag.name}` })}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    #{hashtag.name}
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <Select
          value={filters.type}
          onValueChange={(value: SearchFilters["type"]) =>
            setFilters({ ...filters, type: value })
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Type de recherche" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tout</SelectItem>
            <SelectItem value="clothes">Vêtements</SelectItem>
            <SelectItem value="outfits">Tenues</SelectItem>
            <SelectItem value="users">Utilisateurs</SelectItem>
            <SelectItem value="hashtags">Hashtags</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.sortBy}
          onValueChange={(value: SearchFilters["sortBy"]) =>
            setFilters({ ...filters, sortBy: value })
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevant">Pertinence</SelectItem>
            <SelectItem value="recent">Plus récent</SelectItem>
            <SelectItem value="popular">Popularité</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Plus de filtres
        </Button>
      </div>
    </div>
  );
};
