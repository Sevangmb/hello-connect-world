
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, name, description, category } = await req.json();
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    // Construire le prompt en fonction du type (vêtement ou tenue)
    let prompt = '';
    if (type === 'clothes') {
      prompt = `Génère 5 hashtags pertinents en français pour un vêtement avec les caractéristiques suivantes:
        - Nom: ${name}
        - Description: ${description || 'Non spécifié'}
        - Catégorie: ${category}
        Réponds uniquement avec les hashtags, un par ligne, sans le symbole #.`;
    } else {
      prompt = `Génère 5 hashtags pertinents en français pour une tenue appelée "${name}" avec la description: "${description || 'Non spécifié'}"
        Réponds uniquement avec les hashtags, un par ligne, sans le symbole #.`;
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data = await response.json();
    let hashtags = [];
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      hashtags = data.candidates[0].content.parts[0].text
        .split('\n')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .map(tag => tag.replace(/^#/, '')); // Supprimer le # si présent
    }

    // Enregistrer les hashtags dans la base de données
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    for (const tag of hashtags) {
      const { data: existingHashtag, error: searchError } = await supabase
        .from('hashtags')
        .select('id')
        .eq('name', tag)
        .single();

      if (!existingHashtag && !searchError) {
        await supabase
          .from('hashtags')
          .insert({ name: tag });
      }
    }

    return new Response(JSON.stringify({ hashtags }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
