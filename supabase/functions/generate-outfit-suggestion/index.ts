
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function retryWithBackoff(fn: () => Promise<any>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) throw error;
      // Wait 2^i seconds between retries (1s, 2s, 4s)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { temperature, description, clothes } = await req.json();
    console.log("Received request with:", { temperature, description, clothesCount: clothes?.length });

    if (!clothes || clothes.length === 0) {
      return new Response(
        JSON.stringify({ error: "No clothes provided" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `En tant qu'expert en mode, suggère une tenue appropriée pour une température de ${temperature}°C avec un temps ${description}. 

    Règles importantes pour la température:
    - Si température < 12°C: Privilégier les vêtements chauds et superposables (pulls, vestes, manches longues)
    - Si température entre 12°C et 18°C: Vêtements de mi-saison (t-shirts avec pulls légers ou vestes)
    - Si température entre 18°C et 23°C: Vêtements légers mais pas trop découverts
    - Si température > 23°C: Vêtements légers et aérés

    Voici la liste des vêtements disponibles:
    ${JSON.stringify(clothes, null, 2)}
    
    Analyse les vêtements et suggère une tenue complète en prenant en compte:
    1. La température et les conditions météorologiques de manière STRICTE
    2. Les catégories de temps (été, hiver, etc.) associées à chaque vêtement
    3. La cohérence des styles et des couleurs
    4. Le confort thermique de l'utilisateur
    
    Retourne la réponse au format JSON avec cette structure:
    {
      "suggestion": {
        "top": ID_DU_HAUT,
        "bottom": ID_DU_BAS,
        "shoes": ID_DES_CHAUSSURES
      },
      "explanation": "Explication détaillée du choix de la tenue en fonction de la température et du temps"
    }`

    console.log("Sending prompt to Gemini");
    
    const result = await retryWithBackoff(async () => {
      const response = await model.generateContent(prompt);
      return response.response;
    });
    
    const text = result.text();
    console.log("Received response from Gemini:", text);
    
    // Parse the JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from response");
    }
    
    const suggestionData = JSON.parse(jsonMatch[0]);
    console.log("Parsed suggestion data:", suggestionData);

    if (!suggestionData.suggestion || !suggestionData.explanation) {
      throw new Error("Invalid response format from Gemini");
    }

    return new Response(
      JSON.stringify(suggestionData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in generate-outfit-suggestion:', error);
    
    // Format the error message
    const errorMessage = error.message || "Internal server error";
    const status = error.message.includes("Invalid response format") ? 422 : 500;
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.stack
      }),
      { 
        status,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
