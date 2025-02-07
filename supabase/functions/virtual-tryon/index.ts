
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
    const { personImage, clothingImage } = await req.json()
    const HF_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')

    if (!HF_TOKEN) {
      throw new Error('Hugging Face token not configured')
    }

    console.log('Fetching images from URLs:', { personImage, clothingImage })

    // Fetch the images and convert them to array buffers
    const [personResponse, clothingResponse] = await Promise.all([
      fetch(personImage),
      fetch(clothingImage)
    ]);

    if (!personResponse.ok || !clothingResponse.ok) {
      throw new Error('Failed to fetch images')
    }

    // Convert responses to array buffers
    const [personBuffer, clothingBuffer] = await Promise.all([
      personResponse.arrayBuffer(),
      clothingResponse.arrayBuffer()
    ]);

    console.log('Successfully fetched image data')

    // Create Uint8Array from buffers
    const personUint8 = new Uint8Array(personBuffer)
    const clothingUint8 = new Uint8Array(clothingBuffer)

    const hf = new HfInference(HF_TOKEN)

    console.log('Starting virtual try-on process')

    const result = await hf.imageToImage({
      model: "lllyasviel/control_v11p_sd15_inpaint",
      inputs: {
        image: personUint8,
        prompt: "person wearing clothes, high quality, detailed",
        mask_image: clothingUint8
      },
    })

    console.log('Successfully generated result from API')

    const arrayBuffer = await result.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    const resultImage = `data:image/png;base64,${base64}`

    console.log('Successfully encoded result as base64')

    return new Response(
      JSON.stringify({ resultImage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in virtual try-on:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
