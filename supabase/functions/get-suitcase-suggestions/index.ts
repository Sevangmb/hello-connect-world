
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { startDate, endDate, destination, currentClothes } = await req.json();

    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!hfToken) {
      throw new Error("Hugging Face token not configured");
    }

    const hf = new HfInference(hfToken);

    const prompt = `En tant que styliste, suggère des vêtements supplémentaires pour un voyage ${destination ? `à ${destination}` : ''} 
    ${startDate ? `du ${startDate}` : ''} ${endDate ? `au ${endDate}` : ''}.
    
    Les vêtements déjà dans la valise sont: ${currentClothes.map(c => c.name).join(', ')}.
    
    Propose une liste de 3-5 vêtements supplémentaires à ajouter, en tenant compte de ceux déjà présents.
    Réponds de manière concise en français, en format liste à puces.`;

    const response = await hf.textGeneration({
      model: "tiiuae/falcon-7b-instruct",
      inputs: prompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        return_full_text: false,
      }
    });

    return new Response(JSON.stringify({ suggestions: response.generated_text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-suitcase-suggestions:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
