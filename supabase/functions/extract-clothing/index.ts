
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
    const { image } = await req.json()
    const HF_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')

    if (!HF_TOKEN) {
      throw new Error('Hugging Face token not configured')
    }

    console.log('Starting clothing extraction process...')
    console.log('Input image:', image)

    const hf = new HfInference(HF_TOKEN)

    // Remove the modelInfo check and directly use the model
    console.log('Attempting clothing extraction with model: Xhahh/u2net-cloth-segmentation')
    
    const result = await hf.imageSegmentation({
      model: 'Xhahh/u2net-cloth-segmentation',
      inputs: image
    })

    console.log('Successfully generated mask')

    const arrayBuffer = await result.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    const maskImage = `data:image/png;base64,${base64}`

    return new Response(
      JSON.stringify({ maskImage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in clothing extraction:', error)
    return new Response(
      JSON.stringify({ error: `Erreur lors de l'extraction du vêtement: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
