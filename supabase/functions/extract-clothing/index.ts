
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

    const contentType = response.headers.get('content-type')
    console.log('Image content type:', contentType)
    
    if (!contentType?.startsWith('image/')) {
      console.error('Invalid content type:', contentType)
      throw new Error('URL does not point to a valid image')
    }

    // Get the image data as an ArrayBuffer first
    const arrayBuffer = await response.arrayBuffer()
    console.log('Image size:', arrayBuffer.byteLength, 'bytes')

    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      console.error('Empty image data')
      throw new Error('Empty image data')
    }

    // Convert ArrayBuffer to Blob with explicit MIME type
    const imageBlob = new Blob([arrayBuffer], { type: contentType })
    console.log('Created Blob:', {
      size: imageBlob.size,
      type: imageBlob.type
    })

    const hf = new HfInference(HF_TOKEN)
    
    console.log('Starting image segmentation with model: mattmdjaga/segformer_b2_clothes')
    try {
      const result = await hf.imageSegmentation({
        model: 'mattmdjaga/segformer_b2_clothes',
        inputs: imageBlob,
        parameters: {
          threshold: 0.5
        }
      })

      console.log('Segmentation completed, result type:', typeof result)

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
