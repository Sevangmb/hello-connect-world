
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, RefreshCw, Shirt, Footprints, ShoppingBag } from "lucide-react";
import { ClothingItemCard } from "./components/ClothingItemCard";
import { useOutfitSuggestion } from "./hooks/useOutfitSuggestion";
import type { WeatherOutfitSuggestionProps } from "./types/weather";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const WeatherOutfitSuggestion = ({ temperature, description }: WeatherOutfitSuggestionProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: suggestion, isLoading, error, refetch } = useOutfitSuggestion(temperature, description);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Invalider le cache et relancer la requête
    queryClient.invalidateQueries({
      queryKey: ["outfit-suggestion", temperature, description]
    });
    
    toast({
      title: "Actualisation en cours",
      description: "Nous générons une nouvelle suggestion de tenue pour vous.",
    });
    
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
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
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
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

  // Formatage amélioré du temps
  const formatWeatherDescription = (desc: string) => {
    return desc.charAt(0).toLowerCase() + desc.slice(1);
  };

  return (
    <Card className="p-6 overflow-hidden relative">
      {/* Élément décoratif */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/5 -z-10" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-primary/5 -z-10" />
      
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
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>
      
      <p className="text-muted-foreground mb-4">
        Pour une température de <span className="font-medium">{suggestion.temperature}°C</span> et un temps <span className="font-medium">{formatWeatherDescription(suggestion.description)}</span>
      </p>
      
      {suggestion.explanation && (
        <div className="mb-6 text-sm bg-muted/50 p-4 rounded-lg border border-muted">
          <p className="italic">{suggestion.explanation}</p>
        </div>
      )}
      
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Shirt className="h-4 w-4 text-primary" />
          <h3 className="font-medium">Votre tenue recommandée</h3>
        </div>
        <Separator className="mb-4" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ClothingItemCard type="top" item={suggestion.top} />
        <ClothingItemCard type="bottom" item={suggestion.bottom} />
        <ClothingItemCard type="shoes" item={suggestion.shoes} />
      </div>
      
      <div className="mt-6 pt-4 border-t border-muted">
        <p className="text-xs text-muted-foreground text-center">
          Les suggestions sont basées sur votre garde-robe et les conditions météorologiques actuelles.
          <br />Ajoutez plus de vêtements à votre collection pour des suggestions plus variées.
        </p>
      </div>
    </Card>
  );
};
