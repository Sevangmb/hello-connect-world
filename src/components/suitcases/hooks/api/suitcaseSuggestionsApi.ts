
import { supabase } from "@/integrations/supabase/client";
import type { ClothesItem } from "@/components/clothes/types";
import type { SuggestedClothesItem, SuggestionResponse } from "../types/suitcaseSuggestionsTypes";

/**
 * Fetch existing items in a suitcase
 */
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

/**
 * Fetch all clothes belonging to the authenticated user
 */
export const fetchUserClothes = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Utilisateur non authentifié");

  const { data, error } = await supabase
    .from("clothes")
    .select("id, name, category, weather_categories, color, style")
    .eq("user_id", user.id)
    .eq("archived", false);

  if (error) throw error;
  return data;
};

/**
 * Get AI suggestions using Edge function
 */
export const getAISuggestions = async (
  startDate: Date, 
  endDate: Date, 
  existingItems: any[], 
  availableClothes: any[]
): Promise<SuggestionResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke("get-suitcase-suggestions", {
      body: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        currentClothes: existingItems?.map(item => ({
          id: item.clothes?.id,
          name: item.clothes?.name,
          category: item.clothes?.category
        })) || [],
        availableClothes: availableClothes
      }
    });

    if (error) throw error;

    if (data && data.suggestedClothes) {
      return {
        suggestedClothes: data.suggestedClothes,
        explanation: data.explanation || "Voici quelques suggestions basées sur votre collection."
      };
    } else {
      throw new Error("Format de réponse invalide");
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Generate basic suggestions as a fallback method
 */
export const generateBasicSuggestions = (
  availableClothes: any[], 
  existingItems: any[]
): SuggestionResponse => {
  const categories = ["Hauts", "Bas", "Chaussures", "Accessoires"];
  const suggestedItems: SuggestedClothesItem[] = [];
  
  for (const category of categories) {
    // Vérifier si la catégorie est déjà présente dans la valise
    const hasCategoryInSuitcase = existingItems?.some(item => item.clothes?.category === category);
    
    if (!hasCategoryInSuitcase) {
      // Trouver un vêtement disponible dans cette catégorie
      const clothForCategory = availableClothes.find(cloth => cloth.category === category);
      if (clothForCategory) {
        suggestedItems.push({
          id: clothForCategory.id,
          name: clothForCategory.name,
          category: clothForCategory.category
        });
      }
    }
  }
  
  return {
    suggestedClothes: suggestedItems,
    explanation: "Voici quelques suggestions basées sur les catégories manquantes dans votre valise."
  };
};

/**
 * Add suggested clothes to a suitcase
 */
export const addClothesToSuitcase = async (suitcaseId: string, suggestedClothes: SuggestedClothesItem[]) => {
  if (!suitcaseId || suggestedClothes.length === 0) {
    throw new Error("Aucun vêtement à ajouter");
  }
  
  // Préparer les données pour l'insertion
  const itemsToInsert = suggestedClothes.map(item => ({
    suitcase_id: suitcaseId,
    clothes_id: item.id,
    quantity: 1
  }));

  // Insérer les vêtements suggérés
  const { error } = await supabase
    .from("suitcase_items")
    .insert(itemsToInsert);

  if (error) throw error;
};
