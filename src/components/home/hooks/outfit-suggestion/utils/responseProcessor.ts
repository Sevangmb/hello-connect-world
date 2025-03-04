
import { AISuggestionResponse, ClothingItem, SuggestionResult } from "../types/aiTypes";
import { getRandomItem } from "./clothingCategorization";
import { determineConditionFromDescription } from "./weatherUtils";

/**
 * Traitement de la réponse de l'IA pour extraire les vêtements identifiés
 */
export async function processAIResponse(
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

  // Déterminer la condition météo si non fournie
  const weatherCondition = condition || determineConditionFromDescription(description);
  
  return {
    suggestion: {
      top: finalTop,
      bottom: finalBottom,
      shoes: finalShoes,
      explanation: aiSuggestion.explanation || "Voici une tenue adaptée à la météo actuelle.",
      temperature,
      description,
      condition: weatherCondition
    },
    error: null
  };
}
