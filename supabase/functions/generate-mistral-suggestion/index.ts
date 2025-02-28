
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const mistralApiKey = Deno.env.get('MISTRAL_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { temperature, description, clothes } = await req.json();
    
    console.log("Requête reçue avec les paramètres:", { 
      temperature, 
      description, 
      clothesCount: clothes ? Object.keys(clothes).length : 0 
    });

    // Formatage des catégories de vêtements pour l'envoi à Mistral
    const formattedClothes = {
      tops: clothes.tops?.map(item => ({ id: item.id, name: item.name, brand: item.brand || 'Unknown' })) || [],
      bottoms: clothes.bottoms?.map(item => ({ id: item.id, name: item.name, brand: item.brand || 'Unknown' })) || [],
      shoes: clothes.shoes?.map(item => ({ id: item.id, name: item.name, brand: item.brand || 'Unknown' })) || [],
    };

    // Construction du prompt pour Mistral
    const prompt = `
Tu es un assistant de mode qui aide à choisir des tenues adaptées à la météo.
Température actuelle: ${temperature}°C
Description météo: ${description}

Voici les vêtements disponibles:

HAUTS:
${formattedClothes.tops.map(item => `- ${item.name} (ID: ${item.id})`).join('\n')}

BAS:
${formattedClothes.bottoms.map(item => `- ${item.name} (ID: ${item.id})`).join('\n')}

CHAUSSURES:
${formattedClothes.shoes.map(item => `- ${item.name} (ID: ${item.id})`).join('\n')}

Suggère une tenue complète adaptée à cette météo en choisissant exactement:
1. Un haut
2. Un bas
3. Une paire de chaussures

IMPORTANT:
- Fournis UNIQUEMENT les IDs des vêtements choisis
- Explique pourquoi cette tenue est adaptée à la météo
- Réponds au format JSON suivant:
{
  "suggestion": {
    "top": "ID_DU_HAUT",
    "bottom": "ID_DU_BAS",
    "shoes": "ID_DES_CHAUSSURES"
  },
  "explanation": "Explication sur le choix de la tenue"
}
`;

    console.log("Envoi du prompt à Mistral");

    // Appel à l'API Mistral
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mistralApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-large-latest', // Le modèle le plus performant de Mistral
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3, // Valeur faible pour des réponses plus cohérentes
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur de l'API Mistral:", errorText);
      throw new Error(`Erreur de l'API Mistral: ${response.status} ${errorText}`);
    }

    const mistralResponse = await response.json();
    console.log("Réponse reçue de Mistral");

    // Extraire la réponse JSON depuis le texte de l'assistant
    const assistantMessage = mistralResponse.choices[0].message.content;
    let parsedResponse;
    
    try {
      parsedResponse = JSON.parse(assistantMessage);
      console.log("Réponse parsée avec succès:", parsedResponse);
    } catch (e) {
      console.error("Erreur lors du parsing de la réponse:", e);
      console.log("Réponse brute:", assistantMessage);
      
      // Tentative d'extraction de JSON à partir du texte (au cas où il y aurait du texte supplémentaire)
      const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsedResponse = JSON.parse(jsonMatch[0]);
          console.log("JSON extrait avec regex:", parsedResponse);
        } catch (e2) {
          console.error("Échec de l'extraction avec regex:", e2);
          throw new Error("Format de réponse invalide de Mistral");
        }
      } else {
        throw new Error("Format de réponse invalide de Mistral");
      }
    }

    // Validation de la réponse
    if (!parsedResponse || !parsedResponse.suggestion || 
        !parsedResponse.suggestion.top || 
        !parsedResponse.suggestion.bottom || 
        !parsedResponse.suggestion.shoes) {
      console.error("Réponse incomplète:", parsedResponse);
      throw new Error("Réponse incomplète de Mistral");
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erreur dans la fonction generate-mistral-suggestion:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      suggestion: null,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
