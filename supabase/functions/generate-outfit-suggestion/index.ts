
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.0"

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

    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `En tant qu'expert en mode, suggère une tenue appropriée pour une température de ${temperature}°C avec un temps ${description}. 
    Voici la liste des vêtements disponibles:
    ${JSON.stringify(clothes, null, 2)}
    
    Analyse les vêtements et suggère une tenue complète en prenant en compte:
    - La température et les conditions météorologiques
    - Les catégories de temps (été, hiver, etc.) associées à chaque vêtement
    - La cohérence des styles et des couleurs
    
    Retourne la réponse au format JSON avec cette structure:
    {
      "suggestion": {
        "top": ID_DU_HAUT,
        "bottom": ID_DU_BAS,
        "shoes": ID_DES_CHAUSSURES
      },
      "explanation": "Explication du choix de la tenue"
    }`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()
    
    // Parse the JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from response")
    }
    
    const suggestionData = JSON.parse(jsonMatch[0])

    return new Response(
      JSON.stringify(suggestionData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error in generate-outfit-suggestion:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
