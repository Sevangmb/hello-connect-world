
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { personImage, clothingImage } = await req.json()
    const HF_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')

    if (!HF_TOKEN) {
      throw new Error('Hugging Face token not configured')
    }

    if (!personImage || !clothingImage) {
      throw new Error('Both person and clothing images are required')
    }

    console.log('Fetching images from URLs:', { personImage, clothingImage })

    const [personResponse, clothingResponse] = await Promise.all([
      fetch(personImage),
      fetch(clothingImage)
    ]).catch(error => {
      console.error('Error fetching images:', error)
      throw new Error('Failed to fetch images')
    });

    if (!personResponse.ok || !clothingResponse.ok) {
      console.error('Image fetch responses:', {
        person: personResponse.status,
        clothing: clothingResponse.status
      })
      throw new Error('Failed to fetch images')
    }

    const [personBuffer, clothingBuffer] = await Promise.all([
      personResponse.arrayBuffer(),
      clothingResponse.arrayBuffer()
    ]).catch(error => {
      console.error('Error reading image buffers:', error)
      throw new Error('Failed to process images')
    });

    // Convert array buffers to base64
    const personBase64 = btoa(String.fromCharCode(...new Uint8Array(personBuffer)));
    const clothingBase64 = btoa(String.fromCharCode(...new Uint8Array(clothingBuffer)));

    console.log('Successfully converted images to base64')

    const hf = new HfInference(HF_TOKEN)

    console.log('Starting virtual try-on process')

    try {
      // Using InstantID model which is better suited for virtual try-on
      const result = await hf.imageToImage({
        model: "InstantX/InstantID",
        inputs: {
          image: `data:image/jpeg;base64,${personBase64}`,
          prompt: "Generate a realistic image of a person wearing the clothing, maintain facial features, natural lighting, high quality",
          negative_prompt: "deformed, distorted, unrealistic, poor quality, blurry",
          seed: Math.floor(Math.random() * 1000000),
          num_inference_steps: 30,
          guidance_scale: 7.5,
          controlnet_conditioning_scale: 1.0,
          mask_image: `data:image/jpeg;base64,${clothingBase64}`
        },
      })

      console.log('Successfully generated result from API')

      const arrayBuffer = await result.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      const resultImage = `data:image/jpeg;base64,${base64}`

      console.log('Successfully encoded result as base64')

      return new Response(
        JSON.stringify({ resultImage }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } catch (error) {
      console.error('Error in HuggingFace API call:', error)
      throw new Error(`Failed to generate virtual try-on image: ${error.message}`)
    }
  } catch (error) {
    console.error('Error in virtual try-on:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
