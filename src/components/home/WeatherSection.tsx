
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WeatherOutfitSuggestion } from "./WeatherOutfitSuggestion";

interface WeatherData {
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

export const WeatherSection = () => {
  const { toast } = useToast();

  const { data: weather, isLoading, error } = useQuery({
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

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-destructive">
          <p className="font-semibold">Impossible de charger les données météo.</p>
          <p className="text-sm mt-2">
            {error instanceof Error ? error.message : "Veuillez vérifier votre configuration et réessayer."}
          </p>
        </div>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">{weather.location?.name}, {weather.location?.country}</h2>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img 
              src={`https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`} 
              alt={weather.current.description}
              className="w-16 h-16"
            />
            <div className="ml-4">
              <p className="text-3xl font-bold">{weather.current.temp}°C</p>
              <p className="text-muted-foreground capitalize">{weather.current.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Humidité: {weather.current.humidity}%</p>
            <p className="text-sm text-muted-foreground">Vent: {weather.current.windSpeed} km/h</p>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2 border-t pt-4">
          {weather.forecasts.map((forecast, index) => (
            <div key={`${forecast.date}-${index}`} className="flex flex-col items-center text-sm">
              <p className="font-medium">{forecast.date}</p>
              <img 
                src={`https://openweathermap.org/img/wn/${forecast.icon}.png`} 
                alt={forecast.description}
                className="w-8 h-8"
              />
              <p>{forecast.temp}°C</p>
            </div>
          ))}
        </div>
      </Card>

      <WeatherOutfitSuggestion 
        temperature={weather.current.temp} 
        description={weather.current.description}
      />
    </div>
  );
};
