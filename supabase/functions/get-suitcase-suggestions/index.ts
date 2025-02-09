
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const prompt = `En tant que styliste, suggère des vêtements supplémentaires pour un voyage ${destination ? `à ${destination}` : ''} 
    ${startDate ? `du ${startDate}` : ''} ${endDate ? `au ${endDate}` : ''}.
    
    Les vêtements déjà dans la valise sont: ${currentClothes.map(c => c.name).join(', ')}.
    
    Propose une liste de 3-5 vêtements supplémentaires à ajouter, en tenant compte de ceux déjà présents.
    Réponds de manière concise en français, en format liste à puces.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Tu es un assistant styliste qui fait des suggestions de vêtements concises et pertinentes.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify({ suggestions: data.choices[0].message.content }), {
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
