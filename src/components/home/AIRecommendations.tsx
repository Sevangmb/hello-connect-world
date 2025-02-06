import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const AIRecommendations = () => {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["ai-recommendations"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      // Fetch user's clothes and preferences to generate recommendations
      const { data: outfits } = await supabase
        .from("outfits")
        .select(`
          *,
          top:clothes!outfits_top_id_fkey(*),
          bottom:clothes!outfits_bottom_id_fkey(*),
          shoes:clothes!outfits_shoes_id_fkey(*)
        `)
        .limit(4);

      return {
        forYouToday: outfits || [],
        youMightLike: outfits || []
      };
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-facebook-primary" />
          <h2 className="text-xl font-semibold">Pour toi aujourd'hui</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations?.forYouToday.map((outfit) => (
            <Card key={outfit.id} className="p-4">
              <h3 className="font-medium mb-2">{outfit.name}</h3>
              <div className="flex gap-2">
                {outfit.top && (
                  <img 
                    src={outfit.top.image_url} 
                    alt={outfit.top.name}
                    className="h-24 w-24 object-cover rounded"
                  />
                )}
                {outfit.bottom && (
                  <img 
                    src={outfit.bottom.image_url} 
                    alt={outfit.bottom.name}
                    className="h-24 w-24 object-cover rounded"
                  />
                )}
                {outfit.shoes && (
                  <img 
                    src={outfit.shoes.image_url} 
                    alt={outfit.shoes.name}
                    className="h-24 w-24 object-cover rounded"
                  />
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-facebook-primary" />
          <h2 className="text-xl font-semibold">Tu aimeras peut-être</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations?.youMightLike.map((outfit) => (
            <Card key={outfit.id} className="p-4">
              <h3 className="font-medium mb-2">{outfit.name}</h3>
              <div className="flex gap-2">
                {outfit.top && (
                  <img 
                    src={outfit.top.image_url} 
                    alt={outfit.top.name}
                    className="h-24 w-24 object-cover rounded"
                  />
                )}
                {outfit.bottom && (
                  <img 
                    src={outfit.bottom.image_url} 
                    alt={outfit.bottom.name}
                    className="h-24 w-24 object-cover rounded"
                  />
                )}
                {outfit.shoes && (
                  <img 
                    src={outfit.shoes.image_url} 
                    alt={outfit.shoes.name}
                    className="h-24 w-24 object-cover rounded"
                  />
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
