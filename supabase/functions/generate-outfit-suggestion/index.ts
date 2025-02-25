
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { temperature, description, clothes } = await req.json();
    console.log("Received request:", { temperature, description, clothesCount: clothes?.length });

    if (!clothes || clothes.length === 0) {
      return new Response(
        JSON.stringify({ error: "No clothes provided" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Séparation des vêtements par catégorie
    const tops = clothes.filter(c => ["Haut", "T-shirt", "Pull", "Chemise", "Veste"].includes(c.category));
    const bottoms = clothes.filter(c => ["Pantalon", "Jupe", "Short"].includes(c.category));
    const shoes = clothes.filter(c => ["Chaussures"].includes(c.category));

    console.log("Clothes by category:", {
      tops: tops.length,
      bottoms: bottoms.length,
      shoes: shoes.length
    });

    if (!tops.length || !bottoms.length || !shoes.length) {
      return new Response(
        JSON.stringify({ 
          error: "Not enough clothes to make a suggestion",
          details: "Need at least one item in each category (top, bottom, shoes)"
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Logique de sélection basée sur la température
    let selectedTop, selectedBottom, selectedShoes;

    if (temperature <= 10) {
      // Temps froid : privilégier les pulls et vestes
      selectedTop = tops.find(t => ["Pull", "Veste"].includes(t.category)) || tops[0];
    } else if (temperature <= 20) {
      // Temps modéré : chemises ou t-shirts
      selectedTop = tops.find(t => ["Chemise", "T-shirt"].includes(t.category)) || tops[0];
    } else {
      // Temps chaud : t-shirts
      selectedTop = tops.find(t => t.category === "T-shirt") || tops[0];
    }

    // Sélection du bas en fonction de la température
    if (temperature <= 15) {
      selectedBottom = bottoms.find(b => b.category === "Pantalon") || bottoms[0];
    } else if (temperature <= 25) {
      // Temps modéré : pantalon ou jupe
      selectedBottom = bottoms[0];
    } else {
      // Temps chaud : short ou jupe de préférence
      selectedBottom = bottoms.find(b => ["Short", "Jupe"].includes(b.category)) || bottoms[0];
    }

    // Sélection des chaussures (simple pour l'instant)
    selectedShoes = shoes[0];

    // Génération de l'explication
    let explanation = `Pour une température de ${temperature}°C et un temps ${description}, `
      + `je suggère de porter ${selectedTop.name.toLowerCase()} avec ${selectedBottom.name.toLowerCase()} `
      + `et ${selectedShoes.name.toLowerCase()}. `;

    if (temperature <= 10) {
      explanation += "Cette tenue vous gardera au chaud par ce temps froid.";
    } else if (temperature <= 20) {
      explanation += "Cette combinaison est parfaite pour un temps modéré.";
    } else {
      explanation += "Cette tenue légère est idéale pour ce temps chaud.";
    }

    const suggestion = {
      suggestion: {
        top: selectedTop.id,
        bottom: selectedBottom.id,
        shoes: selectedShoes.id
      },
      explanation
    };

    console.log("Generated suggestion:", suggestion);

    return new Response(
      JSON.stringify(suggestion),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error("Error in generate-outfit-suggestion:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to generate outfit suggestion",
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
