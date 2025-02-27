
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Configurer les en-têtes CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuration OpenAI
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Gestion des requêtes OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
    let weatherInfo = "Information non disponible";
    try {
      // Essayons de récupérer les informations météo
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Récupérer la clé API OpenWeather
        const { data: secretData } = await supabase
          .from('secrets')
          .select('value')
          .eq('key', 'OPENWEATHER_API_KEY')
          .single();
        
        if (secretData) {
          const openWeatherApiKey = secretData.value;
          
          // On utilise les coordonnées de Paris comme exemple
          // Dans une version plus avancée, on pourrait demander les coordonnées du lieu de voyage
          const lat = 48.8566;
          const lon = 2.3522;
          
          // Obtenir les prévisions météo pour les 5 prochains jours
          const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`,
            { method: 'GET' }
          );
          
          if (weatherResponse.ok) {
            const weatherData = await weatherResponse.json();
            
            // Extraire des informations pertinentes sur la météo
            if (weatherData.list && weatherData.list.length > 0) {
              // Simplifier en prenant la moyenne des températures
              const temps = weatherData.list.slice(0, Math.min(tripDays * 8, weatherData.list.length));
              const avgTemp = temps.reduce((sum: number, item: any) => sum + item.main.temp, 0) / temps.length;
              const conditions = [...new Set(temps.map((item: any) => item.weather[0].main))];
              
              weatherInfo = `Température moyenne: ${avgTemp.toFixed(1)}°C. Conditions: ${conditions.join(", ")}.`;
            }
          }
        }
      }
    } catch (weatherError) {
      console.error("Erreur lors de la récupération des données météo:", weatherError);
      // On continue sans les données météo
    }

    console.log("Informations météo:", weatherInfo);
    
    // Si l'API OpenAI n'est pas configurée, utiliser une méthode de secours
    if (!openaiApiKey) {
      console.log("Clé API OpenAI non configurée, utilisation de la méthode de secours");
      
      // Catégoriser les vêtements disponibles
      const categorizedClothes = availableClothes.reduce((acc: any, item: any) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {});
      
      // Logique simple basée sur les catégories et le nombre de jours
      const suggestedClothes = [];
      const essentialCategories = ["Hauts", "Bas", "Chaussures", "Accessoires"];
      
      for (const category of essentialCategories) {
        if (categorizedClothes[category]) {
          const itemsCount = category === "Hauts" || category === "Bas" 
            ? Math.min(tripDays, categorizedClothes[category].length)
            : Math.min(2, categorizedClothes[category].length);
          
          for (let i = 0; i < itemsCount; i++) {
            if (categorizedClothes[category][i]) {
              suggestedClothes.push({
                id: categorizedClothes[category][i].id,
                name: categorizedClothes[category][i].name,
                category: categorizedClothes[category][i].category
              });
            }
          }
        }
      }
      
      return new Response(
        JSON.stringify({
          suggestedClothes,
          explanation: `Suggestions basées sur votre voyage de ${tripDays} jours. ${weatherInfo}`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Utiliser OpenAI pour générer des suggestions plus intelligentes
    console.log("Utilisation de l'API OpenAI pour les suggestions");
    
    // Préparer le contexte pour l'IA
    const systemPrompt = `
Tu es un assistant spécialisé dans la mode et l'organisation de valises. Ta tâche est de suggérer des vêtements pour un voyage en fonction du nombre de jours, des vêtements déjà sélectionnés, des vêtements disponibles et des prévisions météo.

Voici des informations importantes:
- Le voyage dure ${tripDays} jours, du ${start.toLocaleDateString()} au ${end.toLocaleDateString()}
- Prévisions météo: ${weatherInfo}

Règles générales:
1. Ne suggère pas de vêtements déjà sélectionnés
2. Adapte tes suggestions au nombre de jours (ex: plus de hauts et de bas pour un voyage plus long)
3. Prends en compte la météo pour suggérer des vêtements appropriés
4. Pense à la cohérence des styles et des couleurs pour créer des tenues complètes
5. Suggère entre 3 et 10 articles, selon la durée du voyage
`;

    const userPrompt = `
Voici les vêtements déjà sélectionnés:
${JSON.stringify(currentClothes, null, 2)}

Voici les vêtements disponibles:
${JSON.stringify(availableClothes, null, 2)}

Suggère-moi des vêtements supplémentaires en fonction de la durée du voyage (${tripDays} jours) et de la météo.
Réponds uniquement avec un objet JSON au format suivant:
{
  "suggestedClothes": [
    {"id": "id_du_vêtement", "name": "nom_du_vêtement", "category": "catégorie_du_vêtement"},
    ...
  ],
  "explanation": "Explication de tes suggestions"
}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur OpenAI:", errorData);
      throw new Error(`Erreur OpenAI: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiOutput = data.choices[0].message.content;
    
    console.log("Réponse de l'IA:", aiOutput);
    
    // Analyser la réponse JSON de l'IA
    try {
      let suggestions;
      
      // L'IA pourrait renvoyer soit une chaîne JSON, soit du texte avec JSON
      if (aiOutput.includes('{') && aiOutput.includes('}')) {
        const jsonMatch = aiOutput.match(/{[\s\S]*}/);
        if (jsonMatch) {
          suggestions = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Format JSON invalide dans la réponse de l'IA");
        }
      } else {
        suggestions = JSON.parse(aiOutput);
      }
      
      // Valider que les vêtements suggérés existent réellement dans les vêtements disponibles
      const validSuggestions = suggestions.suggestedClothes.filter((item: any) => 
        availableClothes.some((cloth: any) => cloth.id === item.id)
      );
      
      const finalResponse = {
        suggestedClothes: validSuggestions,
        explanation: suggestions.explanation || `Suggestions adaptées pour votre voyage de ${tripDays} jours. ${weatherInfo}`
      };
      
      console.log("Suggestions finales:", finalResponse);
      
      return new Response(
        JSON.stringify(finalResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error("Erreur lors de l'analyse de la réponse de l'IA:", parseError, aiOutput);
      
      // Fallback en cas d'erreur d'analyse
      // Catégoriser les vêtements disponibles
      const categorizedClothes = availableClothes.reduce((acc: any, item: any) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {});
      
      // Logique simple basée sur les catégories et le nombre de jours
      const suggestedClothes = [];
      const essentialCategories = ["Hauts", "Bas", "Chaussures", "Accessoires"];
      
      for (const category of essentialCategories) {
        if (categorizedClothes[category]) {
          const itemsCount = category === "Hauts" || category === "Bas" 
            ? Math.min(tripDays, categorizedClothes[category].length)
            : Math.min(2, categorizedClothes[category].length);
          
          for (let i = 0; i < itemsCount; i++) {
            if (categorizedClothes[category][i]) {
              suggestedClothes.push({
                id: categorizedClothes[category][i].id,
                name: categorizedClothes[category][i].name,
                category: categorizedClothes[category][i].category
              });
            }
          }
        }
      }
      
      return new Response(
        JSON.stringify({
          suggestedClothes,
          explanation: `Suggestions basées sur votre voyage de ${tripDays} jours. ${weatherInfo}`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Erreur dans la fonction get-suitcase-suggestions:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Une erreur s'est produite lors de la génération des suggestions" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
