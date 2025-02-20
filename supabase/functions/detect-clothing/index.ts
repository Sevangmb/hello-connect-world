
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CATEGORY_MAPPING = {
  "shirt": "Hauts",
  "t-shirt": "Hauts",
  "sweater": "Hauts",
  "top": "Hauts",
  "blouse": "Hauts",
  "jacket": "Manteaux",
  "coat": "Manteaux",
  "blazer": "Manteaux",
  "pants": "Bas",
  "jeans": "Bas",
  "shorts": "Bas",
  "skirt": "Bas",
  "dress": "Robes",
  "shoes": "Chaussures",
  "sneakers": "Chaussures",
  "boots": "Chaussures",
  "sandals": "Chaussures",
  "accessories": "Accessoires",
  "bag": "Accessoires",
  "jewelry": "Accessoires",
  "scarf": "Accessoires",
  "belt": "Accessoires"
};

const COLOR_MAPPING = {
  "red": "Rouge",
  "blue": "Bleu",
  "green": "Vert",
  "yellow": "Jaune",
  "orange": "Orange",
  "purple": "Violet",
  "pink": "Rose",
  "brown": "Marron",
  "gray": "Gris",
  "black": "Noir",
  "white": "Blanc"
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();
    console.log("Received image URL:", imageUrl);

    // Vérification du token HF
    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!hfToken) {
      console.error("Hugging Face token not found");
      throw new Error("Hugging Face token not configured");
    }
    console.log("HF Token found, proceeding with detection");

    // Détection de la catégorie
    console.log("Starting category detection...");
    const categoryResponse = await fetch(
      "https://api-inference.huggingface.co/models/apple/mobilenet-v3-small",
      {
        headers: { Authorization: `Bearer ${hfToken}` },
        method: "POST",
        body: JSON.stringify({
          inputs: imageUrl,
          parameters: {
            candidate_labels: Object.keys(CATEGORY_MAPPING).join(','),
          }
        }),
      }
    );

    const categoryData = await categoryResponse.json();
    console.log("Category detection results:", categoryData);

    let detectedCategory = null;
    if (categoryData && Array.isArray(categoryData) && categoryData.length > 0) {
      const label = categoryData[0].label.toLowerCase();
      console.log("Most likely category label:", label);
      for (const [key, value] of Object.entries(CATEGORY_MAPPING)) {
        if (label.includes(key)) {
          detectedCategory = value;
          console.log("Mapped category:", detectedCategory);
          break;
        }
      }
    }

    // Détection de la couleur
    console.log("Starting color detection...");
    const colorResponse = await fetch(
      "https://api-inference.huggingface.co/models/nateraw/color-detection",
      {
        headers: { Authorization: `Bearer ${hfToken}` },
        method: "POST",
        body: JSON.stringify({
          inputs: imageUrl,
          parameters: {
            candidate_labels: Object.keys(COLOR_MAPPING).join(','),
          }
        }),
      }
    );

    const colorData = await colorResponse.json();
    console.log("Color detection results:", colorData);

    let detectedColor = null;
    if (colorData && Array.isArray(colorData) && colorData.length > 0) {
      const colorLabel = colorData[0].label.toLowerCase();
      console.log("Most likely color label:", colorLabel);
      detectedColor = COLOR_MAPPING[colorLabel] || null;
      console.log("Mapped color:", detectedColor);
    }

    const result = {
      category: detectedCategory,
      color: detectedColor
    };
    
    console.log("Final detection results:", result);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error("Error in detect-clothing:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        category: null,
        color: null 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});
