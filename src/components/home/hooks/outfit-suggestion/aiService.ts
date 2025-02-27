
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
  maxRetries = 2
): Promise<{ suggestion: OutfitSuggestion | null; error: Error | null }> => {
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Tentative ${attempt + 1} de génération de suggestion`);
      console.log(`Envoi de ${clothes.length} vêtements à l'API`);
      
      const { data: aiSuggestion, error: aiError } = await supabase.functions.invoke(
        'generate-outfit-suggestion',
        {
          body: {
            temperature,
            description,
            clothes
          }
        }
      );

      if (aiError) {
        console.error(`Tentative ${attempt + 1} échouée:`, aiError);
        lastError = aiError;
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        throw aiError;
      }

      console.log("Réponse reçue de l'API:", aiSuggestion);
      
      if (!aiSuggestion || !aiSuggestion.suggestion) {
        throw new Error("Format de réponse invalide");
      }

      const { top: topId, bottom: bottomId, shoes: shoesId } = aiSuggestion.suggestion;
      
      console.log(`IDs reçus: top=${topId}, bottom=${bottomId}, shoes=${shoesId}`);
      
      // Trouver les détails des vêtements correspondants
      const topDetails = clothes.find(c => c.id === topId);
      const bottomDetails = clothes.find(c => c.id === bottomId);
      const shoesDetails = clothes.find(c => c.id === shoesId);
      
      console.log("Vêtements trouvés:", {
        top: topDetails ? topDetails.name : "non trouvé",
        bottom: bottomDetails ? bottomDetails.name : "non trouvé",
        shoes: shoesDetails ? shoesDetails.name : "non trouvé"
      });

      if (!topDetails || !bottomDetails || !shoesDetails) {
        console.error("Certains vêtements n'ont pas été trouvés dans la garde-robe");
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        throw new Error("Certains vêtements suggérés n'ont pas été trouvés");
      }

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
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return {
    suggestion: null,
    error: lastError || new Error("Échec de génération de suggestion après plusieurs tentatives")
  };
};
