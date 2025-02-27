
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
        
        // Vérifier si l'utilisateur est connecté
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

        // Vérifier s'il existe déjà une suggestion récente
        const { existingSuggestion, suggestionError } = await fetchExistingSuggestion(user.id, temperature, description);
        
        if (!suggestionError && existingSuggestion?.outfits) {
          console.log("Using existing suggestion:", existingSuggestion);
          
          return {
            top: existingSuggestion.outfits.top,
            bottom: existingSuggestion.outfits.bottom,
            shoes: existingSuggestion.outfits.shoes,
            explanation: existingSuggestion.outfits.description || 
              `Pour ${temperature}°C avec un temps ${description}, cette tenue est appropriée.`,
            temperature,
            description
          } as OutfitSuggestion;
        }

        // Récupérer les vêtements de l'utilisateur
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

        // Générer une nouvelle suggestion avec l'IA
        const { suggestion, error: aiError } = await generateAISuggestion(
          clothes,
          temperature,
          description
        );

        if (aiError || !suggestion) {
          throw aiError || new Error("Failed to generate suggestion");
        }

        // Enregistrer la suggestion dans la base de données
        const { outfit, error: saveError } = await createOutfitWithSuggestion(
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
          throw saveError;
        }

        // Retourner la suggestion avec les informations détaillées sur la tenue
        return {
          top: outfit?.top || null,
          bottom: outfit?.bottom || null,
          shoes: outfit?.shoes || null,
          explanation: suggestion.explanation,
          temperature,
          description
        } as OutfitSuggestion;

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
