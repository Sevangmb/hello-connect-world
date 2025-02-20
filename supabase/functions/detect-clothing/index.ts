
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
    const { imageUrl } = await req.json()
    console.log("Received image URL:", imageUrl)

    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    // Détecter la catégorie avec un modèle plus précis
    const classification = await hf.imageClassification({
      model: 'apple/mobilenet-v3-small',
      data: imageUrl,
    })
    console.log("Classification results:", classification)

    // Détecter la couleur avec un modèle spécialisé
    const colorDetection = await hf.imageClassification({
      model: 'nateraw/color-detection',
      data: imageUrl,
    })
    console.log("Color detection results:", colorDetection)

    const categoryLabel = classification[0]?.label?.toLowerCase() || ''
    const colorLabel = colorDetection[0]?.label?.toLowerCase() || ''

    // Map des couleurs vers le français
    const colorMap: Record<string, string> = {
      'red': 'Rouge',
      'green': 'Vert',
      'blue': 'Bleu',
      'yellow': 'Jaune',
      'orange': 'Orange',
      'purple': 'Violet',
      'pink': 'Rose',
      'brown': 'Marron',
      'gray': 'Gris',
      'black': 'Noir',
      'white': 'Blanc',
    }

    // Map des catégories vers le français
    const categoryMap: Record<string, string> = {
      't-shirt': 'Hauts',
      'tshirt': 'Hauts',
      'shirt': 'Hauts',
      'blouse': 'Hauts',
      'sweater': 'Hauts',
      'dress': 'Robes',
      'pants': 'Bas',
      'trousers': 'Bas',
      'jeans': 'Bas',
      'skirt': 'Bas',
      'coat': 'Manteaux',
      'jacket': 'Manteaux',
      'shoes': 'Chaussures',
      'sneakers': 'Chaussures',
      'boots': 'Chaussures',
      'necklace': 'Accessoires',
      'earrings': 'Accessoires',
      'hat': 'Accessoires',
      'bag': 'Accessoires',
      'scarf': 'Accessoires',
    }

    const result = {
      category: categoryMap[categoryLabel] || null,
      color: colorMap[colorLabel] || colorLabel.charAt(0).toUpperCase() + colorLabel.slice(1),
    }

    console.log("Sending detection result:", result)
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error detecting clothing:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to detect clothing', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
