
import { supabase } from "@/integrations/supabase/client";
import type { OutfitSuggestion } from "../../types/weather";

interface ClothingItem {
  id: string;
  name: string;
  image_url: string | null;
  brand?: string;
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
  clothes: any[],
  temperature: number,
  description: string,
  useHuggingFace: boolean = false,
  maxRetries = 3
): Promise<{ suggestion: OutfitSuggestion | null; error: Error | null }> => {
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Tentative ${attempt + 1} de génération de suggestion avec ${useHuggingFace ? 'Hugging Face' : 'Gemini'}`);
      console.log(`Envoi de ${clothes.length} vêtements à l'API`);
      
      // Assurons-nous que les vêtements sont bien organisés par catégorie
      const categorizedClothes = {
        tops: clothes.filter(c => c.category === 'Haut' || c.category === 'Top'),
        bottoms: clothes.filter(c => c.category === 'Bas' || c.category === 'Bottom' || c.category === 'Pantalon'),
        shoes: clothes.filter(c => c.category === 'Chaussures' || c.category === 'Shoes')
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
        useHuggingFace ? 'generate-outfit-suggestion-hf' : 'generate-outfit-suggestion',
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
          // Pause avant de réessayer
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
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

      // Si un des vêtements n'est pas trouvé, on réessaie
      if (!topDetails || !bottomDetails || !shoesDetails) {
        console.error("Certains vêtements n'ont pas été trouvés dans la garde-robe");
        
        // Essayer de sélectionner des vêtements aléatoirement si certains sont manquants
        const finalTop = topDetails || categorizedClothes.tops[Math.floor(Math.random() * categorizedClothes.tops.length)];
        const finalBottom = bottomDetails || categorizedClothes.bottoms[Math.floor(Math.random() * categorizedClothes.bottoms.length)];
        const finalShoes = shoesDetails || categorizedClothes.shoes[Math.floor(Math.random() * categorizedClothes.shoes.length)];
        
        console.log("Utilisation de vêtements par défaut:", {
          top: finalTop.name,
          bottom: finalBottom.name,
          shoes: finalShoes.name
        });
        
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
      }

      // Tout est bien trouvé, on retourne la suggestion
      return {
        suggestion: {
          top: topDetails,
          bottom: bottomDetails,
          shoes: shoesDetails,
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
          const tops = clothes.filter(c => c.category === 'Haut' || c.category === 'Top');
          const bottoms = clothes.filter(c => c.category === 'Bas' || c.category === 'Bottom' || c.category === 'Pantalon');
          const shoes = clothes.filter(c => c.category === 'Chaussures' || c.category === 'Shoes');
          
          if (tops.length > 0 && bottoms.length > 0 && shoes.length > 0) {
            const randomTop = tops[Math.floor(Math.random() * tops.length)];
            const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
            const randomShoes = shoes[Math.floor(Math.random() * shoes.length)];
            
            console.log("Génération d'une suggestion aléatoire de secours");
            
            return {
              suggestion: {
                top: randomTop,
                bottom: randomBottom,
                shoes: randomShoes,
                explanation: "Suggestion générée aléatoirement car l'IA n'a pas pu proposer une tenue.",
                temperature,
                description
              },
              error: null
            };
          }
        } catch (fallbackError) {
          console.error("Erreur lors de la génération de secours:", fallbackError);
        }
        
        break;
      }
      
      // Pause avant de réessayer, avec une durée qui augmente à chaque tentative
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  
  return {
    suggestion: null,
    error: lastError || new Error("Échec de génération de suggestion après plusieurs tentatives")
  };
};
