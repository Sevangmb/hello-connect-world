import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type WeatherOutfitSuggestionProps = {
  temperature: number;
  description: string;
};

const getWeatherCategories = (temperature: number, description: string): string[] => {
  const categories: string[] = [];
  
  if (temperature <= 5) {
    categories.push("Hiver");
  } else if (temperature <= 15) {
    categories.push("Mi-saison");
  } else if (temperature <= 22) {
    categories.push("Mi-saison", "Été");
  } else {
    categories.push("Été");
  }

  const lowerDescription = description.toLowerCase();
  if (lowerDescription.includes("pluie") || lowerDescription.includes("rain")) {
    categories.push("Pluie");
  } else if (lowerDescription.includes("soleil") || lowerDescription.includes("sun") || lowerDescription.includes("clear")) {
    categories.push("Soleil");
  }

  return categories;
};

async function getSingleClothingItem(userId: string, category: string, weatherCategories: string[]) {
  let { data: clothes, error } = await supabase
    .from('clothes')
    .select('*')
    .eq('user_id', userId)
    .eq('archived', false)
    .eq('category', category)
    .contains('weather_categories', weatherCategories)
    .limit(1);

  if (error) {
    console.error(`Error fetching ${category}:`, error);
    return null;
  }

  if (!clothes || clothes.length === 0) {
    const mainCategory = weatherCategories.find(cat => ["Été", "Hiver", "Mi-saison"].includes(cat));
    if (mainCategory) {
      const { data: seasonalClothes, error: seasonalError } = await supabase
        .from('clothes')
        .select('*')
        .eq('user_id', userId)
        .eq('archived', false)
        .eq('category', category)
        .contains('weather_categories', [mainCategory])
        .limit(1);

      if (!seasonalError && seasonalClothes && seasonalClothes.length > 0) {
        return seasonalClothes[0];
      }
    }
  } else {
    return clothes[0];
  }

  const { data: defaultClothes, error: defaultError } = await supabase
    .from('clothes')
    .select('*')
    .eq('user_id', userId)
    .eq('archived', false)
    .eq('category', category)
    .limit(1);

  if (defaultError) {
    console.error(`Error fetching default ${category}:`, defaultError);
    return null;
  }

  return defaultClothes?.[0] || null;
}

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

        const weatherCategories = getWeatherCategories(temperature, description);
        console.log("Weather categories:", weatherCategories);

        const top = await getSingleClothingItem(user.id, 'Hauts', weatherCategories);
        const bottom = await getSingleClothingItem(user.id, 'Bas', weatherCategories);
        const shoes = await getSingleClothingItem(user.id, 'Chaussures', weatherCategories);

        return {
          top,
          bottom,
          shoes,
          temperature,
          description
        };
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
