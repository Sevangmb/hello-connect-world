
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type WeatherOutfitSuggestionProps = {
  temperature: number;
  description: string;
};

const getWeatherCategories = (temperature: number, description: string): string[] => {
  const categories: string[] = [];
  
  // Catégories basées sur la température
  if (temperature <= 10) {
    categories.push("Hiver");
  } else if (temperature <= 20) {
    categories.push("Mi-saison");
  } else {
    categories.push("Été");
  }

  // Catégories basées sur les conditions météo
  const lowerDescription = description.toLowerCase();
  if (lowerDescription.includes("pluie") || lowerDescription.includes("rain")) {
    categories.push("Pluie");
  } else if (lowerDescription.includes("soleil") || lowerDescription.includes("sun") || lowerDescription.includes("clear")) {
    categories.push("Soleil");
  } else {
    categories.push("Intérieur");
  }

  return categories;
};

async function getClothesForCategory(userId: string, category: string, weatherCategories: string[]) {
  // D'abord, essayer de trouver des vêtements correspondant aux catégories météo
  let { data: clothes, error } = await supabase
    .from('clothes')
    .select('*')
    .eq('user_id', userId)
    .eq('archived', false)
    .eq('category', category)
    .contains('weather_categories', weatherCategories)
    .limit(3);

  if (error) {
    console.error(`Error fetching ${category}:`, error);
    return null;
  }

  // Si aucun vêtement correspondant n'est trouvé, retourner des vêtements par défaut
  if (!clothes || clothes.length === 0) {
    const { data: defaultClothes, error: defaultError } = await supabase
      .from('clothes')
      .select('*')
      .eq('user_id', userId)
      .eq('archived', false)
      .eq('category', category)
      .limit(3);

    if (defaultError) {
      console.error(`Error fetching default ${category}:`, defaultError);
      return null;
    }

    return { clothes: defaultClothes, isWeatherSpecific: false };
  }

  return { clothes, isWeatherSpecific: true };
}

export const WeatherOutfitSuggestion = ({ temperature, description }: WeatherOutfitSuggestionProps) => {
  const { data: suggestion, isLoading, error } = useQuery({
    queryKey: ["outfit-suggestion", temperature, description],
    queryFn: async () => {
      try {
        console.log("Fetching outfit suggestion for:", { temperature, description });
        
        // Vérifier l'authentification
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("User not authenticated");
          return "Vous devez être connecté pour obtenir des suggestions de tenues";
        }

        // Déterminer les catégories météo appropriées
        const weatherCategories = getWeatherCategories(temperature, description);
        console.log("Weather categories:", weatherCategories);

        // Récupérer les vêtements pour chaque catégorie
        const topsResult = await getClothesForCategory(user.id, 'Hauts', weatherCategories);
        const bottomsResult = await getClothesForCategory(user.id, 'Bas', weatherCategories);
        const shoesResult = await getClothesForCategory(user.id, 'Chaussures', weatherCategories);

        if (!topsResult && !bottomsResult && !shoesResult) {
          return "Une erreur est survenue lors de la récupération de vos vêtements";
        }

        // Formatage de la suggestion
        let suggestion = `Pour une température de ${temperature}°C et un temps ${description}, voici ce que je vous suggère :\n\n`;

        if (topsResult?.clothes && topsResult.clothes.length > 0) {
          suggestion += `Hauts${topsResult.isWeatherSpecific ? ' (adaptés à la météo)' : ''} :\n`;
          suggestion += topsResult.clothes.map(top => `- ${top.name}${top.brand ? ` (${top.brand})` : ''}`).join('\n');
          suggestion += "\n\n";
        }

        if (bottomsResult?.clothes && bottomsResult.clothes.length > 0) {
          suggestion += `Bas${bottomsResult.isWeatherSpecific ? ' (adaptés à la météo)' : ''} :\n`;
          suggestion += bottomsResult.clothes.map(bottom => `- ${bottom.name}${bottom.brand ? ` (${bottom.brand})` : ''}`).join('\n');
          suggestion += "\n\n";
        }

        if (shoesResult?.clothes && shoesResult.clothes.length > 0) {
          suggestion += `Chaussures${shoesResult.isWeatherSpecific ? ' (adaptées à la météo)' : ''} :\n`;
          suggestion += shoesResult.clothes.map(shoe => `- ${shoe.name}${shoe.brand ? ` (${shoe.brand})` : ''}`).join('\n');
        }

        console.log("Generated suggestion:", suggestion);
        return suggestion;
      } catch (error) {
        console.error("Error in outfit suggestion query:", error);
        return "Une erreur est survenue lors de la génération de la suggestion";
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
        <Skeleton className="h-20 w-full" />
      </Card>
    );
  }

  if (error) {
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

  if (!suggestion) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Suggestion de tenue</h2>
      </div>
      <p className="text-muted-foreground whitespace-pre-line">{suggestion}</p>
    </Card>
  );
};

