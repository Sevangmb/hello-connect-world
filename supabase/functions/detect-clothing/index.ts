
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Gérer les requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()
    console.log("URL de l'image reçue:", imageUrl)

    const accessToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
    if (!accessToken) {
      throw new Error('HUGGING_FACE_ACCESS_TOKEN is not set')
    }

    const hf = new HfInference(accessToken)

    // Détection de la catégorie
    console.log("Détection de la catégorie en cours...")
    const classification = await hf.imageClassification({
      data: imageUrl,
      model: "apple/mobilenet-v3-small",
    })
    console.log("Résultats de la détection de catégorie:", classification)

    // Détection de la couleur
    console.log("Détection de la couleur en cours...")
    const colorDetection = await hf.imageClassification({
      data: imageUrl,
      model: "nateraw/color-detection",
    })
    console.log("Résultats de la détection de couleur:", colorDetection)

    const categoryLabel = classification[0]?.label?.toLowerCase() || ''
    const colorLabel = colorDetection[0]?.label?.toLowerCase() || ''

    // Mapping des couleurs en français
    const colorMap = {
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

    // Mapping des catégories en français
    const categoryMap = {
      't-shirt': 'Hauts',
      'shirt': 'Hauts',
      'tshirt': 'Hauts',
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
      confidence: {
        category: classification[0]?.score || 0,
        color: colorDetection[0]?.score || 0
      }
    }

    console.log("Résultat de la détection:", result)
    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200
      }
    )
  } catch (error) {
    console.error('Erreur lors de la détection:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200 // On retourne 200 même en cas d'erreur pour éviter l'erreur non-2xx
      }
    )
  }
})
