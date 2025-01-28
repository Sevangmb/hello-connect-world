import { Search, Heart, Star, Hash, MapPin, Filter, List, TrendingUp } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HashtagCount {
  name: string;
  count: number;
}

const fetchPopularHashtags = async (): Promise<HashtagCount[]> => {
  console.log("Fetching popular hashtags...");
  const { data, error } = await supabase
    .from('hashtags')
    .select(`
      id,
      name,
      clothes_count:clothes_hashtags(count),
      outfit_count:outfits_hashtags(count)
    `)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching hashtags:", error);
    throw error;
  }

  console.log("Hashtags data:", data);

  return data.map(tag => {
    // Extraire le compte des vêtements
    const clothesCount = Array.isArray(tag.clothes_count) 
      ? tag.clothes_count.length 
      : (tag.clothes_count || 0);
    
    // Extraire le compte des tenues
    const outfitCount = Array.isArray(tag.outfit_count)
      ? tag.outfit_count.length
      : (tag.outfit_count || 0);

    return {
      name: tag.name,
      count: clothesCount + outfitCount
    };
  }).sort((a, b) => b.count - a.count);
};

export const ExploreSection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { data: hashtags, isLoading } = useQuery({
    queryKey: ['popularHashtags'],
    queryFn: fetchPopularHashtags,
  });

  return (
    <AccordionItem value="explore" className="border-none">
      <AccordionTrigger className="py-2">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Explorer
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-1 pl-6">
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/search",
            })}
            onClick={() => navigate("/search")}
          >
            <Search className="h-4 w-4" />
            Recherche
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/trending/outfits",
            })}
            onClick={() => navigate("/trending/outfits")}
          >
            <Heart className="h-4 w-4" />
            Tenues Populaires
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/trending/items",
            })}
            onClick={() => navigate("/trending/items")}
          >
            <Star className="h-4 w-4" />
            Articles Populaires
          </Button>

          {/* Section des hashtags populaires */}
          <div className="mt-2">
            <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-gray-500">
              <Hash className="h-4 w-4" />
              Hashtags Populaires
            </div>
            <ScrollArea className="h-[200px] pr-4">
              {isLoading ? (
                <div className="px-2 py-1 text-sm text-gray-500">Chargement...</div>
              ) : (
                hashtags?.map((tag) => (
                  <Button
                    key={tag.name}
                    variant="ghost"
                    className="w-full justify-start gap-2 py-1 text-sm"
                    onClick={() => navigate(`/hashtag/${tag.name}`)}
                  >
                    <TrendingUp className="h-3 w-3" />
                    <span className="truncate">#{tag.name}</span>
                    <span className="ml-auto text-xs text-gray-500">{tag.count}</span>
                  </Button>
                ))
              )}
            </ScrollArea>
          </div>

          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/stores/map",
            })}
            onClick={() => navigate("/stores/map")}
          >
            <MapPin className="h-4 w-4" />
            Carte des Boutiques
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/stores/search",
            })}
            onClick={() => navigate("/stores/search")}
          >
            <Filter className="h-4 w-4" />
            Filtrer les Boutiques
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/stores/list",
            })}
            onClick={() => navigate("/stores/list")}
          >
            <List className="h-4 w-4" />
            Liste des Boutiques
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};