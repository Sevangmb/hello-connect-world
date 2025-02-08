
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

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
    const { personImage, clothingImage } = await req.json()
    const HF_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')

    if (!HF_TOKEN) {
      throw new Error('Hugging Face token not configured')
    }

    console.log('Starting virtual try-on process...')
    console.log('Person image:', personImage)
    console.log('Clothing image:', clothingImage)

    const hf = new HfInference(HF_TOKEN)

    // Use microsoft/brought-live-image-animation for virtual try-on
    const result = await hf.imageToImage({
      model: "microsoft/brought-live-image-animation",
      inputs: {
        source_image: personImage,
        target_image: clothingImage,
      },
    })

    console.log('Successfully generated try-on image')

    const arrayBuffer = await result.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    const resultImage = `data:image/png;base64,${base64}`

    return new Response(
      JSON.stringify({ resultImage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in virtual try-on:', error)
    return new Response(
      JSON.stringify({ error: `Failed to generate virtual try-on image: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
