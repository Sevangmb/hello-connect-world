
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
  };
  forecasts: Array<{
    date: string;
    temp: number;
    description: string;
    icon: string;
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

        console.log("Weather data:", data);
        return data as WeatherData;
      } catch (error) {
        console.error("Erreur lors de la récupération de la météo:", error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};
