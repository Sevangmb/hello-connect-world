
import { corsHeaders } from '../_shared/cors.ts'

const processImage = async (imageUrl: string) => {
  try {
    // Call the clothing detection API
    const response = await fetch('https://api.segment-anything.com/v1/segment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SEGMENT_API_KEY')}`
      },
      body: JSON.stringify({
        image_url: imageUrl,
        detection_type: 'clothing'
      })
    });

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    
    console.log('Detection API response:', data);

    // Map the detected features to our format
    return {
      category: data.category,
      subcategory: data.subcategory,
      color: data.dominant_color,
      material: data.material,
      style: data.style,
      brand: data.brand,
      description: data.description
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()
    
    if (!imageUrl) {
      throw new Error('Missing imageUrl')
    }

    console.log('Processing image:', imageUrl);
    
    const detectionResult = await processImage(imageUrl);
    
    console.log('Detection result:', detectionResult);

    return new Response(
      JSON.stringify(detectionResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
