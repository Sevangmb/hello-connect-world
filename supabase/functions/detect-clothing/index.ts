
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
    const { imageUrl } = await req.json()
    
    if (!imageUrl) {
      throw new Error('Missing imageUrl')
    }

    console.log('Processing image:', imageUrl)
    
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    // Detect objects in the image using the DETR model
    const objectDetection = await hf.objectDetection({
      model: "facebook/detr-resnet-50",
      inputs: imageUrl,
    })

    console.log('Detection results:', objectDetection)

    // Analyze image with the fashion model
    const fashionAnalysis = await hf.imageClassification({
      model: "patrickjohncyh/fashion-clip",
      inputs: imageUrl,
    })

    console.log('Fashion analysis:', fashionAnalysis)

    // Map the detected features to our format
    const category = fashionAnalysis[0]?.label?.split('/')[0] || ''
    const subcategory = fashionAnalysis[0]?.label?.split('/')[1] || ''

    // Get colors using another specialized model
    const colorAnalysis = await hf.imageClassification({
      model: "vincentclaes/color-recognition",
      inputs: imageUrl,
    })

    console.log('Color analysis:', colorAnalysis)

    const color = colorAnalysis[0]?.label || ''

    // Extract style and material information using another model
    const visualAnalysis = await hf.imageClassification({
      model: "microsoft/resnet-50",
      inputs: imageUrl,
    })

    console.log('Visual analysis:', visualAnalysis)

    const detectionResult = {
      category,
      subcategory,
      color,
      material: visualAnalysis.find(v => v.label.includes('material'))?.label || undefined,
      style: visualAnalysis.find(v => v.label.includes('style'))?.label || undefined,
      description: `${color} ${category} ${subcategory}`.trim()
    }
    
    console.log('Final detection result:', detectionResult)

    return new Response(
      JSON.stringify(detectionResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
