
import { corsHeaders } from "../_shared/cors.ts";
import { generateOpenAISuggestions } from "./openai.ts";
import { generateFallbackSuggestions } from "./fallback.ts";
import { getWeatherInfo } from "./weather.ts";

export async function handleRequest(req: Request) {
  console.log("Démarrage de la fonction get-suitcase-suggestions");
  
  // Récupérer les données de la requête
  const payload = await req.json();
  const { startDate, endDate, currentClothes, availableClothes } = payload;
  
  if (!startDate || !endDate) {
    throw new Error("Les dates de début et de fin sont obligatoires");
  }

  // Calculer le nombre de jours entre les dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  const tripDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);
  
  console.log(`Voyage de ${tripDays} jours du ${start.toLocaleDateString()} au ${end.toLocaleDateString()}`);
  
  // Vérifier la météo pour la période du voyage si possible
  const weatherInfo = await getWeatherInfo();
  
  // Si l'API OpenAI n'est pas configurée, utiliser une méthode de secours
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    console.log("Clé API OpenAI non configurée, utilisation de la méthode de secours");
    
    const fallbackResult = generateFallbackSuggestions(availableClothes, tripDays, weatherInfo);
    
    return new Response(
      JSON.stringify(fallbackResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  // Utiliser OpenAI pour générer des suggestions plus intelligentes
  try {
    const aiResult = await generateOpenAISuggestions(
      startDate, 
      endDate, 
      tripDays,
      currentClothes, 
      availableClothes, 
      weatherInfo, 
      openaiApiKey
    );
    
    return new Response(
      JSON.stringify(aiResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (aiError) {
    console.error("Erreur lors de l'utilisation de l'API OpenAI:", aiError);
    
    // Fallback en cas d'erreur d'analyse
    const fallbackResult = generateFallbackSuggestions(availableClothes, tripDays, weatherInfo);
    
    return new Response(
      JSON.stringify(fallbackResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
