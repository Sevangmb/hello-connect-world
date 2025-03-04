
import { supabase } from "@/integrations/supabase/client";
import type { OutfitSuggestion } from "../../types/weather";
import { 
  categorizeClothes, 
  handleMissingCategories, 
  getRandomItem 
} from "./utils/clothingCategorization";
import { generateFallbackSuggestion, exponentialDelay } from "./utils/errorHandling";
import type { ClothingItem, AISuggestionResponse, SuggestionResult } from "./types/aiTypes";

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
          fallbackCategories,
          condition
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

// Déterminer la condition météo à partir de la description si non fournie
function determineConditionFromDescription(description: string): 'clear' | 'rain' | 'clouds' | 'snow' | 'extreme' | 'other' {
  const desc = description.toLowerCase();
  
  if (desc.includes('pluie') || desc.includes('averse')) return 'rain';
  if (desc.includes('neige')) return 'snow';
  if (desc.includes('nuage')) return 'clouds';
  if (desc.includes('clair') || desc.includes('dégagé') || desc.includes('soleil')) return 'clear';
  if (desc.includes('orage') || desc.includes('tempête')) return 'extreme';
  
  return 'other';
}

// Traitement de la réponse de l'IA pour extraire les vêtements identifiés
async function processAIResponse(
  aiSuggestion: AISuggestionResponse,
  clothes: ClothingItem[],
  categorizedClothes: {
    tops: ClothingItem[];
    bottoms: ClothingItem[];
    shoes: ClothingItem[];
  },
  temperature: number,
  description: string,
  condition?: 'clear' | 'rain' | 'clouds' | 'snow' | 'extreme' | 'other'
): Promise<SuggestionResult> {
  const { top: topId, bottom: bottomId, shoes: shoesId } = aiSuggestion.suggestion;
  
  console.log(`IDs reçus: top=${topId}, bottom=${bottomId}, shoes=${shoesId}`);
  
  // Recherche des détails des vêtements
  const topDetails = clothes.find(c => c.id === topId);
  const bottomDetails = clothes.find(c => c.id === bottomId);
  const shoesDetails = clothes.find(c => c.id === shoesId);
  
  console.log("Vêtements trouvés:", {
    top: topDetails ? topDetails.name : "non trouvé",
    bottom: bottomDetails ? bottomDetails.name : "non trouvé",
    shoes: shoesDetails ? shoesDetails.name : "non trouvé"
  });

  // Si un des vêtements n'est pas trouvé, on sélectionne des vêtements aléatoires pour les manquants
  const finalTop = topDetails || getRandomItem(categorizedClothes.tops);
  const finalBottom = bottomDetails || getRandomItem(categorizedClothes.bottoms);
  const finalShoes = shoesDetails || getRandomItem(categorizedClothes.shoes);
  
  if (!topDetails || !bottomDetails || !shoesDetails) {
    console.log("Utilisation de vêtements par défaut pour les manquants:", {
      top: finalTop?.name || "aucun",
      bottom: finalBottom?.name || "aucun",
      shoes: finalShoes?.name || "aucun"
    });
  }
  
  // Vérifier que tous les vêtements nécessaires sont disponibles
  if (!finalTop || !finalBottom || !finalShoes) {
    throw new Error("Impossible de composer une tenue complète avec les vêtements disponibles");
  }
  
  return {
    suggestion: {
      top: finalTop,
      bottom: finalBottom,
      shoes: finalShoes,
      explanation: aiSuggestion.explanation || "Voici une tenue adaptée à la météo actuelle.",
      temperature,
      description,
      condition: condition || determineConditionFromDescription(description)
    },
    error: null
  };
}
