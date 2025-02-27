
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Début de la fonction generate-outfit-suggestion");
    const { temperature, description, clothes } = await req.json()

    // Vérification des données reçues
    console.log(`Température: ${temperature}°C, Temps: ${description}`);
    console.log(`Nombre de vêtements disponibles: ${clothes?.length || 0}`);

    if (!clothes || clothes.length === 0) {
      console.error("Aucun vêtement disponible dans la garde-robe");
      return new Response(
        JSON.stringify({ 
          error: "Aucun vêtement disponible dans la garde-robe" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Initialiser Gemini avec la clé API
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      console.error("Clé API Gemini non configurée");
      return new Response(
        JSON.stringify({ error: "Configuration API Gemini manquante" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Formater les vêtements disponibles par catégorie
    const availableClothes = {
      tops: clothes.filter((c: any) => c.category?.toLowerCase() === 'hauts'),
      bottoms: clothes.filter((c: any) => c.category?.toLowerCase() === 'bas'),
      shoes: clothes.filter((c: any) => c.category?.toLowerCase() === 'chaussures')
    }

    console.log(`Hauts disponibles: ${availableClothes.tops.length}`);
    console.log(`Bas disponibles: ${availableClothes.bottoms.length}`);
    console.log(`Chaussures disponibles: ${availableClothes.shoes.length}`);

    // Vérifier s'il y a des vêtements dans chaque catégorie
    if (availableClothes.tops.length === 0 || availableClothes.bottoms.length === 0 || availableClothes.shoes.length === 0) {
      console.error("Il manque des vêtements dans certaines catégories");
      return new Response(
        JSON.stringify({ 
          error: "Il faut au moins un vêtement dans chaque catégorie (haut, bas, chaussures)" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Créer le prompt pour Gemini
    const prompt = `En tant qu'assistant mode, suggère une tenue appropriée pour une température de ${temperature}°C et un temps ${description}.
    Choisis parmi ces vêtements disponibles:
    
    Hauts disponibles: ${availableClothes.tops.map((t: any) => `${t.name} (ID: ${t.id})`).join(', ')}
    
    Bas disponibles: ${availableClothes.bottoms.map((b: any) => `${b.name} (ID: ${b.id})`).join(', ')}
    
    Chaussures disponibles: ${availableClothes.shoes.map((s: any) => `${s.name} (ID: ${s.id})`).join(', ')}
    
    Réponds UNIQUEMENT avec un JSON au format suivant:
    {
      "suggestion": {
        "top": "ID_DU_HAUT",
        "bottom": "ID_DU_BAS",
        "shoes": "ID_DES_CHAUSSURES"
      },
      "explanation": "EXPLICATION_DU_CHOIX"
    }
    Attention: les IDs doivent être exactement tels qu'indiqués (ID: xxx) sans modification.`

    console.log("Envoi de la requête à Gemini");
    
    try {
      // Obtenir la réponse de Gemini
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log("Réponse de Gemini reçue:", text);
      
      // Parser la réponse JSON
      let suggestion;
      try {
        // Nettoyer la réponse au cas où elle contient des backticks ou des markers JSON
        const cleanedText = text.replace(/```json|```/g, '').trim();
        suggestion = JSON.parse(cleanedText);
        console.log("Suggestion parsée:", JSON.stringify(suggestion));
      } catch (e) {
        console.error("Erreur lors du parsing de la réponse Gemini:", e);
        console.error("Texte reçu:", text);
        throw new Error("Format de réponse invalide");
      }

      // Valider que la suggestion contient les bons champs
      if (!suggestion || !suggestion.suggestion || !suggestion.explanation) {
        throw new Error("La suggestion ne contient pas tous les champs requis");
      }

      // Validation des IDs
      const { top, bottom, shoes } = suggestion.suggestion;
      
      if (!top || !bottom || !shoes) {
        throw new Error("Certains IDs de vêtements sont manquants dans la suggestion");
      }

      console.log(`Recherche des vêtements avec IDs: ${top}, ${bottom}, ${shoes}`);

      // Valider et retourner la suggestion
      return new Response(
        JSON.stringify(suggestion),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (aiError) {
      console.error("Erreur avec l'API Gemini:", aiError);
      
      // Fallback: sélectionner aléatoirement des vêtements
      console.log("Utilisation du fallback: sélection aléatoire");
      const randomTop = availableClothes.tops[Math.floor(Math.random() * availableClothes.tops.length)];
      const randomBottom = availableClothes.bottoms[Math.floor(Math.random() * availableClothes.bottoms.length)];
      const randomShoes = availableClothes.shoes[Math.floor(Math.random() * availableClothes.shoes.length)];
      
      return new Response(
        JSON.stringify({
          suggestion: {
            top: randomTop.id,
            bottom: randomBottom.id,
            shoes: randomShoes.id
          },
          explanation: `Pour une température de ${temperature}°C avec un temps ${description}, voici une tenue adaptée (sélection automatique).`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Erreur générale:', error);
    return new Response(
      JSON.stringify({ error: error.message || "Une erreur s'est produite" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
