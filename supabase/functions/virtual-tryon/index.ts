
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

    console.log('Starting virtual try-on process...')
    console.log('Person image:', personImage)
    console.log('Clothing image:', clothingImage)

    // Fetch the images
    const fetchPersonImage = await fetch(personImage)
    const fetchClothingImage = await fetch(clothingImage)
    
    if (!fetchPersonImage.ok || !fetchClothingImage.ok) {
      throw new Error('Failed to fetch images')
    }

    const personImageBlob = await fetchPersonImage.blob()
    const clothingImageBlob = await fetchClothingImage.blob()

    const hf = new HfInference(HF_TOKEN)
    
    console.log('Attempting virtual try-on with model: CVPR/try-on-diffusion')
    
    const response = await hf.imageToImage({
      model: 'CVPR/try-on-diffusion',
      inputs: {
        image: personImageBlob,
        cloth: clothingImageBlob,
      },
      parameters: {
        num_inference_steps: 50,
        guidance_scale: 7.5,
      }
    })

    console.log('Successfully generated try-on image')
    
    // Convert response to base64
    if (response instanceof Blob) {
      const arrayBuffer = await response.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      const resultImage = `data:image/png;base64,${base64}`

      return new Response(
        JSON.stringify({ resultImage }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error('Unexpected response format from Hugging Face API')
    }
  } catch (error) {
    console.error('Error in virtual try-on:', error)
    return new Response(
      JSON.stringify({ error: `Erreur lors de l'essayage virtuel: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
