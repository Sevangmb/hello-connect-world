
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Début de la fonction generate-outfit-suggestion-hf");
    const { temperature, description, clothes } = await req.json()

    if (!clothes || clothes.length === 0) {
      console.error("Aucun vêtement disponible dans la garde-robe");
      return new Response(
        JSON.stringify({ error: "Aucun vêtement disponible dans la garde-robe" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    // Formatage des vêtements par catégorie
    const availableClothes = {
      tops: clothes.filter((c: any) => c.category?.toLowerCase() === 'hauts'),
      bottoms: clothes.filter((c: any) => c.category?.toLowerCase() === 'bas'),
      shoes: clothes.filter((c: any) => c.category?.toLowerCase() === 'chaussures')
    }

    const prompt = `En tant qu'assistant mode expert, suggère une tenue appropriée pour une température de ${temperature}°C et un temps ${description}.
    
    Choisis parmi ces vêtements disponibles:
    Hauts: ${availableClothes.tops.map((t: any) => `${t.name} (ID: ${t.id})`).join(', ')}
    Bas: ${availableClothes.bottoms.map((b: any) => `${b.name} (ID: ${b.id})`).join(', ')}
    Chaussures: ${availableClothes.shoes.map((s: any) => `${s.name} (ID: ${s.id})`).join(', ')}

    Réponds uniquement au format JSON suivant, sans texte supplémentaire:
    {
      "suggestion": {
        "top": "ID_DU_HAUT",
        "bottom": "ID_DU_BAS",
        "shoes": "ID_DES_CHAUSSURES"
      },
      "explanation": "EXPLICATION_DU_CHOIX"
    }`

    const response = await hf.textGeneration({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false
      }
    })

    try {
      const cleanedText = response.generated_text.replace(/```json|```/g, '').trim()
      const suggestion = JSON.parse(cleanedText)

      if (!suggestion || !suggestion.suggestion || !suggestion.explanation) {
        throw new Error("Format de réponse invalide")
      }

      return new Response(
        JSON.stringify(suggestion),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (parseError) {
      console.error("Erreur de parsing:", parseError)
      return new Response(
        JSON.stringify({ error: "Format de réponse invalide de Hugging Face" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

  } catch (error) {
    console.error('Erreur:', error)
    return new Response(
      JSON.stringify({ error: error.message || "Une erreur s'est produite" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
