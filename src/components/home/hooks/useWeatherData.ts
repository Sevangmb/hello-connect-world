
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface WeatherData {
  current: {
    temp: number;
    feelsLike?: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
    condition?: 'clear' | 'rain' | 'clouds' | 'snow' | 'extreme' | 'other';
  };
  forecasts: Array<{
    date: string;
    temp: number;
    description: string;
    icon: string;
    condition?: 'clear' | 'rain' | 'clouds' | 'snow' | 'extreme' | 'other';
  }>;
  location?: {
    name: string;
    country: string;
  };
}

const DEFAULT_LOCATION = {
  lat: 48.8566, // Paris
  lon: 2.3522
};

/**
 * Hook permettant de récupérer les données météo actuelles et les prévisions.
 * Utilise la géolocalisation si disponible, sinon utilise Paris comme emplacement par défaut.
 */
export const useWeatherData = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["weather"],
    queryFn: async () => {
      try {
        console.log("Fetching weather data...");
        
        let lat: number;
        let lon: number;
        
        try {
          console.log("Requesting user location...");
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              maximumAge: 0,
            });
          });
          
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          console.log("Got user location:", { lat, lon });
          
          toast({
            title: "Localisation réussie",
            description: "Nous utilisons votre position pour afficher la météo locale.",
          });
        } catch (geoError: any) {
          console.log("Geolocation error:", geoError);
          lat = DEFAULT_LOCATION.lat;
          lon = DEFAULT_LOCATION.lon;
          
          // Check if user denied permission
          if (geoError.code === 1) { // PERMISSION_DENIED
            toast({
              title: "Accès à la localisation refusé",
              description: "Nous utilisons Paris comme localisation par défaut. Vous pouvez autoriser l'accès à votre position dans les paramètres de votre navigateur.",
              variant: "default"
            });
          } else {
            toast({
              title: "Localisation par défaut",
              description: "Nous utilisons Paris comme localisation par défaut.",
              variant: "default"
            });
          }
        }

        const { data, error: weatherError } = await supabase.functions.invoke('get-weather', {
          body: { lat, lon }
        });

        if (weatherError) {
          console.error("Error fetching weather:", weatherError);
          throw weatherError;
        }

        // Ajouter une catégorisation des conditions météo pour améliorer les suggestions
        const weatherData = data as WeatherData;
        
        // Catégoriser les conditions météo actuelles
        weatherData.current.condition = categorizeWeatherCondition(
          weatherData.current.icon,
          weatherData.current.description
        );
        
        // Catégoriser les prévisions
        weatherData.forecasts = weatherData.forecasts.map(forecast => ({
          ...forecast,
          condition: categorizeWeatherCondition(forecast.icon, forecast.description)
        }));

        console.log("Weather data with conditions:", weatherData);
        return weatherData;
      } catch (error) {
        console.error("Erreur lors de la récupération de la météo:", error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

/**
 * Catégorise la condition météo en fonction de l'icône et de la description
 * pour faciliter les suggestions de tenues
 */
function categorizeWeatherCondition(
  icon: string,
  description: string
): 'clear' | 'rain' | 'clouds' | 'snow' | 'extreme' | 'other' {
  // L'icône OpenWeather commence par:
  // 01: ciel dégagé, 02-04: nuageux, 09-10: pluie, 11: orage, 13: neige, 50: brouillard
  const iconPrefix = icon.substring(0, 2);
  
  if (iconPrefix === '01') return 'clear';
  if (['02', '03', '04'].includes(iconPrefix)) return 'clouds';
  if (['09', '10'].includes(iconPrefix)) return 'rain';
  if (iconPrefix === '13') return 'snow';
  if (iconPrefix === '11') return 'extreme';
  
  // Analyse de la description si l'icône n'est pas conclusive
  const desc = description.toLowerCase();
  if (desc.includes('pluie') || desc.includes('averse')) return 'rain';
  if (desc.includes('neige')) return 'snow';
  if (desc.includes('nuage')) return 'clouds';
  if (desc.includes('clair') || desc.includes('dégagé') || desc.includes('soleil')) return 'clear';
  if (desc.includes('orage') || desc.includes('tempête')) return 'extreme';
  
  return 'other';
}
