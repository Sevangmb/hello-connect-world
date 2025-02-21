
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

type SuggestedClothing = {
  id: string;
  name: string;
  category: string;
};

export const useSuitcaseSuggestions = (suitcaseId: string) => {
  const [isGettingSuggestions, setIsGettingSuggestions] = useState(false);
  const [suggestedClothes, setSuggestedClothes] = useState<SuggestedClothing[]>([]);
  const [showSuggestionsDialog, setShowSuggestionsDialog] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getSuggestions = async (startDate: Date, endDate: Date) => {
    if (!startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les dates de début et de fin sont requises pour obtenir des suggestions",
      });
      return;
    }

    setIsGettingSuggestions(true);
    try {
      const { data: existingItems, error: existingItemsError } = await supabase
        .from("suitcase_items")
        .select(`
          *,
          clothes ( id, name, category )
        `)
        .eq("suitcase_id", suitcaseId);
      if (existingItemsError) throw existingItemsError;

      const { data, error } = await supabase.functions.invoke("get-suitcase-suggestions", {
        body: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          currentClothes: existingItems?.map(item => item.clothes),
        },
      });

      if (error) throw error;

      if (!data?.explanation || !data?.suggestedClothes) {
        throw new Error("La réponse ne contient pas les informations nécessaires");
      }

      const { data: clothesDetails, error: clothesError } = await supabase
        .from("clothes")
        .select("id, name, category")
        .in("id", data.suggestedClothes);

      if (clothesError) throw clothesError;

      const existingIds = new Set(existingItems?.map(item => item.clothes_id));
      const newSuggestions = clothesDetails?.filter(cloth => !existingIds.has(cloth.id)) || [];

      setSuggestedClothes(newSuggestions);
      setAiExplanation(data.explanation);
      setShowSuggestionsDialog(true);
    } catch (error: any) {
      console.error("Error getting suggestions:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'obtenir les suggestions",
      });
    } finally {
      setIsGettingSuggestions(false);
    }
  };

  const addSuggestedClothes = async () => {
    try {
      const { error } = await supabase
        .from("suitcase_items")
        .insert(
          suggestedClothes.map(cloth => ({
            suitcase_id: suitcaseId,
            clothes_id: cloth.id,
          }))
        );

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["suitcase-items", suitcaseId] });
      toast({
        title: "Suggestions ajoutées",
        description: `${suggestedClothes.length} vêtements ont été ajoutés à votre valise.`,
      });
      setShowSuggestionsDialog(false);
      setSuggestedClothes([]);
    } catch (error) {
      console.error("Error adding suggested clothes:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter les vêtements suggérés",
      });
    }
  };

  return {
    isGettingSuggestions,
    suggestedClothes,
    showSuggestionsDialog,
    setShowSuggestionsDialog,
    aiExplanation,
    getSuggestions,
    addSuggestedClothes,
  };
};
