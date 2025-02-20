
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

    // Classify the image with Hugging Face's API
    const classification = await hf.imageClassification({
      model: 'apple/mobilenet-v3-small',
      data: imageUrl,
    })
    console.log("Classification results:", classification)

    // Detect color using another model
    const colorDetection = await hf.imageClassification({
      model: 'nateraw/color-detection',
      data: imageUrl,
    })
    console.log("Color detection results:", colorDetection)

    const category = classification[0]?.label || ''
    const color = colorDetection[0]?.label || ''

    // Map the detected category to our application's categories
    const categoryMap: Record<string, string> = {
      'tshirt': 'Hauts',
      'shirt': 'Hauts',
      'sweater': 'Hauts',
      'dress': 'Robes',
      'pants': 'Bas',
      'jeans': 'Bas',
      'coat': 'Manteaux',
      'jacket': 'Manteaux',
      'shoes': 'Chaussures',
      'sneakers': 'Chaussures',
      'boots': 'Chaussures',
      'necklace': 'Accessoires',
      'hat': 'Accessoires',
      'bag': 'Accessoires'
    }

    const result = {
      category: categoryMap[category.toLowerCase()] || category,
      color: color
    }
    console.log("Sending response:", result)

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to detect clothing', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
