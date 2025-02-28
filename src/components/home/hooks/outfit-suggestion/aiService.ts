
import { supabase } from "@/integrations/supabase/client";
import type { OutfitSuggestion } from "../../types/weather";

interface ClothingItem {
  id: string;
  name: string;
  image_url: string | null;
  brand?: string;
  category: string;
}

interface AIResponse {
  suggestion: {
    top: string;
    bottom: string;
    shoes: string;
  };
  explanation: string;
}

export const generateAISuggestion = async (
  clothes: ClothingItem[],
  temperature: number,
  description: string,
  useMistral: boolean = true,
  maxRetries = 3
): Promise<{ suggestion: OutfitSuggestion | null; error: Error | null }> => {
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Tentative ${attempt + 1} de génération de suggestion avec ${useMistral ? 'Mistral' : 'autre modèle'}`);
      console.log(`Envoi de ${clothes.length} vêtements à l'API`);
      
      // Amélioration de la catégorisation des vêtements
      const categorizedClothes = {
        tops: clothes.filter(c => 
          c.category?.toLowerCase() === 'haut' || 
          c.category?.toLowerCase() === 'top' || 
          c.category?.toLowerCase() === 't-shirt' || 
          c.category?.toLowerCase() === 'chemise' || 
          c.category?.toLowerCase() === 'pull' || 
          c.category?.toLowerCase() === 'veste'
        ),
        bottoms: clothes.filter(c => 
          c.category?.toLowerCase() === 'bas' || 
          c.category?.toLowerCase() === 'bottom' || 
          c.category?.toLowerCase() === 'pantalon' || 
          c.category?.toLowerCase() === 'jean' || 
          c.category?.toLowerCase() === 'jupe' || 
          c.category?.toLowerCase() === 'short'
        ),
        shoes: clothes.filter(c => 
          c.category?.toLowerCase() === 'chaussures' || 
          c.category?.toLowerCase() === 'shoes' || 
          c.category?.toLowerCase() === 'bottes' || 
          c.category?.toLowerCase() === 'baskets' || 
          c.category?.toLowerCase() === 'sandales'
        )
      };

      console.log("Vêtements catégorisés:", {
        tops: categorizedClothes.tops.length,
        bottoms: categorizedClothes.bottoms.length,
        shoes: categorizedClothes.shoes.length
      });

      // Si une catégorie est vide, on ne peut pas générer de suggestion
      if (categorizedClothes.tops.length === 0 || 
          categorizedClothes.bottoms.length === 0 || 
          categorizedClothes.shoes.length === 0) {
        throw new Error("Vous n'avez pas assez de vêtements dans certaines catégories pour générer une suggestion");
      }
      
      // Appel de la fonction Edge de Supabase
      const { data: aiSuggestion, error: aiError } = await supabase.functions.invoke(
        useMistral ? 'generate-mistral-suggestion' : 'generate-outfit-suggestion',
        {
          body: {
            temperature,
            description,
            clothes: categorizedClothes,
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
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
          continue;
        }
        throw aiError;
      }

      if (!aiSuggestion || !aiSuggestion.suggestion) {
        console.error("Format de réponse invalide:", aiSuggestion);
        throw new Error("Format de réponse invalide de l'API");
      }

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
          description
        },
        error: null
      };
    } catch (retryError) {
      console.error(`Tentative ${attempt + 1} erreur:`, retryError);
      lastError = retryError as Error;
      
      if (attempt === maxRetries) {
        // Si on a épuisé toutes les tentatives, on essaie de choisir des vêtements au hasard
        try {
          console.log("Génération d'une suggestion aléatoire de secours");
          
          // Catégoriser à nouveau pour s'assurer que la catégorisation est cohérente
          const finalCategories = {
            tops: clothes.filter(c => 
              c.category?.toLowerCase() === 'haut' || 
              c.category?.toLowerCase() === 'top' || 
              c.category?.toLowerCase() === 't-shirt' || 
              c.category?.toLowerCase() === 'chemise' || 
              c.category?.toLowerCase() === 'pull' || 
              c.category?.toLowerCase() === 'veste'
            ),
            bottoms: clothes.filter(c => 
              c.category?.toLowerCase() === 'bas' || 
              c.category?.toLowerCase() === 'bottom' || 
              c.category?.toLowerCase() === 'pantalon' || 
              c.category?.toLowerCase() === 'jean' || 
              c.category?.toLowerCase() === 'jupe' || 
              c.category?.toLowerCase() === 'short'
            ),
            shoes: clothes.filter(c => 
              c.category?.toLowerCase() === 'chaussures' || 
              c.category?.toLowerCase() === 'shoes' || 
              c.category?.toLowerCase() === 'bottes' || 
              c.category?.toLowerCase() === 'baskets' || 
              c.category?.toLowerCase() === 'sandales'
            )
          };
          
          if (finalCategories.tops.length > 0 && finalCategories.bottoms.length > 0 && finalCategories.shoes.length > 0) {
            const randomTop = getRandomItem(finalCategories.tops);
            const randomBottom = getRandomItem(finalCategories.bottoms);
            const randomShoes = getRandomItem(finalCategories.shoes);
            
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
        } catch (fallbackError) {
          console.error("Erreur lors de la génération de secours:", fallbackError);
        }
        
        break;
      }
      
      // Pause avant de réessayer, avec une durée qui augmente à chaque tentative (backoff exponentiel)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
  
  return {
    suggestion: null,
    error: lastError || new Error("Échec de génération de suggestion après plusieurs tentatives")
  };
};

// Fonction utilitaire pour obtenir un élément aléatoire d'un tableau
function getRandomItem<T>(items: T[]): T | undefined {
  if (!items || items.length === 0) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}
