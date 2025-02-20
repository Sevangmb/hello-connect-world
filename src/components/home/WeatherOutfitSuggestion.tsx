
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
  
  // Catégories basées sur la saison/température
  if (temperature < 5) {
    categories.push("Hiver");
  } else if (temperature < 15) {
    categories.push("Mi-saison");
  } else if (temperature < 25) {
    categories.push("Été");
  }

  // Catégories basées sur les conditions météo
  const lowerDescription = description.toLowerCase();
  if (lowerDescription.includes("pluie") || lowerDescription.includes("rain")) {
    categories.push("Pluie");
  } else if (lowerDescription.includes("soleil") || lowerDescription.includes("sun") || lowerDescription.includes("clear")) {
    categories.push("Soleil");
  } else {
    categories.push("Intérieur"); // Par défaut, suggestion pour l'intérieur
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
        if (!user) {
          console.log("User not authenticated");
          return "Vous devez être connecté pour obtenir des suggestions de tenues";
        }

        // Déterminer les catégories météo appropriées
        const weatherCategories = getWeatherCategories(temperature, description);
        console.log("Weather categories:", weatherCategories);

        // Récupérer les vêtements appropriés par catégorie
        const { data: tops, error: topsError } = await supabase
          .from('clothes')
          .select('*')
          .eq('user_id', user.id)
          .eq('archived', false)
          .eq('category', 'Hauts')
          .overlaps('weather_categories', weatherCategories)
          .limit(3);

        const { data: bottoms, error: bottomsError } = await supabase
          .from('clothes')
          .select('*')
          .eq('user_id', user.id)
          .eq('archived', false)
          .eq('category', 'Bas')
          .overlaps('weather_categories', weatherCategories)
          .limit(3);

        const { data: shoes, error: shoesError } = await supabase
          .from('clothes')
          .select('*')
          .eq('user_id', user.id)
          .eq('archived', false)
          .eq('category', 'Chaussures')
          .overlaps('weather_categories', weatherCategories)
          .limit(3);

        if (topsError || bottomsError || shoesError) {
          console.error("Error fetching clothes:", { topsError, bottomsError, shoesError });
          return "Une erreur est survenue lors de la récupération de vos vêtements";
        }

        console.log("Found clothes:", { tops, bottoms, shoes });

        if ((!tops || tops.length === 0) && (!bottoms || bottoms.length === 0) && (!shoes || shoes.length === 0)) {
          return `Je n'ai pas trouvé de vêtements adaptés pour une température de ${temperature}°C et un temps ${description}.\n\nPensez à mettre à jour les catégories météo de vos vêtements pour obtenir des suggestions plus pertinentes !`;
        }

        // Formatage de la suggestion
        let suggestion = `Pour une température de ${temperature}°C et un temps ${description}, voici ce que je vous suggère:\n\n`;

        if (tops && tops.length > 0) {
          suggestion += "Hauts :\n";
          suggestion += tops.map(top => `- ${top.name}${top.brand ? ` (${top.brand})` : ''}`).join('\n');
          suggestion += "\n\n";
        }

        if (bottoms && bottoms.length > 0) {
          suggestion += "Bas :\n";
          suggestion += bottoms.map(bottom => `- ${bottom.name}${bottom.brand ? ` (${bottom.brand})` : ''}`).join('\n');
          suggestion += "\n\n";
        }

        if (shoes && shoes.length > 0) {
          suggestion += "Chaussures :\n";
          suggestion += shoes.map(shoe => `- ${shoe.name}${shoe.brand ? ` (${shoe.brand})` : ''}`).join('\n');
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

