
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { temperature, description, clothes } = await req.json()

    // Initialiser Gemini
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Formater les vêtements disponibles par catégorie
    const availableClothes = {
      tops: clothes.filter((c: any) => c.category.toLowerCase() === 'hauts'),
      bottoms: clothes.filter((c: any) => c.category.toLowerCase() === 'bas'),
      shoes: clothes.filter((c: any) => c.category.toLowerCase() === 'chaussures')
    }

    // Créer le prompt pour Gemini
    const prompt = `En tant qu'assistant mode, suggère une tenue appropriée pour une température de ${temperature}°C et un temps ${description}.
    Choisis parmi ces vêtements disponibles:
    
    Hauts disponibles: ${availableClothes.tops.map((t: any) => `${t.name} (${t.brand || 'sans marque'})`).join(', ')}
    
    Bas disponibles: ${availableClothes.bottoms.map((b: any) => `${b.name} (${b.brand || 'sans marque'})`).join(', ')}
    
    Chaussures disponibles: ${availableClothes.shoes.map((s: any) => `${s.name} (${s.brand || 'sans marque'})`).join(', ')}
    
    Réponds UNIQUEMENT avec un JSON au format suivant:
    {
      "top": "ID_DU_HAUT",
      "bottom": "ID_DU_BAS",
      "shoes": "ID_DES_CHAUSSURES",
      "explanation": "EXPLICATION_DU_CHOIX"
    }
    Remplace ID_DU_HAUT, ID_DU_BAS, et ID_DES_CHAUSSURES par les IDs réels des vêtements choisis.`

    // Obtenir la réponse de Gemini
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Parser la réponse JSON
    let suggestion
    try {
      suggestion = JSON.parse(text)
    } catch (e) {
      console.error("Erreur lors du parsing de la réponse Gemini:", e)
      throw new Error("Format de réponse invalide")
    }

    // Trouver les vêtements correspondants
    const selectedTop = availableClothes.tops.find((t: any) => t.id === suggestion.top)
    const selectedBottom = availableClothes.bottoms.find((b: any) => b.id === suggestion.bottom)
    const selectedShoes = availableClothes.shoes.find((s: any) => s.id === suggestion.shoes)

    if (!selectedTop || !selectedBottom || !selectedShoes) {
      throw new Error("Certains vêtements suggérés n'ont pas été trouvés")
    }

    return new Response(
      JSON.stringify({
        suggestion: {
          top: selectedTop,
          bottom: selectedBottom,
          shoes: selectedShoes,
          explanation: suggestion.explanation
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erreur:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
