
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

    if (!imageUrl) {
      throw new Error('Image URL is required')
    }

    console.log('Starting label scanning process...')
    console.log('Image URL:', imageUrl)

    // Fetch the image
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
    }

    // Ensure we're getting binary data
    const arrayBuffer = await imageResponse.arrayBuffer()
    const imageBlob = new Blob([arrayBuffer], { type: imageResponse.headers.get('content-type') || 'image/jpeg' })

    const hf = new HfInference(HF_TOKEN)
    
    // Use simpler questions for better accuracy
    const questions = [
      "What is the brand name?",
      "What is the size?",
      "What is the material composition?",
      "What are the care instructions?",
      "What is the main color of the garment?",
      "What type of clothing item is this (eg: shirt, pants, dress, etc)?",
    ]

    console.log('Analyzing label with LayoutLM...')
    
    // Process each question separately for better accuracy
    const results = await Promise.all(questions.map(async (question) => {
      try {
        const result = await hf.documentQuestionAnswering({
          model: 'impira/layoutlm-document-qa',
          inputs: {
            image: imageBlob,
            question: question
          }
        })
        return result
      } catch (error) {
        console.error(`Error processing question "${question}":`, error)
        return { answer: '' }
      }
    }))

    console.log('LayoutLM results:', results)

    // Use image classification for backup category detection
    console.log('Running additional image classification...')
    let classificationResult = null
    try {
      classificationResult = await hf.imageClassification({
        model: "patrickjohncyh/fashion-clip",
        inputs: imageBlob,
      });
      console.log('Classification result:', classificationResult)
    } catch (error) {
      console.error('Error during classification:', error)
    }

    // Use image captioning as backup
    console.log('Running additional image analysis...')
    const vision = await hf.imageToText({
      model: "Salesforce/blip-image-captioning-base",
      inputs: imageBlob,
    })

    console.log('Vision analysis result:', vision)

    // Map detected clothing type to category
    const mapToCategory = (item: string): string => {
      item = item.toLowerCase()
      if (item.includes('shirt') || item.includes('top') || item.includes('blouse') || item.includes('sweater') || item.includes('t-shirt')) return 'Hauts'
      if (item.includes('pants') || item.includes('jeans') || item.includes('shorts') || item.includes('skirt')) return 'Bas'
      if (item.includes('dress')) return 'Robes'
      if (item.includes('coat') || item.includes('jacket')) return 'Manteaux'
      if (item.includes('shoes') || item.includes('boots') || item.includes('sneakers')) return 'Chaussures'
      if (item.includes('hat') || item.includes('scarf') || item.includes('belt') || item.includes('accessory')) return 'Accessoires'
      return ''
    }

    // Determine category from various sources
    let detectedCategory = ''
    const typeAnswer = results[5]?.answer || ''
    if (typeAnswer) {
      detectedCategory = mapToCategory(typeAnswer)
    }
    if (!detectedCategory && classificationResult?.[0]?.label) {
      detectedCategory = mapToCategory(classificationResult[0].label)
    }

    // Extract and structure the information
    const extractedInfo = {
      brand: results[0]?.answer || null,
      size: results[1]?.answer || null,
      material: results[2]?.answer || null,
      careInstructions: results[3]?.answer || null,
      color: results[4]?.answer || null,
      category: detectedCategory || null,
      rawCaption: vision || null,
      classificationData: classificationResult
    }

    console.log('Extracted information:', extractedInfo)

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
