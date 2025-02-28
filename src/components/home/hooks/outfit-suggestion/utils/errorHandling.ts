
import { type CategorizedClothes, getRandomItem } from "./clothingCategorization";

interface ClothingItem {
  id: string;
  name: string;
  image_url: string | null;
  brand?: string;
  category: string;
}

// Gestion de la génération de secours en cas d'échec
export async function generateFallbackSuggestion(
  clothes: ClothingItem[],
  temperature: number,
  description: string,
  categorizedClothes: CategorizedClothes
): Promise<{
  suggestion: {
    top: ClothingItem;
    bottom: ClothingItem;
    shoes: ClothingItem;
    explanation: string;
    temperature: number;
    description: string;
  } | null;
  error: Error | null;
}> {
  try {
    console.log("Génération d'une suggestion aléatoire de secours");
    
    if (categorizedClothes.tops.length > 0 && 
        categorizedClothes.bottoms.length > 0 && 
        categorizedClothes.shoes.length > 0) {
      
      const randomTop = getRandomItem(categorizedClothes.tops);
      const randomBottom = getRandomItem(categorizedClothes.bottoms);
      const randomShoes = getRandomItem(categorizedClothes.shoes);
      
      if (randomTop && randomBottom && randomShoes) {
        return {
          suggestion: {
            top: randomTop,
            bottom: randomBottom,
            shoes: randomShoes,
            explanation: `Suggestion générée aléatoirement pour ${temperature}°C avec un temps ${description}.`,
            temperature,
            description
          },
          error: null
        };
      }
    }
    
    return {
      suggestion: null,
      error: new Error("Impossible de générer une suggestion aléatoire")
    };
  } catch (error) {
    console.error("Erreur lors de la génération de secours:", error);
    return {
      suggestion: null,
      error: error instanceof Error ? error : new Error("Erreur inconnue")
    };
  }
}

// Utilitaire pour implémenter un délai exponentiel
export function exponentialDelay(attempt: number): Promise<void> {
  const delay = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s, 8s, etc.
  return new Promise(resolve => setTimeout(resolve, delay));
}
