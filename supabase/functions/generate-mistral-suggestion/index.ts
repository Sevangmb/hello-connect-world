
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Début de la fonction generate-mistral-suggestion")
    const { weather, clothes } = await req.json()
    
    console.log("Données météo reçues:", weather)
    console.log("Nombre de vêtements reçus:", clothes ? Object.keys(clothes).map(k => `${k}: ${clothes[k].length}`).join(', ') : 'aucun')

    if (!clothes || !clothes.tops || !clothes.bottoms || !clothes.shoes ||
        clothes.tops.length === 0 || clothes.bottoms.length === 0 || clothes.shoes.length === 0) {
      console.error("Vêtements insuffisants pour générer une suggestion")
      return new Response(
        JSON.stringify({ error: "Vêtements insuffisants pour générer une suggestion" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    const { temperature, description, condition, windSpeed, humidity } = weather || {}
    
    if (!temperature) {
      console.error("Données météo manquantes")
      return new Response(
        JSON.stringify({ error: "Données météo manquantes" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Sélectionner intelligemment des vêtements en fonction des conditions météo
    const recommendation = selectClothesBasedOnWeather(clothes, weather)
    
    console.log("Recommandation générée:", recommendation)

    return new Response(
      JSON.stringify(recommendation),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error("Erreur dans generate-mistral-suggestion:", error)
    return new Response(
      JSON.stringify({ error: error.message || "Une erreur s'est produite" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

interface Weather {
  temperature: number
  description: string
  condition?: 'clear' | 'rain' | 'clouds' | 'snow' | 'extreme' | 'other'
  windSpeed?: number
  humidity?: number
}

interface ClothingItem {
  id: string
  name: string
  category?: string
  material?: string
  color?: string
  season?: string
  waterproof?: boolean
  warmth?: number
}

interface CategorizedClothes {
  tops: ClothingItem[]
  bottoms: ClothingItem[]
  shoes: ClothingItem[]
}

function selectClothesBasedOnWeather(clothes: CategorizedClothes, weather: Weather) {
  const { temperature, description, condition, windSpeed, humidity } = weather
  
  // Filtrer les vêtements en fonction des conditions météo
  let suitableTops = [...clothes.tops]
  let suitableBottoms = [...clothes.bottoms]
  let suitableShoes = [...clothes.shoes]

  // Filtres basés sur la température
  if (temperature < 5) {
    // Très froid: privilégier vêtements chauds
    suitableTops = filterForColdWeather(suitableTops)
    suitableBottoms = filterForColdWeather(suitableBottoms)
    suitableShoes = filterForColdWeather(suitableShoes)
  } else if (temperature < 15) {
    // Frais: vêtements mi-saison
    suitableTops = filterForMildWeather(suitableTops)
    suitableBottoms = filterForMildWeather(suitableBottoms)
  } else if (temperature > 25) {
    // Chaud: vêtements légers
    suitableTops = filterForHotWeather(suitableTops)
    suitableBottoms = filterForHotWeather(suitableBottoms)
  }

  // Filtres basés sur les conditions
  if (condition === 'rain') {
    // Pluie: privilégier imperméables
    suitableTops = filterForRain(suitableTops)
    suitableShoes = filterForRain(suitableShoes)
  } else if (condition === 'snow') {
    // Neige: imperméables et chauds
    suitableTops = filterForSnow(suitableTops)
    suitableBottoms = filterForSnow(suitableBottoms)
    suitableShoes = filterForSnow(suitableShoes)
  }

  // Si les filtres ont trop réduit les options, réutiliser tous les vêtements
  if (suitableTops.length === 0) suitableTops = [...clothes.tops]
  if (suitableBottoms.length === 0) suitableBottoms = [...clothes.bottoms]
  if (suitableShoes.length === 0) suitableShoes = [...clothes.shoes]

  // Sélectionner un élément aléatoire de chaque catégorie
  const selectedTop = suitableTops[Math.floor(Math.random() * suitableTops.length)]
  const selectedBottom = suitableBottoms[Math.floor(Math.random() * suitableBottoms.length)]
  const selectedShoes = suitableShoes[Math.floor(Math.random() * suitableShoes.length)]

  // Préparer l'explication
  let explanation = `Voici une tenue adaptée pour une température de ${temperature}°C`
  
  if (condition) {
    const conditionText = 
      condition === 'clear' ? 'ensoleillé' :
      condition === 'clouds' ? 'nuageux' :
      condition === 'rain' ? 'pluvieux' :
      condition === 'snow' ? 'neigeux' :
      condition === 'extreme' ? 'avec des conditions extrêmes' :
      'variable'
    
    explanation += ` et un temps ${conditionText}`
  } else {
    explanation += ` et un temps ${description.toLowerCase()}`
  }
  
  if (windSpeed && windSpeed > 15) {
    explanation += `, avec du vent (${windSpeed} km/h)`
  }
  
  if (temperature < 5) {
    explanation += `. Cette tenue privilégie la chaleur pour vous protéger du froid.`
  } else if (temperature < 15) {
    explanation += `. Cette tenue de mi-saison est adaptée aux températures fraîches.`
  } else if (temperature > 25) {
    explanation += `. Cette tenue légère est idéale pour les journées chaudes.`
  } else {
    explanation += `. Cette tenue est confortable pour les températures modérées.`
  }
  
  if (condition === 'rain') {
    explanation += ` Les vêtements sélectionnés vous protégeront de la pluie.`
  } else if (condition === 'snow') {
    explanation += ` Les vêtements choisis sont adaptés pour la neige, offrant chaleur et protection contre l'humidité.`
  }

  return {
    suggestion: {
      top: selectedTop.id,
      bottom: selectedBottom.id,
      shoes: selectedShoes.id
    },
    explanation
  }
}

// Fonctions de filtrage
function filterForColdWeather(items: ClothingItem[]): ClothingItem[] {
  return items.filter(item => {
    const name = item.name.toLowerCase()
    // Conserver les vêtements chauds
    return (
      item.warmth === 3 || 
      item.season === 'winter' ||
      name.includes('pull') || 
      name.includes('manteau') || 
      name.includes('veste') || 
      name.includes('sweat') || 
      name.includes('doudoune') || 
      name.includes('bottes') ||
      name.includes('épais') ||
      name.includes('chaud')
    )
  })
}

function filterForMildWeather(items: ClothingItem[]): ClothingItem[] {
  return items.filter(item => {
    const name = item.name.toLowerCase()
    // Éviter les vêtements extrêmes (trop chauds ou trop légers)
    return !(
      name.includes('doudoune') || 
      name.includes('maillot de bain') || 
      name.includes('débardeur') ||
      name.includes('short') ||
      item.season === 'summer'
    )
  })
}

function filterForHotWeather(items: ClothingItem[]): ClothingItem[] {
  return items.filter(item => {
    const name = item.name.toLowerCase()
    // Conserver les vêtements légers
    return (
      item.warmth === 1 || 
      item.season === 'summer' ||
      name.includes('t-shirt') || 
      name.includes('débardeur') || 
      name.includes('short') || 
      name.includes('légère') || 
      name.includes('sandales') ||
      name.includes('léger')
    )
  })
}

function filterForRain(items: ClothingItem[]): ClothingItem[] {
  return items.filter(item => {
    const name = item.name.toLowerCase()
    // Conserver les vêtements imperméables
    return (
      item.waterproof === true ||
      name.includes('imperméable') || 
      name.includes('pluie') || 
      name.includes('veste') ||
      name.includes('bottes') ||
      name.includes('manteau')
    )
  })
}

function filterForSnow(items: ClothingItem[]): ClothingItem[] {
  // Combiner les filtres pour temps froid et pluie
  const coldItems = filterForColdWeather(items)
  const rainItems = filterForRain(items)
  
  // Fusionner les deux listes sans doublons
  const allIds = new Set()
  const result = []
  
  for (const item of [...coldItems, ...rainItems]) {
    if (!allIds.has(item.id)) {
      allIds.add(item.id)
      result.push(item)
    }
  }
  
  return result
}
