
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { OutfitSuggestion } from "../types/weather";
import { fetchExistingSuggestion, fetchUserClothes, createOutfitWithSuggestion } from "./outfit-suggestion/api";
import { generateAISuggestion } from "./outfit-suggestion/aiService";

export const useOutfitSuggestion = (temperature: number, description: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["outfit-suggestion", temperature, description],
    queryFn: async () => {
      try {
        console.log("Fetching outfit suggestion for:", { temperature, description });
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("User not authenticated");
          toast({
            variant: "destructive",
            title: "Non connecté",
            description: "Vous devez être connecté pour voir les suggestions de tenues."
          });
          throw new Error("User not authenticated");
        }

        // Check for existing recent suggestion
        const { existingSuggestion, suggestionError } = await fetchExistingSuggestion(user.id, temperature, description);
        
        console.log("Existing suggestion query result:", existingSuggestion);
        
        if (!suggestionError && existingSuggestion?.outfits) {
          console.log("Using existing suggestion:", existingSuggestion);
          
          const topItem = existingSuggestion.outfits.top || null;
          const bottomItem = existingSuggestion.outfits.bottom || null;
          const shoesItem = existingSuggestion.outfits.shoes || null;
          
          return {
            top: topItem,
            bottom: bottomItem,
            shoes: shoesItem,
            explanation: `Pour ${temperature}°C avec un temps ${description}, ${existingSuggestion.outfits.description || 'cette tenue est appropriée.'}`,
            temperature,
            description
          } as OutfitSuggestion;
        }

        // If no recent suggestion exists, fetch user's clothes
        const { data: clothes, error: clothesError } = await fetchUserClothes(user.id);

        if (clothesError) {
          console.error("Error fetching clothes:", clothesError);
          throw clothesError;
        }

        if (!clothes || clothes.length === 0) {
          toast({
            variant: "destructive",
            title: "Aucun vêtement",
            description: "Vous devez d'abord ajouter des vêtements à votre garde-robe."
          });
          throw new Error("No clothes available");
        }

        // Generate new AI suggestion
        const { suggestion, error: aiError } = await generateAISuggestion(
          clothes,
          temperature,
          description
        );

        if (aiError || !suggestion) {
          throw aiError || new Error("Failed to generate suggestion");
        }

        // Save the suggestion to the database
        if (suggestion.top || suggestion.bottom || suggestion.shoes) {
          const { error: saveError } = await createOutfitWithSuggestion(
            user.id,
            temperature,
            description,
            suggestion.explanation,
            suggestion.top?.id || null,
            suggestion.bottom?.id || null,
            suggestion.shoes?.id || null
          );

          if (saveError) {
            console.error("Error saving suggestion:", saveError);
          }
        }

        // Invalidate outfits queries to force a refresh
        queryClient.invalidateQueries({ queryKey: ["outfits"] });

        return suggestion;
      } catch (error) {
        console.error("Error in outfit suggestion query:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la génération de la suggestion."
        });
        throw error;
      }
    },
    enabled: Boolean(temperature) && Boolean(description),
    retry: 1,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};
