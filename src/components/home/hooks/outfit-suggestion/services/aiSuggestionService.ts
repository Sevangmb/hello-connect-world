
import { supabase } from "@/integrations/supabase/client";
import { 
  categorizeClothes, 
  handleMissingCategories
} from "../utils/clothingCategorization";
import { exponentialDelay, generateFallbackSuggestion } from "../utils/errorHandling";
import { ClothingItem, AISuggestionResponse, SuggestionResult } from "../types/aiTypes";
import { processAIResponse } from "../utils/responseProcessor";

/**
 * Génère une suggestion d'habits basée sur l'IA en prenant en compte la météo
 */
export const generateAISuggestion = async (
  clothes: ClothingItem[],
  temperature: number,
  description: string,
  useMistral: boolean = true,
  maxRetries = 3,
  condition?: 'clear' | 'rain' | 'clouds' | 'snow' | 'extreme' | 'other',
  windSpeed?: number,
  humidity?: number
): Promise<SuggestionResult> => {
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Tentative ${attempt + 1} de génération de suggestion avec ${useMistral ? 'Mistral' : 'autre modèle'}`);
      console.log(`Envoi de ${clothes.length} vêtements à l'API`);
      console.log(`Conditions météo: ${temperature}°C, ${description}, ${condition || 'non spécifié'}`);
      
      // Catégorisation des vêtements
      const categorizedClothes = categorizeClothes(clothes);

      console.log("Vêtements catégorisés:", {
        tops: categorizedClothes.tops.length,
        bottoms: categorizedClothes.bottoms.length,
        shoes: categorizedClothes.shoes.length
      });

      // Gestion des catégories manquantes
      const finalCategorizedClothes = handleMissingCategories(categorizedClothes, clothes);

      // Vérification des catégories essentielles
      if (finalCategorizedClothes.tops.length === 0 || 
          finalCategorizedClothes.bottoms.length === 0 || 
          finalCategorizedClothes.shoes.length === 0) {
        
        // Générer une liste des catégories manquantes pour un message d'erreur plus informatif
        const missingCategories = [];
        if (finalCategorizedClothes.tops.length === 0) missingCategories.push("hauts");
        if (finalCategorizedClothes.bottoms.length === 0) missingCategories.push("bas");
        if (finalCategorizedClothes.shoes.length === 0) missingCategories.push("chaussures");
        
        throw new Error(`Vous n'avez pas assez de vêtements dans certaines catégories (${missingCategories.join(", ")}) pour générer une suggestion`);
      }
      
      // Préparation des données météo enrichies
      const weatherData = {
        temperature,
        description,
        condition: condition || determineConditionFromDescription(description),
        windSpeed,
        humidity
      };
      
      // Appel de la fonction Edge de Supabase appropriée selon le modèle choisi
      const { data: aiSuggestion, error: aiError } = await supabase.functions.invoke(
        useMistral ? 'generate-mistral-suggestion' : 'generate-outfit-suggestion',
        {
          body: {
            weather: weatherData,
            clothes: finalCategorizedClothes,
            allClothes: clothes
          }
        }
      );

      console.log("Réponse brute de l'API:", aiSuggestion);

      if (aiError) {
        console.error(`Tentative ${attempt + 1} échouée:`, aiError);
        lastError = aiError;
        
        if (attempt < maxRetries) {
          // Pause avant de réessayer avec un délai exponentiel
          await exponentialDelay(attempt);
          continue;
        }
        throw aiError;
      }

      if (!aiSuggestion || !aiSuggestion.suggestion) {
        console.error("Format de réponse invalide:", aiSuggestion);
        throw new Error("Format de réponse invalide de l'API");
      }

      // Traitement de la réponse de l'IA
      return await processAIResponse(
        aiSuggestion as AISuggestionResponse, 
        clothes, 
        finalCategorizedClothes,
        temperature,
        description,
        condition
      );
      
    } catch (retryError) {
      console.error(`Tentative ${attempt + 1} erreur:`, retryError);
      lastError = retryError as Error;
      
      if (attempt === maxRetries) {
        // Si on a épuisé toutes les tentatives, on essaie de choisir des vêtements au hasard adaptés à la météo
        const categorizedForFallback = categorizeClothes(clothes);
        const fallbackCategories = handleMissingCategories(categorizedForFallback, clothes);
        
        return await generateFallbackSuggestion(
          clothes, 
          temperature, 
          description, 
          fallbackCategories
        );
      }
      
      // Pause avant de réessayer
      await exponentialDelay(attempt);
    }
  }
  
  return {
    suggestion: null,
    error: lastError || new Error("Échec de génération de suggestion après plusieurs tentatives")
  };
};
