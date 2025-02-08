
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

    const hf = new HfInference(HF_TOKEN)

    // Instead of modelInfo, we'll directly try to use the model
    // and let any errors be caught by our error handling
    console.log('Attempting virtual try-on with model: DreamTech/tryondiffusion')
    
    const result = await hf.imageToImage({
      model: 'DreamTech/tryondiffusion',
      inputs: {
        image: personImage,
        clothing: clothingImage
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
      JSON.stringify({ error: `Erreur lors de l'essayage virtuel: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
