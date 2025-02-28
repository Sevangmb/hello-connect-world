
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

// Types
interface ClothesItem {
  id: string;
  name: string;
  category: string;
  image_url?: string | null;
  brand?: string | null;
  style?: string | null;
  color?: string | null;
  material?: string | null;
}

interface SuitcaseData {
  startDate: string;
  endDate: string;
  currentClothes: {
    id: string;
    name: string;
    category: string;
  }[];
  availableClothes: ClothesItem[];
}

interface SuggestionResponse {
  suggestedClothes: {
    id: string;
    name: string;
    category: string;
  }[];
  explanation: string;
}

// Récupère l'API key depuis les secrets 
const mistralApiKey = Deno.env.get('MISTRAL_API_KEY') || '';

// Fonction qui génère des suggestions avec Mistral
async function generateMistralSuggestions(data: SuitcaseData): Promise<SuggestionResponse> {
  console.log("Generating suggestions using Mistral API...");
  
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const tripDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Regrouper les vêtements par catégorie pour la requête
  const categorizedClothes: Record<string, ClothesItem[]> = {};
  data.availableClothes.forEach(cloth => {
    if (!categorizedClothes[cloth.category]) {
      categorizedClothes[cloth.category] = [];
    }
    categorizedClothes[cloth.category].push(cloth);
  });
  
  // Liste des vêtements déjà dans la valise
  const currentClothesIds = data.currentClothes.map(item => item.id);
  
  // Filtrer les vêtements disponibles pour exclure ceux déjà ajoutés
  const availableItemsFiltered = data.availableClothes.filter(
    cloth => !currentClothesIds.includes(cloth.id)
  );
  
  // Construire le prompt pour Mistral
  const prompt = `En tant qu'assistant de préparation de valise, aide-moi à choisir des vêtements pour un voyage de ${tripDuration} jours.
  
Voici les vêtements déjà ajoutés à ma valise:
${data.currentClothes.map(c => `- ${c.name} (${c.category})`).join('\n')}

Voici ma garde-robe disponible (avec l'ID entre parenthèses):
${availableItemsFiltered.map(c => `- ${c.name} (${c.id}) - Catégorie: ${c.category}${c.color ? `, Couleur: ${c.color}` : ''}${c.material ? `, Matière: ${c.material}` : ''}${c.style ? `, Style: ${c.style}` : ''}`).join('\n')}

Suggère-moi 3 à 5 vêtements additionnels à ajouter à ma valise en tenant compte de:
1. La durée du voyage (${tripDuration} jours)
2. La complémentarité avec les vêtements déjà choisis
3. Une variété de catégories (hauts, bas, chaussures, etc.)

Réponds UNIQUEMENT au format JSON suivant:
{
  "suggestedClothes": [
    {"id": "ID_DU_VÊTEMENT", "name": "NOM_DU_VÊTEMENT", "category": "CATÉGORIE"},
    ...
  ],
  "explanation": "EXPLICATION_DES_SUGGESTIONS"
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
        max_tokens: 1024,
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
      if (!jsonResponse.suggestedClothes || !Array.isArray(jsonResponse.suggestedClothes)) {
        throw new Error('Format de réponse invalide: suggestedClothes manquant ou invalide');
      }
      
      // Vérifier que tous les IDs suggérés existent bien dans les vêtements disponibles
      const validIds = data.availableClothes.map(c => c.id);
      jsonResponse.suggestedClothes = jsonResponse.suggestedClothes.filter(item => 
        validIds.includes(item.id) && !currentClothesIds.includes(item.id)
      );
      
      // Limiter à un maximum de 5 suggestions
      if (jsonResponse.suggestedClothes.length > 5) {
        jsonResponse.suggestedClothes = jsonResponse.suggestedClothes.slice(0, 5);
      }
      
      // Si aucune suggestion valide n'a été trouvée, générer des suggestions aléatoires
      if (jsonResponse.suggestedClothes.length === 0) {
        console.log("Pas de suggestions valides, génération aléatoire...");
        jsonResponse.suggestedClothes = generateRandomSuggestions(
          availableItemsFiltered, 
          data.currentClothes,
          3
        );
        jsonResponse.explanation = "Voici quelques vêtements complémentaires pour votre voyage.";
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

// Fonction de secours pour générer des suggestions aléatoires
function generateRandomSuggestions(
  availableClothes: ClothesItem[], 
  currentClothes: {id: string, name: string, category: string}[],
  count: number
): {id: string, name: string, category: string}[] {
  
  // Déterminer les catégories déjà présentes
  const existingCategories = new Set(currentClothes.map(item => item.category));
  
  // Grouper par catégorie
  const clothesByCategory: Record<string, ClothesItem[]> = {};
  availableClothes.forEach(item => {
    if (!clothesByCategory[item.category]) {
      clothesByCategory[item.category] = [];
    }
    clothesByCategory[item.category].push(item);
  });
  
  const suggestions: {id: string, name: string, category: string}[] = [];
  const usedIds = new Set(currentClothes.map(item => item.id));
  
  // Privilégier d'abord les catégories manquantes
  const allCategories = Object.keys(clothesByCategory);
  const missingCategories = allCategories.filter(cat => !existingCategories.has(cat));
  
  // Essayer de sélectionner à partir des catégories manquantes
  for (const category of missingCategories) {
    if (suggestions.length >= count) break;
    
    const availableItemsInCategory = clothesByCategory[category].filter(
      item => !usedIds.has(item.id)
    );
    
    if (availableItemsInCategory.length > 0) {
      const randomItem = availableItemsInCategory[
        Math.floor(Math.random() * availableItemsInCategory.length)
      ];
      
      suggestions.push({
        id: randomItem.id,
        name: randomItem.name,
        category: randomItem.category
      });
      
      usedIds.add(randomItem.id);
    }
  }
  
  // Si nous n'avons pas assez de suggestions, ajouter des éléments aléatoires
  while (suggestions.length < count) {
    // Créer une liste aplatie de tous les vêtements disponibles non utilisés
    const remainingItems = availableClothes.filter(item => !usedIds.has(item.id));
    
    if (remainingItems.length === 0) break;
    
    const randomItem = remainingItems[Math.floor(Math.random() * remainingItems.length)];
    
    suggestions.push({
      id: randomItem.id,
      name: randomItem.name,
      category: randomItem.category
    });
    
    usedIds.add(randomItem.id);
  }
  
  return suggestions;
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
    const requestData: SuitcaseData = await req.json();
    
    // Vérifier que les données nécessaires sont présentes
    if (!requestData.availableClothes) {
      return new Response(
        JSON.stringify({ error: 'Missing data', message: 'availableClothes is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Générer les suggestions avec Mistral
    const suggestions = await generateMistralSuggestions(requestData);
    
    // Retourner les suggestions
    return new Response(
      JSON.stringify(suggestions),
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
