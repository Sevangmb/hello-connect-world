
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
    const requestData = await req.json()
    console.log('Received request data:', requestData)

    if (!requestData || !requestData.image) {
      console.error('No image data in request:', requestData)
      throw new Error('Image data is required')
    }

    const { image } = requestData
    const HF_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')

    if (!HF_TOKEN) {
      console.error('Hugging Face token not configured')
      throw new Error('Hugging Face token not configured')
    }

    if (!image || typeof image !== 'string') {
      console.error('Invalid image URL format:', image)
      throw new Error('Image URL must be a string')
    }

    console.log('Fetching image from URL:', image)
    const response = await fetch(image)
    
    if (!response.ok) {
      console.error('Failed to fetch image:', response.status, response.statusText)
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
    }

    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    // Get the image directly as a Blob with the correct type
    const imageBlob = await response.blob()
    console.log('Image blob:', {
      size: imageBlob.size,
      type: imageBlob.type
    })

    if (!imageBlob || imageBlob.size === 0) {
      console.error('Empty image blob')
      throw new Error('Empty image data')
    }

    const hf = new HfInference(HF_TOKEN)
    console.log('Starting image segmentation with model: mattmdjaga/segformer_b2_clothes')
    
    try {
      const result = await hf.imageSegmentation({
        model: 'mattmdjaga/segformer_b2_clothes',
        inputs: imageBlob,
      })

      console.log('Segmentation result type:', typeof result)
      if (result instanceof Blob) {
        const maskArrayBuffer = await result.arrayBuffer()
        const base64 = btoa(String.fromCharCode(...new Uint8Array(maskArrayBuffer)))
        const maskImage = `data:image/png;base64,${base64}`

        return new Response(
          JSON.stringify({ maskImage }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else {
        console.error('Unexpected result format:', result)
        throw new Error('Unexpected response format from Hugging Face API')
      }
    } catch (e) {
      console.error('Error during Hugging Face API call:', e)
      throw new Error(`Hugging Face API error: ${e.message}`)
    }
  } catch (error) {
    console.error('Error in clothing extraction:', error)
    return new Response(
      JSON.stringify({ 
        error: `Erreur lors de l'extraction du vêtement: ${error.message}`,
        details: error
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
