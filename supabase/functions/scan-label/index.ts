
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
    const { imageUrl } = await req.json()
    const HF_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')

    if (!HF_TOKEN) {
      throw new Error('Hugging Face token not configured')
    }

    console.log('Starting label scanning process...')
    console.log('Image URL:', imageUrl)

    // Fetch the image
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image')
    }
    const imageBlob = await imageResponse.blob()

    const hf = new HfInference(HF_TOKEN)
    
    // Utiliser Microsoft's Layout-LM pour l'extraction d'informations des étiquettes
    console.log('Analyzing label with LayoutLM...')
    const result = await hf.documentQuestionAnswering({
      model: 'impira/layoutlm-document-qa',
      inputs: {
        image: imageBlob,
        question: "What is the brand, size, material, and care instructions?"
      }
    })

    console.log('Label analysis result:', result)

    // Analyse plus détaillée avec GPT-4-vision pour extraire des informations spécifiques
    const vision = await hf.visualQuestionAnswering({
      model: "nlpconnect/vit-gpt2-image-captioning",
      inputs: {
        image: imageBlob,
        question: "What brand, size, and material information can you see on this clothing label?"
      }
    })

    console.log('Vision analysis result:', vision)

    // Combiner et structurer les résultats
    const extractedInfo = {
      brand: result.answer.match(/brand:\s*([^,\n]*)/i)?.[1]?.trim() || null,
      size: result.answer.match(/size:\s*([^,\n]*)/i)?.[1]?.trim() || null,
      material: result.answer.match(/material:\s*([^,\n]*)/i)?.[1]?.trim() || null,
      careInstructions: result.answer.match(/care instructions:\s*([^,\n]*)/i)?.[1]?.trim() || null
    }

    return new Response(
      JSON.stringify(extractedInfo),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in label scanning:', error)
    return new Response(
      JSON.stringify({ error: `Erreur lors de l'analyse de l'étiquette: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
