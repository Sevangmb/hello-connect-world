
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTrendingOutfits = () => {
  return useQuery({
    queryKey: ["trending-outfits"],
    queryFn: async () => {
      console.log("Fetching trending outfits...");
      
      const { data: likeCounts, error: likesError } = await supabase
        .from('outfit_likes')
        .select('outfit_id');

      if (likesError) {
        console.error("Error fetching likes:", likesError);
        throw likesError;
      }

      const outfitLikeCounts = likeCounts?.reduce((acc: Record<string, number>, curr) => {
        const outfitId = curr.outfit_id;
        acc[outfitId] = (acc[outfitId] || 0) + 1;
        return acc;
      }, {});

      const sortedOutfitIds = Object.entries(outfitLikeCounts || {})
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20)
        .map(([id]) => id);

      if (!sortedOutfitIds.length) {
        return [];
      }

      const { data: outfits, error: outfitsError } = await supabase
        .from('outfits')
        .select(`
          *,
          top:clothes!outfits_top_id_fkey(*),
          bottom:clothes!outfits_bottom_id_fkey(*),
          shoes:clothes!outfits_shoes_id_fkey(*),
          user:profiles!outfits_user_id_profiles_fkey(username, avatar_url),
          hashtags:outfits_hashtags(
            hashtag:hashtags(*)
          )
        `)
        .in('id', sortedOutfitIds);

      if (outfitsError) {
        console.error("Error fetching outfits details:", outfitsError);
        throw outfitsError;
      }

      const orderedOutfits = sortedOutfitIds
        .map(id => outfits?.find(outfit => outfit.id === id))
        .filter(outfit => outfit !== undefined)
        .map(outfit => ({
          ...outfit,
          hashtags: outfit.hashtags?.map(h => h.hashtag)
        }));

      console.log("Fetched trending outfits:", orderedOutfits);
      return orderedOutfits;
    },
  });
};
