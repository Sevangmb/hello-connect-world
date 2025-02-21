
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Liste des couleurs standardisées en français
const VALID_COLORS = [
  "noir", "blanc", "gris", "rouge", "bleu", "vert", "jaune", "orange", 
  "violet", "rose", "marron", "beige", "doré", "argenté", "multicolore"
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()
    
    if (!imageUrl) {
      throw new Error('No image URL provided')
    }

    console.log('Processing image:', imageUrl)

    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image')
    }
    const imageBlob = await imageResponse.blob()

    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' })

    const imageData = {
      inlineData: {
        data: await blobToBase64(imageBlob),
        mimeType: imageResponse.headers.get('content-type') || 'image/jpeg'
      }
    }

    const prompt = `Tu es un expert en mode qui analyse cette image de vêtement.
    Retourne uniquement un JSON avec ces informations (pas de texte avant ou après) :
    {
      "category": type exact parmi cette liste (Hauts, Bas, Robes, Manteaux, Chaussures, Accessoires),
      "color": la couleur dominante parmi cette liste uniquement (${VALID_COLORS.join(', ')}),
      "material": le matériau principal si visible en français (ex: coton, laine, cuir, jean, etc),
      "style": le style vestimentaire parmi (Casual, Formel, Sport, Vintage, Bohème),
      "brand": la marque si visible,
      "description": courte description en français du vêtement,
      "weather_categories": tableau avec les saisons adaptées parmi [Été, Hiver, Mi-saison]
    }
    Important: Pour la couleur, utilise UNIQUEMENT une des valeurs de la liste fournie, en minuscules.
    Si une information n'est pas visible ou incertaine, mets null.`

    console.log('Sending request to Gemini...')
    
    const result = await model.generateContent([prompt, imageData])
    const response = await result.response
    const text = response.text()
    
    console.log('Gemini response:', text)

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse Gemini response')
    }

    const detectedInfo = JSON.parse(jsonMatch[0])

    // Validation de la couleur
    if (detectedInfo.color && !VALID_COLORS.includes(detectedInfo.color.toLowerCase())) {
      detectedInfo.color = null;
      console.warn('Invalid color detected, setting to null');
    }

    console.log('Parsed detection results:', detectedInfo)

    return new Response(
      JSON.stringify(detectedInfo),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  return btoa(String.fromCharCode(...bytes))
}
