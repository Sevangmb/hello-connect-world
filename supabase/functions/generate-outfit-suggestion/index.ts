
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { temperature, description, clothes } = await req.json()
    
    if (!clothes || !Array.isArray(clothes) || clothes.length === 0) {
      throw new Error('Aucun vêtement disponible')
    }

    console.log(`Générer une suggestion de tenue pour: ${temperature}°C, ${description}`)
    console.log(`Vêtements disponibles: ${clothes.length}`)

    // Catégoriser les vêtements par type
    const tops = clothes.filter(c => 
      c.category === 'top' || 
      c.category === 'tshirt' || 
      c.category === 'shirt' || 
      c.category === 'sweater' || 
      c.category === 'sweatshirt' ||
      c.category === 'jacket'
    )
    
    const bottoms = clothes.filter(c => 
      c.category === 'pants' || 
      c.category === 'bottom' || 
      c.category === 'skirt' || 
      c.category === 'shorts' || 
      c.category === 'jeans'
    )
    
    const shoes = clothes.filter(c => 
      c.category === 'shoes' || 
      c.category === 'sneakers' || 
      c.category === 'boots'
    )

    console.log(`Répartition: ${tops.length} hauts, ${bottoms.length} bas, ${shoes.length} chaussures`)

    // Logique simple de suggestion basée sur la température
    function selectSuitableClothes(items, temp) {
      // Filtrer par catégories météo si disponible
      const weatherFiltered = items.filter(item => 
        item.weather_categories?.includes(getWeatherCategory(temp, description))
      )
      
      // Si des vêtements correspondent à la météo, les utiliser
      if (weatherFiltered.length > 0) {
        return weatherFiltered[Math.floor(Math.random() * weatherFiltered.length)].id
      }
      
      // Sinon, logique de secours basée sur la température
      let suitable = []
      
      if (temp < 5) {
        // Très froid
        suitable = items.filter(c => 
          c.material?.toLowerCase()?.includes('laine') || 
          c.style?.toLowerCase()?.includes('hiver')
        )
      } else if (temp < 15) {
        // Frais
        suitable = items.filter(c => 
          !c.style?.toLowerCase()?.includes('été')
        )
      } else if (temp < 25) {
        // Tempéré
        suitable = items
      } else {
        // Chaud
        suitable = items.filter(c => 
          !c.material?.toLowerCase()?.includes('laine') && 
          !c.style?.toLowerCase()?.includes('hiver')
        )
      }
      
      // Si aucun vêtement adapté n'est trouvé, utiliser tous les vêtements disponibles
      if (suitable.length === 0) suitable = items
      
      return suitable.length > 0 
        ? suitable[Math.floor(Math.random() * suitable.length)].id
        : (items.length > 0 ? items[0].id : null)
    }

    // Déterminer la catégorie météo
    function getWeatherCategory(temp, desc) {
      const description = desc.toLowerCase()
      
      if (temp < 5) return 'cold'
      if (temp < 15) return 'cool'
      if (temp < 25) return 'mild'
      return 'hot'
    }

    // Générer des conseils en fonction de la météo
    function generateExplanation(temp, desc) {
      const description = desc.toLowerCase()
      const isRainy = description.includes('pluie') || 
                     description.includes('pluvieux') || 
                     description.includes('averse')
      
      const isWindy = description.includes('vent') || 
                     description.includes('venteux')
      
      const isSunny = description.includes('soleil') || 
                     description.includes('dégagé') || 
                     description.includes('ensoleillé')
      
      let explanation = `Pour ${temp}°C avec un temps ${desc}, `
      
      if (temp < 5) {
        explanation += "il fait très froid. Privilégiez des vêtements chauds et superposés."
      } else if (temp < 15) {
        explanation += "il fait frais. Une tenue de mi-saison est recommandée."
      } else if (temp < 25) {
        explanation += "la température est agréable. Une tenue légère sera confortable."
      } else {
        explanation += "il fait chaud. Optez pour des vêtements légers et respirants."
      }
      
      if (isRainy) {
        explanation += " N'oubliez pas un imperméable ou un parapluie."
      }
      
      if (isWindy) {
        explanation += " Prévoyez une couche supplémentaire à cause du vent."
      }
      
      if (isSunny && temp > 20) {
        explanation += " Pensez à vous protéger du soleil."
      }
      
      return explanation
    }

    // Sélectionner les vêtements pour la tenue
    const topId = tops.length > 0 ? selectSuitableClothes(tops, temperature) : null
    const bottomId = bottoms.length > 0 ? selectSuitableClothes(bottoms, temperature) : null
    const shoeId = shoes.length > 0 ? selectSuitableClothes(shoes, temperature) : null
    
    // Générer l'explication
    const explanation = generateExplanation(temperature, description)

    const suggestion = {
      suggestion: {
        top: topId,
        bottom: bottomId,
        shoes: shoeId
      },
      explanation: explanation
    }

    console.log("Suggestion générée:", suggestion)

    return new Response(
      JSON.stringify(suggestion),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error("Erreur:", error.message)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
