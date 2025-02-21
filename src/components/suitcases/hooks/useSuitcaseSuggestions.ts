
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
  const [isAddingSuggestions, setIsAddingSuggestions] = useState(false);
  const [suggestedClothes, setSuggestedClothes] = useState<SuggestedClothing[]>([]);
  const [showSuggestionsDialog, setShowSuggestionsDialog] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [error, setError] = useState<string | null>(null);
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
    setError(null);

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
    } catch (e: any) {
      console.error("Error getting suggestions:", e);
      const errorMessage = e.message || "Impossible d'obtenir les suggestions";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage,
      });
    } finally {
      setIsGettingSuggestions(false);
    }
  };

  const addSuggestedClothes = async () => {
    setIsAddingSuggestions(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from("suitcase_items")
        .insert(
          suggestedClothes.map(cloth => ({
            suitcase_id: suitcaseId,
            clothes_id: cloth.id,
          }))
        );

      if (insertError) throw insertError;

      await queryClient.invalidateQueries({ queryKey: ["suitcase-items", suitcaseId] });
      toast({
        title: "Suggestions ajoutées",
        description: `${suggestedClothes.length} vêtements ont été ajoutés à votre valise.`,
      });
      setShowSuggestionsDialog(false);
      setSuggestedClothes([]);
    } catch (e: any) {
      console.error("Error adding suggested clothes:", e);
      const errorMessage = e.message || "Impossible d'ajouter les vêtements suggérés";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage,
      });
    } finally {
      setIsAddingSuggestions(false);
    }
  };

  return {
    isGettingSuggestions,
    isAddingSuggestions,
    suggestedClothes,
    showSuggestionsDialog,
    setShowSuggestionsDialog,
    aiExplanation,
    error,
    getSuggestions,
    addSuggestedClothes,
  };
};
