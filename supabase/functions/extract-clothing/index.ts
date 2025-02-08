
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

    // Use SAM model for clothing segmentation
    const result = await hf.imageSegmentation({
      model: 'nielsr/segment-anything',
      inputs: image,
      parameters: {
        points_per_side: 32,
        points_per_batch: 64,
        pred_iou_thresh: 0.88,
        stability_score_thresh: 0.95,
        min_mask_region_area: 100
      }
    })

    console.log('Successfully generated mask')

    // Convert the blob to base64
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
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
