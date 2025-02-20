
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { temperature, weather } = await req.json()
    console.log("Received request for outfit suggestion:", { temperature, weather })

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Définir les catégories appropriées en fonction de la température
    let topCategories = ['T-shirt', 'Chemise']
    let bottomCategories = ['Pantalon', 'Jean']
    let weatherDescription = ""

    if (temperature < 10) {
      topCategories = ['Pull', 'Sweatshirt', 'Manteau']
      weatherDescription = "Il fait froid"
    } else if (temperature < 20) {
      topCategories = ['Pull léger', 'Sweatshirt', 'Chemise']
      weatherDescription = "Température modérée"
    } else {
      topCategories = ['T-shirt', 'Chemise légère']
      weatherDescription = "Il fait chaud"
    }

    // Vérifier les conditions météo
    if (weather.toLowerCase().includes('rain') || weather.toLowerCase().includes('pluie')) {
      topCategories.push('Imperméable')
      weatherDescription += ", temps pluvieux"
    }

    console.log("Searching for clothes with categories:", { topCategories, bottomCategories })

    // Récupérer les vêtements disponibles
    const { data: tops, error: topsError } = await supabaseClient
      .from('clothes')
      .select('id, name, category, image_url')
      .in('category', topCategories)
      .eq('archived', false)
      .limit(5)

    const { data: bottoms, error: bottomsError } = await supabaseClient
      .from('clothes')
      .select('id, name, category, image_url')
      .in('category', bottomCategories)
      .eq('archived', false)
      .limit(5)

    if (topsError || bottomsError) {
      throw new Error('Erreur lors de la récupération des vêtements')
    }

    if (!tops?.length || !bottoms?.length) {
      return new Response(
        JSON.stringify({
          url: "Désolé, pas assez de vêtements disponibles pour faire une suggestion. Ajoutez plus de vêtements à votre garde-robe !"
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Sélectionner aléatoirement un haut et un bas
    const selectedTop = tops[Math.floor(Math.random() * tops.length)]
    const selectedBottom = bottoms[Math.floor(Math.random() * bottoms.length)]

    // Créer la suggestion de tenue
    const { data: outfit, error: outfitError } = await supabaseClient
      .from('outfits')
      .insert({
        name: `Tenue pour ${weatherDescription}`,
        description: `Suggestion pour ${temperature}°C, ${weather}`,
        top_id: selectedTop.id,
        bottom_id: selectedBottom.id,
        user_id: req.auth?.uid
      })
      .select()
      .single()

    if (outfitError) {
      throw outfitError
    }

    // Enregistrer la suggestion dans la table outfit_weather_suggestions
    const { error: suggestionError } = await supabaseClient
      .from('outfit_weather_suggestions')
      .insert({
        user_id: req.auth?.uid,
        outfit_id: outfit.id,
        temperature: temperature,
        weather_description: weather
      })

    if (suggestionError) {
      console.error("Erreur lors de l'enregistrement de la suggestion:", suggestionError)
    }

    // Construire le message de suggestion
    const suggestion = `Pour ${temperature}°C et un temps ${weather}, je vous suggère :
${selectedTop.name} ${selectedTop.category}
${selectedBottom.name} ${selectedBottom.category}`

    return new Response(
      JSON.stringify({ url: suggestion }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Erreur dans la fonction get-weather-outfit:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
