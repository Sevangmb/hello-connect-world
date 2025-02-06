import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type WeatherOutfitSuggestionProps = {
  temperature: number;
  description: string;
};

export const WeatherOutfitSuggestion = ({ temperature, description }: WeatherOutfitSuggestionProps) => {
  const { data: suggestion, isLoading } = useQuery({
    queryKey: ["outfit-suggestion", temperature, description],
    queryFn: async () => {
      try {
        const { data: { url } } = await supabase.functions.invoke('get-weather-outfit', {
          body: { temperature, weather: description }
        });
        return url;
      } catch (error) {
        console.error("Error fetching outfit suggestion:", error);
        throw error;
      }
    },
    enabled: !!temperature && !!description,
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Suggestion de tenue</h2>
        </div>
        <Skeleton className="h-20 w-full" />
      </Card>
    );
  }

  if (!suggestion) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-semibold">Suggestion de tenue</h2>
      </div>
      <p className="text-muted-foreground">{suggestion}</p>
    </Card>
  );
};