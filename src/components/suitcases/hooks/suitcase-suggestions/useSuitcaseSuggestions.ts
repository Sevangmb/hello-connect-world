
import { 
  fetchExistingItems, 
  fetchUserClothes, 
  getAISuggestions, 
  generateBasicSuggestions,
  addClothesToSuitcase
} from "./api";
import { useSuitcaseSuggestionsState } from "./state";
import type { SuitcaseSuggestionsHookReturn } from "./types";

export const useSuitcaseSuggestions = (suitcaseId: string): SuitcaseSuggestionsHookReturn => {
  const {
    suggestedClothes,
    aiExplanation,
    isGettingSuggestions,
    isAddingSuggestions,
    showSuggestionsDialog,
    error,
    setIsGettingSuggestions,
    setIsAddingSuggestions,
    setShowSuggestionsDialog,
    setError,
    resetSuggestionsState,
    updateSuggestionsState,
    toast,
    queryClient
  } = useSuitcaseSuggestionsState();

  const getSuggestions = async (startDate: Date, endDate: Date) => {
    if (!suitcaseId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "ID de valise manquant",
      });
      return;
    }
    
    if (!startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Dates de début et de fin manquantes",
      });
      return;
    }

    setIsGettingSuggestions(true);
    resetSuggestionsState();

    try {
      const existingItems = await fetchExistingItems(suitcaseId);
      const userClothes = await fetchUserClothes();

      const existingClothesIds = existingItems?.map(item => item.clothes_id) || [];
      const availableClothes = userClothes.filter(cloth => !existingClothesIds.includes(cloth.id));

      if (availableClothes.length === 0) {
        updateSuggestionsState([], "Vous avez déjà ajouté tous vos vêtements à cette valise.");
        return;
      }

      try {
        const { suggestedClothes, explanation } = await getAISuggestions(
          startDate, 
          endDate, 
          existingItems, 
          availableClothes
        );
        
        updateSuggestionsState(suggestedClothes, explanation);
      } catch (edgeFunctionError) {
        console.error("Erreur avec la fonction Edge, utilisation de la méthode de secours:", edgeFunctionError);
        
        const { suggestedClothes, explanation } = generateBasicSuggestions(availableClothes, existingItems);
        updateSuggestionsState(suggestedClothes, explanation);
      }
    } catch (e: any) {
      console.error("Erreur lors de la récupération des suggestions:", e);
      setError(e.message || "Impossible de récupérer les suggestions");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: e.message || "Impossible de récupérer les suggestions",
      });
    } finally {
      setIsGettingSuggestions(false);
    }
  };

  const addSuggestedClothes = async () => {
    if (!suitcaseId || suggestedClothes.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Aucun vêtement à ajouter",
      });
      return;
    }
    
    setIsAddingSuggestions(true);
    setError(null);

    try {
      await addClothesToSuitcase(suitcaseId, suggestedClothes);

      toast({
        title: "Vêtements ajoutés",
        description: `${suggestedClothes.length} vêtements ont été ajoutés à la valise`,
      });

      setShowSuggestionsDialog(false);
      resetSuggestionsState();
      queryClient.invalidateQueries({ queryKey: ["suitcase-items", suitcaseId] });
    } catch (e: any) {
      console.error("Erreur lors de l'ajout des vêtements suggérés:", e);
      setError(e.message || "Impossible d'ajouter les vêtements suggérés");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: e.message || "Impossible d'ajouter les vêtements suggérés",
      });
    } finally {
      setIsAddingSuggestions(false);
    }
  };

  return {
    suggestedClothes,
    aiExplanation,
    isGettingSuggestions,
    isAddingSuggestions,
    showSuggestionsDialog,
    setShowSuggestionsDialog,
    error,
    getSuggestions,
    addSuggestedClothes,
  };
};
