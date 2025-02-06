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

  const { data: weather, isLoading, error } = useQuery<WeatherData>({
    queryKey: ["weather"],
    queryFn: async () => {
      try {
        console.log("Fetching weather data...");
        
        // Fetch API key from Supabase secrets
        const { data: secretData, error: secretError } = await supabase
          .from('secrets')
          .select('value')
          .eq('key', 'OPENWEATHER_API_KEY')
          .maybeSingle();

        console.log("API key fetch result:", { secretData, secretError });

        if (secretError) {
          console.error("Error fetching API key:", secretError);
          throw new Error("Failed to fetch OpenWeather API key");
        }

        if (!secretData?.value) {
          console.error("No API key found in secrets");
          toast({
            title: "Configuration Error",
            description: "OpenWeather API key not found. Please make sure it's configured correctly.",
            variant: "destructive",
          });
          throw new Error("OpenWeather API key not found");
        }

        const OPENWEATHER_API_KEY = secretData.value;
        
        // Get user location with proper error handling
        let lat: number;
        let lon: number;
        
        try {
          console.log("Requesting user location...");
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              maximumAge: 0,
            });
          });
          
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          console.log("Got user location:", { lat, lon });
        } catch (geoError) {
          console.log("Geolocation error, using default location:", geoError);
          lat = DEFAULT_LOCATION.lat;
          lon = DEFAULT_LOCATION.lon;
        }

        // Fetch current weather
        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`
        );

        if (!currentResponse.ok) {
          throw new Error(`Weather API error: ${currentResponse.statusText}`);
        }

        const currentData = await currentResponse.json();

        // Fetch forecast
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`
        );

        if (!forecastResponse.ok) {
          throw new Error(`Forecast API error: ${forecastResponse.statusText}`);
        }

        const forecastData = await forecastResponse.json();

        return {
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
        };
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
        <div className="text-center text-muted-foreground">
          <p>Unable to load weather data.</p>
          <p className="text-sm">Please check your configuration and try again.</p>
        </div>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-lg font-bold">{weather.location?.name}, {weather.location?.country}</h2>
        <div className="flex items-center">
          <img 
            src={`https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`} 
            alt={weather.current.description} 
          />
          <div className="ml-4">
            <p className="text-2xl">{weather.current.temp}°C</p>
            <p>{weather.current.description}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {weather.forecasts.map((forecast) => (
            <div key={forecast.date} className="flex flex-col items-center text-sm">
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

      {weather && (
        <WeatherOutfitSuggestion 
          temperature={weather.current.temp} 
          description={weather.current.description}
        />
      )}
    </div>
  );
};