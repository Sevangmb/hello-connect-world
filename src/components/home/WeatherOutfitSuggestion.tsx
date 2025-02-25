
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";
import { ClothingItemCard } from "./components/ClothingItemCard";
import { useOutfitSuggestion } from "./hooks/useOutfitSuggestion";
import type { WeatherOutfitSuggestionProps } from "./types/weather";

export const WeatherOutfitSuggestion = ({ temperature, description }: WeatherOutfitSuggestionProps) => {
  const { data: suggestion, isLoading, error } = useOutfitSuggestion(temperature, description);

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
        <ClothingItemCard type="top" item={suggestion.top} />
        <ClothingItemCard type="bottom" item={suggestion.bottom} />
        <ClothingItemCard type="shoes" item={suggestion.shoes} />
      </div>
    </Card>
  );
};

