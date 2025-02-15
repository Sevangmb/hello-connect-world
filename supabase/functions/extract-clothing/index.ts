
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

    if (!image || typeof image !== 'string') {
      console.error('Invalid or missing image URL:', image)
      throw new Error('Image URL is required and must be a string')
    }

    console.log('Starting clothing extraction process...')
    console.log('Input image URL:', image)

    // Fetch the image and get the blob
    const response = await fetch(image)
    if (!response.ok) {
      console.error('Failed to fetch image:', response.status, response.statusText)
      throw new Error('Failed to fetch image')
    }
    
    const imageBlob = await response.blob()
    if (!imageBlob || imageBlob.size === 0) {
      console.error('Invalid image blob:', imageBlob)
      throw new Error('Invalid image data')
    }

    console.log('Successfully fetched image, size:', imageBlob.size, 'bytes')
    console.log('Image type:', imageBlob.type)

    const hf = new HfInference(HF_TOKEN)
    
    console.log('Attempting clothing extraction with model: mattmdjaga/segformer_b2_clothes')
    
    const result = await hf.imageSegmentation({
      model: 'mattmdjaga/segformer_b2_clothes',
      inputs: imageBlob,
      parameters: {
        threshold: 0.5
      }
    })

    console.log('Successfully generated mask')

    if (result instanceof Blob) {
      const arrayBuffer = await result.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      const maskImage = `data:image/png;base64,${base64}`

      return new Response(
        JSON.stringify({ maskImage }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error('Unexpected response format from Hugging Face API')
    }
  } catch (error) {
    console.error('Error in clothing extraction:', error)
    return new Response(
      JSON.stringify({ error: `Erreur lors de l'extraction du vêtement: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
