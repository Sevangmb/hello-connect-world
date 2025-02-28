
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

// Types
interface ClothingItem {
  id: string;
  name: string;
  image_url: string | null;
  brand?: string;
  category: string;
}

interface WeatherRequest {
  temperature: number;
  description: string;
  clothes: {
    tops: ClothingItem[];
    bottoms: ClothingItem[];
    shoes: ClothingItem[];
  };
  allClothes: ClothingItem[];
}

interface SuggestionResponse {
  suggestion: {
    top: string;
    bottom: string;
    shoes: string;
  };
  explanation: string;
}

// Récupère l'API key depuis les secrets 
const mistralApiKey = Deno.env.get('MISTRAL_API_KEY') || '';

// Fonction qui génère des suggestions avec Mistral
async function generateMistralSuggestion(data: WeatherRequest): Promise<SuggestionResponse> {
  console.log("Generating outfit suggestion using Mistral API...");
  console.log(`Weather data: ${data.temperature}°C, ${data.description}`);
  console.log(`Available clothes: ${data.clothes.tops.length} tops, ${data.clothes.bottoms.length} bottoms, ${data.clothes.shoes.length} shoes`);
  
  // Construire le prompt pour Mistral
  const prompt = `En tant qu'assistant mode pour la météo, aide-moi à choisir une tenue adaptée à ces conditions: ${data.temperature}°C, ${data.description}.

Voici mes vêtements disponibles (avec l'ID entre parenthèses):

HAUTS:
${data.clothes.tops.map(c => `- ${c.name} (${c.id})${c.brand ? ` de ${c.brand}` : ''}`).join('\n')}

BAS:
${data.clothes.bottoms.map(c => `- ${c.name} (${c.id})${c.brand ? ` de ${c.brand}` : ''}`).join('\n')}

CHAUSSURES:
${data.clothes.shoes.map(c => `- ${c.name} (${c.id})${c.brand ? ` de ${c.brand}` : ''}`).join('\n')}

Recommande-moi une tenue complète (un haut, un bas et une paire de chaussures) qui soit:
1. Adaptée à la température de ${data.temperature}°C
2. Appropriée pour un temps "${data.description}"
3. Assortie et élégante

Réponds UNIQUEMENT avec un objet JSON au format suivant:
{
  "suggestion": {
    "top": "ID_DU_HAUT",
    "bottom": "ID_DU_BAS",
    "shoes": "ID_DES_CHAUSSURES"
  },
  "explanation": "EXPLICATION_DE_LA_TENUE_RECOMMANDÉE"
}`;

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mistralApiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 800,
        response_format: { type: 'json_object' }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Mistral API Error:', errorData);
      throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log("Mistral response received");
    
    // Extraire et parser la réponse JSON
    let jsonResponse: SuggestionResponse;
    try {
      const content = result.choices[0].message.content;
      jsonResponse = JSON.parse(content);
      
      // Vérifier si la réponse a la structure attendue
      if (!jsonResponse.suggestion || !jsonResponse.suggestion.top || 
          !jsonResponse.suggestion.bottom || !jsonResponse.suggestion.shoes) {
        throw new Error('Format de réponse invalide: suggestions incomplètes');
      }
      
      // Vérifier que tous les IDs suggérés existent bien dans les vêtements disponibles
      const topExists = data.clothes.tops.some(item => item.id === jsonResponse.suggestion.top);
      const bottomExists = data.clothes.bottoms.some(item => item.id === jsonResponse.suggestion.bottom);
      const shoesExists = data.clothes.shoes.some(item => item.id === jsonResponse.suggestion.shoes);
      
      if (!topExists || !bottomExists || !shoesExists) {
        console.log("Un ou plusieurs IDs suggérés n'existent pas, génération de suggestions alternatives...");
        
        // Générer des alternatives pour les IDs invalides
        if (!topExists) {
          jsonResponse.suggestion.top = data.clothes.tops.length > 0 
            ? data.clothes.tops[Math.floor(Math.random() * data.clothes.tops.length)].id
            : '';
        }
        
        if (!bottomExists) {
          jsonResponse.suggestion.bottom = data.clothes.bottoms.length > 0 
            ? data.clothes.bottoms[Math.floor(Math.random() * data.clothes.bottoms.length)].id
            : '';
        }
        
        if (!shoesExists) {
          jsonResponse.suggestion.shoes = data.clothes.shoes.length > 0 
            ? data.clothes.shoes[Math.floor(Math.random() * data.clothes.shoes.length)].id
            : '';
        }
      }
      
      return jsonResponse;
      
    } catch (parseError) {
      console.error('Error parsing Mistral response:', parseError);
      throw new Error('Impossible de parser la réponse du modèle');
    }
  } catch (error) {
    console.error('Error calling Mistral API:', error);
    throw error;
  }
}

Deno.serve(async (req) => {
  // Gérer les requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
        auth: { persistSession: false }
      }
    );
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'User not authenticated' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extraire les données de la requête
    const requestData: WeatherRequest = await req.json();
    
    // Vérifier que les données nécessaires sont présentes
    if (!requestData.temperature || !requestData.description || !requestData.clothes) {
      return new Response(
        JSON.stringify({ error: 'Missing data', message: 'temperature, description, and clothes are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Vérifier qu'il y a suffisamment de vêtements pour générer une suggestion
    if (requestData.clothes.tops.length === 0 || 
        requestData.clothes.bottoms.length === 0 || 
        requestData.clothes.shoes.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Insufficient clothes', 
          message: 'You need at least one item in each category (tops, bottoms, shoes)'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Générer les suggestions avec Mistral
    const suggestion = await generateMistralSuggestion(requestData);
    
    // Retourner les suggestions
    return new Response(
      JSON.stringify(suggestion),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Une erreur est survenue' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
