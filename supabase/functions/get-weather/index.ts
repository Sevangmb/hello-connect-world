
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
    
    console.log('Attempting to fetch weather data with:')
    console.log('Latitude:', lat)
    console.log('Longitude:', lon)
    console.log('API Key exists:', !!OPENWEATHER_API_KEY)
    
    if (!OPENWEATHER_API_KEY) {
      throw new Error('OpenWeather API key not found in environment variables')
    }

    // Requête météo actuelle
    const currentURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`
    console.log('Fetching current weather...')
    
    const currentResponse = await fetch(currentURL)

    if (!currentResponse.ok) {
      const errorText = await currentResponse.text()
      console.error('Weather API error:', errorText)
      throw new Error(`Weather API error: ${currentResponse.status} - ${errorText}`)
    }

    const currentData = await currentResponse.json()
    console.log('Current weather data received')

    // Requête prévisions
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`
    console.log('Fetching forecast...')
    
    const forecastResponse = await fetch(forecastURL)

    if (!forecastResponse.ok) {
      const errorText = await forecastResponse.text()
      console.error('Forecast API error:', errorText)
      throw new Error(`Forecast API error: ${forecastResponse.status} - ${errorText}`)
    }

    const forecastData = await forecastResponse.json()
    console.log('Forecast data received')

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
    console.error('Detailed error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
