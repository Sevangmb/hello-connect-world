
import { supabase } from "@/integrations/supabase/client";
import type { ClothesItem } from "@/components/clothes/types";
import type { SuggestedClothesItem, SuggestionResponse } from "./types";

export const fetchExistingItems = async (suitcaseId: string) => {
  const { data, error } = await supabase
    .from("suitcase_items")
    .select(`
      id, clothes_id,
      clothes ( id, name, category )
    `)
    .eq("suitcase_id", suitcaseId);
    
  if (error) throw error;
  return data;
};

export const fetchUserClothes = async (): Promise<ClothesItem[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Utilisateur non authentifié");

  const { data, error } = await supabase
    .from("clothes")
    .select("id, name, category, weather_categories, color, style, image_url")
    .eq("user_id", user.id)
    .eq("archived", false);

  if (error) throw error;
  return data;
};

export const getAISuggestions = async (
  startDate: Date, 
  endDate: Date, 
  existingItems: any[], 
  availableClothes: ClothesItem[]
): Promise<SuggestionResponse> => {
  const payload = {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    currentClothes: existingItems?.map(formatClothesForAI) || [],
    availableClothes: availableClothes
  };

  const { data, error } = await supabase.functions.invoke("get-suitcase-suggestions", {
    body: payload
  });

  if (error) throw error;
  return validateAndFormatAIResponse(data);
};

const formatClothesForAI = (item: any) => ({
  id: item.clothes?.id,
  name: item.clothes?.name,
  category: item.clothes?.category
});

const validateAndFormatAIResponse = (data: any): SuggestionResponse => {
  if (data && data.suggestedClothes) {
    return {
      suggestedClothes: data.suggestedClothes,
      explanation: data.explanation || "Voici quelques suggestions basées sur votre collection."
    };
  }
  throw new Error("Format de réponse invalide");
};

export const generateBasicSuggestions = (
  availableClothes: ClothesItem[], 
  existingItems: any[]
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

const hasItemInCategory = (items: any[], category: string): boolean => {
  return items?.some(item => item.clothes?.category === category);
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

export const addClothesToSuitcase = async (
  suitcaseId: string, 
  suggestedClothes: SuggestedClothesItem[]
) => {
  if (!suitcaseId || suggestedClothes.length === 0) {
    throw new Error("Aucun vêtement à ajouter");
  }
  
  const itemsToInsert = suggestedClothes.map(item => ({
    suitcase_id: suitcaseId,
    clothes_id: item.id,
    quantity: 1
  }));

  const { error } = await supabase
    .from("suitcase_items")
    .insert(itemsToInsert);

  if (error) throw error;
};
