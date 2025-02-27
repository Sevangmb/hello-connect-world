
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
        console.error(`Attempt ${attempt + 1} failed:`, aiError);
        lastError = aiError;
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        throw aiError;
      }

      if (aiSuggestion?.suggestion) {
        const { top, bottom, shoes } = aiSuggestion.suggestion;
        
        const topDetails = clothes.find(c => c.id === top) || null;
        const bottomDetails = clothes.find(c => c.id === bottom) || null;
        const shoesDetails = clothes.find(c => c.id === shoes) || null;

        return {
          suggestion: {
            top: topDetails,
            bottom: bottomDetails,
            shoes: shoesDetails,
            explanation: aiSuggestion.explanation,
            temperature,
            description
          },
          error: null
        };
      }

      throw new Error("Invalid suggestion format");
    } catch (retryError) {
      console.error(`Attempt ${attempt + 1} error:`, retryError);
      lastError = retryError as Error;
      
      if (attempt === maxRetries) {
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return {
    suggestion: null,
    error: lastError || new Error("Failed to generate suggestion after multiple attempts")
  };
};
