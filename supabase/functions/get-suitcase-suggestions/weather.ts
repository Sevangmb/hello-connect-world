
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

export async function getWeatherInfo(): Promise<string> {
  let weatherInfo = "Information non disponible";
  try {
    // Essayons de récupérer les informations météo
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Récupérer la clé API OpenWeather
      const { data: secretData } = await supabase
        .from('secrets')
        .select('value')
        .eq('key', 'OPENWEATHER_API_KEY')
        .single();
      
      if (secretData) {
        const openWeatherApiKey = secretData.value;
        
        // On utilise les coordonnées de Paris comme exemple
        // Dans une version plus avancée, on pourrait demander les coordonnées du lieu de voyage
        const lat = 48.8566;
        const lon = 2.3522;
        
        // Obtenir les prévisions météo pour les 5 prochains jours
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`,
          { method: 'GET' }
        );
        
        if (weatherResponse.ok) {
          const weatherData = await weatherResponse.json();
          
          // Extraire des informations pertinentes sur la météo
          if (weatherData.list && weatherData.list.length > 0) {
            // Simplifier en prenant la moyenne des températures
            const temps = weatherData.list.slice(0, Math.min(8 * 5, weatherData.list.length));
            const avgTemp = temps.reduce((sum: number, item: any) => sum + item.main.temp, 0) / temps.length;
            const conditions = [...new Set(temps.map((item: any) => item.weather[0].main))];
            
            weatherInfo = `Température moyenne: ${avgTemp.toFixed(1)}°C. Conditions: ${conditions.join(", ")}.`;
          }
        }
      }
    }
  } catch (weatherError) {
    console.error("Erreur lors de la récupération des données météo:", weatherError);
    // On continue sans les données météo
  }

  console.log("Informations météo:", weatherInfo);
  return weatherInfo;
}
