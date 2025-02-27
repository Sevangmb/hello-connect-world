
import { useToast } from "@/hooks/use-toast";
import type { ClothesItem } from "@/components/clothes/types";
import type { SuggestedClothesItem, SuggestionResponse } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const useSuggestionsApi = () => {
  const { toast } = useToast();

  const getSuitcaseSuggestions = async (
    startDate: Date,
    endDate: Date,
    currentClothes: SuggestedClothesItem[],
    availableClothes: ClothesItem[]
  ): Promise<SuggestionResponse> => {
    try {
      const payload = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        currentClothes: currentClothes,
        availableClothes: availableClothes
      };

      const { data, error } = await supabase.functions.invoke("get-suitcase-suggestions", {
        body: payload
      });

      if (error) throw error;
      
      return validateAndFormatAIResponse(data);
    } catch (error: any) {
      console.error("Erreur lors de l'obtention des suggestions:", error);
      // Générer des suggestions basiques en cas d'erreur
      return generateBasicSuggestions(availableClothes, currentClothes);
    }
  };

  return {
    getSuitcaseSuggestions,
    toast
  };
};

// Fonctions utilitaires
const validateAndFormatAIResponse = (data: any): SuggestionResponse => {
  if (data && data.suggestedClothes) {
    return {
      suggestedClothes: data.suggestedClothes,
      explanation: data.explanation || "Voici quelques suggestions basées sur votre collection."
    };
  }
  throw new Error("Format de réponse invalide");
};

const generateBasicSuggestions = (
  availableClothes: ClothesItem[], 
  existingItems: SuggestedClothesItem[]
): SuggestionResponse => {
  const essentialCategories = ["Hauts", "Bas", "Chaussures", "Accessoires"];
  const suggestedItems: SuggestedClothesItem[] = [];
  
  for (const category of essentialCategories) {
    if (!hasItemInCategory(existingItems, category)) {
      const suggestedItem = findAvailableItemInCategory(availableClothes, category);
      if (suggestedItem) {
        suggestedItems.push(suggestedItem);
      }
    }
  }
  
  return {
    suggestedClothes: suggestedItems,
    explanation: "Voici quelques suggestions basées sur les catégories manquantes dans votre valise."
  };
};

const hasItemInCategory = (items: SuggestedClothesItem[], category: string): boolean => {
  return items?.some(item => item.category === category);
};

const findAvailableItemInCategory = (
  availableClothes: ClothesItem[], 
  category: string
): SuggestedClothesItem | undefined => {
  const clothForCategory = availableClothes.find(cloth => cloth.category === category);
  if (clothForCategory) {
    return {
      id: clothForCategory.id,
      name: clothForCategory.name,
      category: clothForCategory.category
    };
  }
  return undefined;
};
