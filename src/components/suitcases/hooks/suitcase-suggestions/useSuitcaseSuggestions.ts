
import { useState } from 'react';
import { useSuitcaseItems } from '@/hooks/useSuitcaseItems';
import { useClothes } from '@/hooks/useClothes';
import { useSuggestionsApi } from './api';
import { useSuitcaseItemsManager } from '../suitcase-items/useSuitcaseItemsManager';
import type { SuitcaseSuggestionsHookReturn, SuggestedClothesItem } from './types';

export const useSuitcaseSuggestions = (suitcaseId: string): SuitcaseSuggestionsHookReturn => {
  const [isGettingSuggestions, setIsGettingSuggestions] = useState(false);
  const [suggestedClothes, setSuggestedClothes] = useState<SuggestedClothesItem[]>([]);
  const [showSuggestionsDialog, setShowSuggestionsDialog] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const { data: suitcaseItems } = useSuitcaseItems(suitcaseId);
  const { data: allClothes } = useClothes({ source: "mine" });
  const { isAddingBulk: isAddingSuggestions, addMultipleItems } = useSuitcaseItemsManager(suitcaseId);
  const { getSuitcaseSuggestions, toast } = useSuggestionsApi();

  const getSuggestions = async (startDate: Date, endDate: Date) => {
    if (!suitcaseId || !allClothes) return;
    
    setIsGettingSuggestions(true);
    setError(null);
    
    try {
      console.log("Demande de suggestions pour la valise:", suitcaseId);
      console.log("Dates:", startDate, endDate);
      
      // Extract current clothes in the suitcase
      const currentClothes = suitcaseItems?.map(item => ({
        id: item.clothes_id,
        name: item.clothes.name,
        category: item.clothes.category
      })) || [];

      // Extract available clothes (not in the suitcase)
      const suitcaseClothesIds = new Set(currentClothes.map(item => item.id));
      const availableClothes = allClothes.filter(cloth => !suitcaseClothesIds.has(cloth.id));

      console.log("Vêtements actuels:", currentClothes);
      console.log("Vêtements disponibles:", availableClothes.length);

      // Get suggestions
      const { suggestedClothes, explanation } = await getSuitcaseSuggestions(
        startDate,
        endDate,
        currentClothes,
        availableClothes
      );

      console.log("Suggestions reçues:", suggestedClothes);
      console.log("Explication:", explanation);

      // Update state
      setSuggestedClothes(suggestedClothes);
      setAiExplanation(explanation);
      setShowSuggestionsDialog(true);
    } catch (error: any) {
      console.error("Erreur lors de l'obtention des suggestions:", error);
      setError(error.message || "Impossible d'obtenir des suggestions pour cette valise");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible d'obtenir des suggestions pour cette valise",
      });
    } finally {
      setIsGettingSuggestions(false);
    }
  };

  const addSuggestedClothes = async (clothesIds: string[]) => {
    if (!clothesIds.length) return;
    
    console.log("Ajout des vêtements suggérés:", clothesIds);
    
    try {
      await addMultipleItems(clothesIds);
      toast({
        title: "Succès",
        description: "Les vêtements suggérés ont été ajoutés à votre valise",
      });
    } catch (error: any) {
      console.error("Erreur lors de l'ajout des vêtements suggérés:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible d'ajouter les vêtements suggérés",
      });
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
