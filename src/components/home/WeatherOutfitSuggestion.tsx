
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, RefreshCw } from "lucide-react";
import { ClothingItemCard } from "./components/ClothingItemCard";
import { useOutfitSuggestion } from "./hooks/useOutfitSuggestion";
import type { WeatherOutfitSuggestionProps } from "./types/weather";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

export const WeatherOutfitSuggestion = ({ temperature, description }: WeatherOutfitSuggestionProps) => {
  const queryClient = useQueryClient();
  const { data: suggestion, isLoading, error, refetch } = useOutfitSuggestion(temperature, description);

  const handleRefresh = () => {
    // Invalider le cache et relancer la requête
    queryClient.invalidateQueries({
      queryKey: ["outfit-suggestion", temperature, description]
    });
    refetch();
  };

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Suggestion de tenue</h2>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        </div>
      </Card>
    );
  }

  if (error || !suggestion) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-destructive" />
            <h2 className="text-xl font-semibold">Suggestion de tenue</h2>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </Button>
        </div>
        <div className="text-destructive p-4 bg-destructive/10 rounded-lg">
          <p className="font-medium mb-1">Impossible de générer une suggestion</p>
          <p className="text-sm">
            {error instanceof Error 
              ? error.message.includes("No clothes available")
                ? "Veuillez d'abord ajouter des vêtements à votre garde-robe."
                : error.message.includes("User not authenticated")
                ? "Veuillez vous connecter pour voir les suggestions."
                : "Une erreur technique est survenue. Veuillez réessayer plus tard."
              : "Impossible de générer une suggestion pour le moment."}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Suggestion de tenue</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </Button>
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
