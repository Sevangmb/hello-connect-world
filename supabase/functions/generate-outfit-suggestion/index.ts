import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let temperature, description, clothes;
    try {
      const requestData = await req.json();
      ({ temperature, description, clothes } = requestData);

      console.log("Received request with:", { temperature, description, clothesCount: clothes?.length });

      // Validate request structure
      if (typeof temperature !== "number" || typeof description !== "string" || !Array.isArray(clothes)) {
        throw new Error("Invalid request format: Ensure 'temperature' is a number, 'description' is a string, and 'clothes' is an array.");
      }
    } catch (error) {
      console.error("Error parsing request JSON:", error);
      return new Response(
        JSON.stringify({ error: "Invalid request format. Please provide valid 'temperature', 'description', and 'clothes'." }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log("Received response from Gemini:", text);

    // Clean and parse the JSON response
    let suggestionData;
    try {
      // Extract JSON from the response using regex
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      // Parse the extracted JSON
      const jsonStr = jsonMatch[0].trim();
      suggestionData = JSON.parse(jsonStr);

      // Validate the structure
      if (
        !suggestionData.suggestion ||
        !suggestionData.explanation ||
        typeof suggestionData.suggestion.top !== "string" ||
        typeof suggestionData.suggestion.bottom !== "string" ||
        typeof suggestionData.suggestion.shoes !== "string"
      ) {
        throw new Error("Invalid response structure: Missing or incorrect 'suggestion' or 'explanation' fields.");
      }
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      throw new Error("Failed to parse AI response. Ensure the response contains valid JSON with the required structure.");
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
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});