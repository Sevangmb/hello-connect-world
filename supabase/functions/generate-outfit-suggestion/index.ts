
// Follow Supabase Edge Function conventions
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { temperature, description, clothes } = await req.json();
    console.log("Received request with:", { temperature, description, clothesCount: clothes?.length });

    if (!clothes || clothes.length === 0) {
      return new Response(
        JSON.stringify({ error: "No clothes provided" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Construire le prompt pour le modèle
    const prompt = `En tant qu'assistant de mode, suggère une tenue appropriée pour une température de ${temperature}°C avec un temps ${description}. 
    Voici les vêtements disponibles: ${JSON.stringify(clothes.map(c => ({ id: c.id, name: c.name, category: c.category })))}.
    Choisis les vêtements les plus appropriés et explique pourquoi. Donne ta réponse en JSON avec le format suivant:
    {
      "suggestion": {
        "top": "ID_DU_HAUT",
        "bottom": "ID_DU_BAS",
        "shoes": "ID_DES_CHAUSSURES"
      },
      "explanation": "EXPLICATION_DU_CHOIX"
    }`;

    // Appeler l'API Hugging Face
    console.log("Sending request to Hugging Face API");
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Received response from Hugging Face:", result);

    // Extraire la réponse JSON du texte généré
    const text = Array.isArray(result) ? result[0].generated_text : result.generated_text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Couldn't find JSON in the response");
    }

    const suggestionData = JSON.parse(jsonMatch[0]);
    console.log("Parsed suggestion data:", suggestionData);

    if (!suggestionData.suggestion || !suggestionData.explanation) {
      throw new Error("Invalid response format from model");
    }

    return new Response(
      JSON.stringify(suggestionData),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error in generate-outfit-suggestion:', error);
    
    const errorMessage = error.message || "Internal server error";
    const status = error.message.includes("Invalid response format") ? 422 : 500;
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.stack
      }),
      { 
        status,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
