
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { startDate, endDate, currentClothes, availableClothes } = await req.json();
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '');

    // Formatage des dates pour un affichage plus lisible
    const start = new Date(startDate).toLocaleDateString('fr-FR');
    const end = new Date(endDate).toLocaleDateString('fr-FR');

    // Construction du prompt pour Gemini
    const prompt = `En tant qu'assistant de voyage, aide-moi à choisir des vêtements pour un séjour du ${start} au ${end}.

Voici la liste des vêtements disponibles dans ma garde-robe:
${availableClothes.map(cloth => `- ${cloth.name} (${cloth.category})`).join('\n')}

Vêtements déjà dans la valise:
${currentClothes.map(cloth => `- ${cloth.name} (${cloth.category})`).join('\n')}

Je voudrais que tu:
1. Analyses la durée du séjour
2. Suggères des vêtements adaptés en les choisissant UNIQUEMENT parmi les vêtements disponibles listés
3. Ne suggères pas de vêtements déjà dans la valise
4. Choisis un ensemble cohérent et adapté à la durée du voyage
5. Ne suggères pas plus de 10 vêtements

Réponds au format JSON exact suivant, sans texte avant ou après:
{
  "explanation": "Une explication en français de tes choix",
  "suggestedClothes": ["id1", "id2", "id3"]
}`;

    console.log("Sending prompt to Gemini:", prompt);

    // Génération de la réponse avec Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini response:", text);

    // Parse la réponse JSON
    const suggestions = JSON.parse(text);

    // Validation de la réponse
    if (!suggestions.explanation || !Array.isArray(suggestions.suggestedClothes)) {
      throw new Error("Format de réponse invalide");
    }

    return new Response(JSON.stringify(suggestions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in get-suitcase-suggestions:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
