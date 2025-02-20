
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Starting get-weather-outfit function")

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get weather data from request
    const { temperature, description } = await req.json()
    console.log("Received weather data:", { temperature, description })

    // Get user from auth context
    const authHeader = req.headers.get('Authorization')!
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))
    
    if (userError || !user) {
      throw new Error('Non authentifié')
    }

    console.log("Authenticated user:", user.id)

    // Déterminer les catégories appropriées en fonction de la météo
    let topCategories = ['T-shirt', 'Chemise', 'Pull']
    let bottomCategories = ['Pantalon', 'Short', 'Jupe']

    if (temperature < 15) {
      topCategories = ['Pull', 'Sweat', 'Veste']
    } else if (temperature > 25) {
      topCategories = ['T-shirt', 'Débardeur']
      bottomCategories = ['Short', 'Jupe']
    }

    console.log("Searching for clothes with categories:", { topCategories, bottomCategories })

    // Récupérer les vêtements disponibles
    const { data: tops, error: topsError } = await supabaseClient
      .from('clothes')
      .select('*')
      .eq('user_id', user.id)
      .eq('archived', false)
      .in('category', topCategories)
      .limit(10)

    const { data: bottoms, error: bottomsError } = await supabaseClient
      .from('clothes')
      .select('*')
      .eq('user_id', user.id)
      .eq('archived', false)
      .in('category', bottomCategories)
      .limit(10)

    if (topsError) console.error("Error fetching tops:", topsError)
    if (bottomsError) console.error("Error fetching bottoms:", bottomsError)

    console.log("Found clothes:", { 
      tops: tops?.length || 0, 
      bottoms: bottoms?.length || 0 
    })

    // Vérifier si nous avons assez de vêtements
    if (!tops?.length || !bottoms?.length) {
      console.log("Not enough clothes found for suggestion")
      return new Response(
        JSON.stringify({ 
          message: "Désolé, pas assez de vêtements disponibles pour faire une suggestion. Ajoutez plus de vêtements à votre garde-robe !" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Sélectionner aléatoirement un haut et un bas
    const selectedTop = tops[Math.floor(Math.random() * tops.length)]
    const selectedBottom = bottoms[Math.floor(Math.random() * bottoms.length)]

    console.log("Selected outfit:", { 
      top: selectedTop.name, 
      bottom: selectedBottom.name 
    })

    // Créer la tenue
    const { data: outfit, error: outfitError } = await supabaseClient
      .from('outfits')
      .insert({
        user_id: user.id,
        name: `Suggestion météo (${temperature}°C, ${description})`,
        top_id: selectedTop.id,
        bottom_id: selectedBottom.id
      })
      .select()
      .single()

    if (outfitError) {
      console.error("Error creating outfit:", outfitError)
      throw outfitError
    }

    // Sauvegarder la suggestion météo
    const { error: suggestionError } = await supabaseClient
      .from('outfit_weather_suggestions')
      .insert({
        user_id: user.id,
        outfit_id: outfit.id,
        temperature,
        weather_description: description
      })

    if (suggestionError) {
      console.error("Error saving weather suggestion:", suggestionError)
      throw suggestionError
    }

    console.log("Successfully created outfit suggestion")

    return new Response(
      JSON.stringify({
        outfit: {
          ...outfit,
          top: selectedTop,
          bottom: selectedBottom
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error("Error in get-weather-outfit:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
