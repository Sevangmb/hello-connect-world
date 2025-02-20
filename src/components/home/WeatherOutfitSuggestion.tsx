
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type WeatherOutfitSuggestionProps = {
  temperature: number;
  description: string;
};

const getWeatherCategory = (temperature: number, description: string): string[] => {
  const categories: string[] = [];
  
  // Catégories basées sur la température
  if (temperature < 10) {
    categories.push("froid");
  } else if (temperature < 20) {
    categories.push("tempéré");
  } else {
    categories.push("chaud");
  }

  // Catégories basées sur la description météo
  const lowerDescription = description.toLowerCase();
  if (lowerDescription.includes("pluie") || lowerDescription.includes("rain")) {
    categories.push("pluie");
  } else if (lowerDescription.includes("neige") || lowerDescription.includes("snow")) {
    categories.push("neige");
  }

  return categories;
};

export const WeatherOutfitSuggestion = ({ temperature, description }: WeatherOutfitSuggestionProps) => {
  const { data: suggestion, isLoading, error } = useQuery({
    queryKey: ["outfit-suggestion", temperature, description],
    queryFn: async () => {
      try {
        console.log("Fetching outfit suggestion for:", { temperature, description });
        
        // Vérifier l'authentification
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Vous devez être connecté pour obtenir des suggestions de tenues");

        // Déterminer les catégories météo appropriées
        const weatherCategories = getWeatherCategory(temperature, description);
        console.log("Weather categories:", weatherCategories);

        // Récupérer les vêtements appropriés
        const { data: clothes, error: clothesError } = await supabase
          .from('clothes')
          .select('*')
          .eq('user_id', user.id)
          .eq('archived', false)
          .overlaps('weather_categories', weatherCategories)
          .limit(5);

        if (clothesError) throw clothesError;

        if (!clothes || clothes.length === 0) {
          return "Je n'ai pas trouvé de vêtements adaptés à cette météo dans votre garde-robe. Pensez à mettre à jour les catégories météo de vos vêtements !";
        }

        // Formatage de la suggestion
        const suggestion = `Pour une température de ${temperature}°C et un temps ${description}, voici ce que je vous suggère:\n\n` +
          clothes.map(cloth => `- ${cloth.name} (${cloth.category})`).join('\n');

        console.log("Generated suggestion:", suggestion);
        return suggestion;
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
