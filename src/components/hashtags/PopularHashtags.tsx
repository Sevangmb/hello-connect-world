
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Hash, TrendingUp, Loader2 } from "lucide-react";

interface HashtagCount {
  name: string;
  count: number;
}

interface HashtagResponse {
  name: string;
  clothes_count: number | null;
  outfit_count: number | null;
}

const fetchPopularHashtags = async (): Promise<HashtagCount[]> => {
  console.log("Fetching popular hashtags...");
  const { data: hashtagsData, error } = await supabase
    .from('hashtags')
    .select(`
      name,
      clothes_count:clothes_hashtags(count),
      outfit_count:outfits_hashtags(count)
    `);

  if (error) {
    console.error("Error fetching hashtags:", error);
    throw error;
  }

  console.log("Hashtags raw data:", hashtagsData);

  if (!hashtagsData) return [];

  const processedData = (hashtagsData as HashtagResponse[]).map(tag => ({
    name: tag.name,
    count: Number(tag.clothes_count || 0) + Number(tag.outfit_count || 0)
  })).sort((a, b) => b.count - a.count);

  console.log("Processed hashtags data:", processedData);

  return processedData;
};

export const PopularHashtags = () => {
  const navigate = useNavigate();
  const { data: hashtags, isLoading } = useQuery({
    queryKey: ['popularHashtags'],
    queryFn: fetchPopularHashtags,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Hashtags Populaires
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : !hashtags?.length ? (
          <div className="text-center py-4 text-muted-foreground">
            Aucun hashtag trouvé
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {hashtags.map((tag) => (
                <Button
                  key={tag.name}
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => navigate(`/hashtag/${tag.name}`)}
                >
                  <span className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    #{tag.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {tag.count}
                  </span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
