import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

const fetchTrendingOutfits = async () => {
  const { data, error } = await supabase
    .from('outfits')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching trending outfits:", error);
    throw error;
  }

  return data;
};

const TrendingOutfits = () => {
  const { data: outfits, isLoading } = useQuery({
    queryKey: ['trendingOutfits'],
    queryFn: fetchTrendingOutfits,
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Tenues Tendance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : !outfits?.length ? (
          <div className="text-center py-4 text-muted-foreground">
            Aucune tenue trouvée
          </div>
        ) : (
          <ScrollArea className="h-[300px] overflow-hidden">
            <div className="space-y-2">
              {outfits.map((outfit) => (
                <div key={outfit.id} className="p-4 bg-white rounded-lg shadow">
                  <h3 className="text-lg font-bold">{outfit.name}</h3>
                  <p className="text-sm text-gray-600">{outfit.description}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingOutfits;
