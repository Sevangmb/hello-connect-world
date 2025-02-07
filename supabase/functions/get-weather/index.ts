
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { lat, lon } = await req.json()
    const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY')

    if (!OPENWEATHER_API_KEY) {
      throw new Error('OpenWeather API key not configured')
    }

    // Requête météo actuelle
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`
    )

    if (!currentResponse.ok) {
      throw new Error(`Weather API error: ${currentResponse.statusText}`)
    }

    const currentData = await currentResponse.json()

    // Requête prévisions
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`
    )

    if (!forecastResponse.ok) {
      throw new Error(`Forecast API error: ${forecastResponse.statusText}`)
    }

    const forecastData = await forecastResponse.json()

    return new Response(
      JSON.stringify({
        current: {
          temp: Math.round(currentData.main.temp),
          humidity: currentData.main.humidity,
          windSpeed: Math.round(currentData.wind.speed * 3.6),
          description: currentData.weather[0].description,
          icon: currentData.weather[0].icon,
        },
        forecasts: forecastData.list.slice(0, 5).map((item: any) => ({
          date: new Date(item.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'short' }),
          temp: Math.round(item.main.temp),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        })),
        location: {
          name: currentData.name,
          country: currentData.sys.country,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
