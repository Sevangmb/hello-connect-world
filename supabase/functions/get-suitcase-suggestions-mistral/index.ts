
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const mistralApiKey = Deno.env.get('MISTRAL_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClothesItem {
  id: string;
  name: string;
  category: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { startDate, endDate, currentClothes, availableClothes } = await req.json();
    
    console.log("Requête reçue pour les suggestions de valise:", { 
      startDate, 
      endDate, 
      currentClothesCount: currentClothes?.length || 0,
      availableClothesCount: availableClothes?.length || 0
    });

    if (!availableClothes || availableClothes.length === 0) {
      return new Response(JSON.stringify({
        suggestedClothes: [],
        explanation: "Aucun vêtement disponible pour faire des suggestions."
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calcul de la durée du voyage
    const tripStart = new Date(startDate);
    const tripEnd = new Date(endDate);
    const tripDuration = Math.ceil((tripEnd.getTime() - tripStart.getTime()) / (1000 * 3600 * 24));

    // Formatage des données pour le prompt
    const currentClothesFormatted = currentClothes?.map(item => 
      `- ${item.name} (Catégorie: ${item.category}, ID: ${item.id})`
    ).join('\n') || "Aucun vêtement sélectionné";

    // Organiser les vêtements disponibles par catégorie
    const categorizedClothes = availableClothes.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    let availableClothesFormatted = "";
    for (const [category, items] of Object.entries(categorizedClothes)) {
      availableClothesFormatted += `\n${category.toUpperCase()}:\n`;
      availableClothesFormatted += items.map(item => 
        `- ${item.name} (ID: ${item.id})`
      ).join('\n');
      availableClothesFormatted += '\n';
    }

    // Construction du prompt pour Mistral
    const prompt = `
Tu es un assistant spécialisé dans la préparation de valises pour les voyages.
Durée du voyage: ${tripDuration} jours (du ${tripStart.toLocaleDateString()} au ${tripEnd.toLocaleDateString()})

Vêtements déjà sélectionnés pour la valise:
${currentClothesFormatted}

Vêtements disponibles à ajouter:
${availableClothesFormatted}

Suggère 5 à 10 vêtements supplémentaires adaptés pour ce voyage en fonction de:
- La durée du voyage (${tripDuration} jours)
- Les vêtements déjà sélectionnés
- Un assortiment équilibré de catégories

IMPORTANT:
- Sélectionne uniquement des vêtements de la liste disponible
- Évite de suggérer des vêtements similaires à ceux déjà sélectionnés
- Fournis une explication sur le choix des vêtements
- Réponds au format JSON suivant:
{
  "suggestedClothes": [
    { "id": "ID_DU_VÊTEMENT", "name": "NOM_DU_VÊTEMENT", "category": "CATÉGORIE" },
    ...
  ],
  "explanation": "Explication du choix des vêtements"
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
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
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
      console.log("Réponse parsée avec succès");
    } catch (e) {
      console.error("Erreur lors du parsing de la réponse:", e);
      console.log("Réponse brute:", assistantMessage);
      
      // Tentative d'extraction de JSON à partir du texte
      const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsedResponse = JSON.parse(jsonMatch[0]);
          console.log("JSON extrait avec regex");
        } catch (e2) {
          console.error("Échec de l'extraction avec regex:", e2);
          throw new Error("Format de réponse invalide de Mistral");
        }
      } else {
        throw new Error("Format de réponse invalide de Mistral");
      }
    }

    // Validation de la réponse
    if (!parsedResponse || !Array.isArray(parsedResponse.suggestedClothes)) {
      console.error("Réponse invalide:", parsedResponse);
      throw new Error("Format de réponse invalide de Mistral");
    }

    // Vérification que les IDs suggérés existent bien dans les vêtements disponibles
    const availableIds = new Set(availableClothes.map(item => item.id));
    const validSuggestions = parsedResponse.suggestedClothes.filter(item => 
      availableIds.has(item.id)
    );

    if (validSuggestions.length === 0 && parsedResponse.suggestedClothes.length > 0) {
      console.warn("Aucune suggestion valide trouvée, les IDs ne correspondent pas aux vêtements disponibles");
      
      // Fallback: sélectionner quelques vêtements aléatoires
      const randomSelections = [];
      const categories = [...new Set(availableClothes.map(item => item.category))];
      
      for (const category of categories) {
        const itemsInCategory = availableClothes.filter(item => item.category === category);
        if (itemsInCategory.length > 0) {
          const randomItem = itemsInCategory[Math.floor(Math.random() * itemsInCategory.length)];
          randomSelections.push({
            id: randomItem.id,
            name: randomItem.name,
            category: randomItem.category
          });
        }
      }
      
      return new Response(JSON.stringify({
        suggestedClothes: randomSelections,
        explanation: "Suggestions générées aléatoirement car les suggestions de l'IA ne correspondaient pas aux vêtements disponibles."
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      suggestedClothes: validSuggestions,
      explanation: parsedResponse.explanation || "Voici quelques suggestions pour compléter votre valise."
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erreur dans la fonction get-suitcase-suggestions-mistral:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      suggestedClothes: [],
      explanation: "Une erreur est survenue lors de la génération des suggestions."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
