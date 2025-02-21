
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
    const { startDate, endDate, currentClothes } = await req.json();
    console.log("Received request for suitcase suggestions:", { startDate, endDate, clothesCount: currentClothes?.length });

    // Vérifier que les dates sont valides
    if (!startDate || !endDate) {
      throw new Error("Les dates de début et de fin sont requises");
    }

    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!);
    if (!genAI) {
      throw new Error("La clé API Gemini n'est pas configurée");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const tripDuration = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));

    const prompt = `En tant qu'expert en mode et en préparation de valise, suggère une sélection de vêtements pour un voyage de ${tripDuration} jours, 
    du ${new Date(startDate).toLocaleDateString('fr-FR')} au ${new Date(endDate).toLocaleDateString('fr-FR')}.

    Voici la liste des vêtements disponibles :
    ${JSON.stringify(currentClothes, null, 2)}

    Critères pour la sélection :
    1. Suggérer des tenues pour ${tripDuration} jours
    2. Inclure des combinaisons polyvalentes qui peuvent être réutilisées
    3. Tenir compte des différents types d'activités (casual, sport, sortie)
    4. Optimiser l'espace en favorisant des vêtements qui se marient bien entre eux
    5. Prévoir 1-2 tenues de rechange

    Retourne tes suggestions au format texte simple, en français, sans structure JSON.
    Concentre-toi sur des conseils pratiques et des suggestions de combinaisons avec les vêtements disponibles.`;

    console.log("Sending prompt to Gemini");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log("Received response from Gemini:", text);

    return new Response(
      JSON.stringify({ explanation: text }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in get-suitcase-suggestions:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Une erreur s'est produite"
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
