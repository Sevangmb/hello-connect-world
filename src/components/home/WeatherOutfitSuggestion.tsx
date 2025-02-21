
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
  const { data: suggestion, isLoading, error } = useQuery({
    queryKey: ["outfit-suggestion", temperature, description],
    queryFn: async () => {
      try {
        console.log("Fetching outfit suggestion for:", { temperature, description });
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("User not authenticated");
          return null;
        }

        // Get all user's clothes first
        const { data: clothes, error: clothesError } = await supabase
          .from('clothes')
          .select('*')
          .eq('user_id', user.id)
          .eq('archived', false);

        if (clothesError) throw clothesError;

        // Get AI suggestion based on weather and available clothes
        const { data: aiSuggestion, error: aiError } = await supabase.functions.invoke(
          'generate-outfit-suggestion',
          {
            body: {
              temperature,
              description,
              clothes
            }
          }
        );

        if (aiError) throw aiError;

        // If we have a suggestion, fetch the complete clothes details
        if (aiSuggestion?.suggestion) {
          const { top, bottom, shoes } = aiSuggestion.suggestion;
          
          const topDetails = clothes?.find(c => c.id === top) || null;
          const bottomDetails = clothes?.find(c => c.id === bottom) || null;
          const shoesDetails = clothes?.find(c => c.id === shoes) || null;

          return {
            top: topDetails,
            bottom: bottomDetails,
            shoes: shoesDetails,
            explanation: aiSuggestion.explanation,
            temperature,
            description
          };
        }

        return null;
      } catch (error) {
        console.error("Error in outfit suggestion query:", error);
        return null;
      }
    },
    enabled: !!temperature && !!description,
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <h2 className="text-xl font-semibold">Suggestion de tenue</h2>
        </div>
        <Skeleton className="h-[400px] w-full" />
      </Card>
    );
  }

  if (error || !suggestion) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-destructive" />
          <h2 className="text-xl font-semibold">Suggestion de tenue</h2>
        </div>
        <p className="text-destructive">
          {error instanceof Error ? error.message : "Impossible de générer une suggestion pour le moment."}
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Suggestion de tenue</h2>
      </div>
      <p className="text-muted-foreground mb-4">
        Pour une température de {suggestion.temperature}°C et un temps {suggestion.description}
      </p>
      
      {suggestion.explanation && (
        <p className="mb-6 text-sm bg-muted p-4 rounded-lg">
          {suggestion.explanation}
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suggestion.top && (
          <div className="flex flex-col items-center gap-2">
            <h3 className="font-semibold">Haut</h3>
            <div className="relative aspect-square w-full">
              <img 
                src={suggestion.top.image_url || '/placeholder.svg'} 
                alt={suggestion.top.name}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
            <p className="text-sm text-center">{suggestion.top.name}</p>
            {suggestion.top.brand && (
              <p className="text-xs text-muted-foreground text-center">{suggestion.top.brand}</p>
            )}
          </div>
        )}

        {suggestion.bottom && (
          <div className="flex flex-col items-center gap-2">
            <h3 className="font-semibold">Bas</h3>
            <div className="relative aspect-square w-full">
              <img 
                src={suggestion.bottom.image_url || '/placeholder.svg'} 
                alt={suggestion.bottom.name}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
            <p className="text-sm text-center">{suggestion.bottom.name}</p>
            {suggestion.bottom.brand && (
              <p className="text-xs text-muted-foreground text-center">{suggestion.bottom.brand}</p>
            )}
          </div>
        )}

        {suggestion.shoes && (
          <div className="flex flex-col items-center gap-2">
            <h3 className="font-semibold">Chaussures</h3>
            <div className="relative aspect-square w-full">
              <img 
                src={suggestion.shoes.image_url || '/placeholder.svg'} 
                alt={suggestion.shoes.name}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
            <p className="text-sm text-center">{suggestion.shoes.name}</p>
            {suggestion.shoes.brand && (
              <p className="text-xs text-muted-foreground text-center">{suggestion.shoes.brand}</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
