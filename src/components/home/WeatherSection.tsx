import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cloud, Sun, CloudRain, Shirt, ThermometerSun, Wind, Droplets, CloudFog, CloudDrizzle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
        // Fetch API key from Supabase secrets
        const { data: secretData, error: secretError } = await supabase
          .from('secrets')
          .select('value')
          .eq('key', 'OPENWEATHER_API_KEY')
          .maybeSingle();

        if (secretError) {
          console.error("Error fetching API key:", secretError);
          throw new Error("Failed to fetch OpenWeather API key");
        }

        if (!secretData?.value) {
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
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              maximumAge: 0,
            });
          });
          
          lat = position.coords.latitude;
          lon = position.coords.longitude;
        } catch (geoError) {
          console.log("Geolocation error, using default location:", geoError);
          toast({
            title: "Location Access Denied",
            description: "Using default location (Paris). Enable location access for local weather.",
          });
          lat = DEFAULT_LOCATION.lat;
          lon = DEFAULT_LOCATION.lon;
        }

        // Récupération de la météo actuelle
        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`
        );

        if (!currentResponse.ok) {
          throw new Error(`Weather API error: ${currentResponse.statusText}`);
        }

        const currentData = await currentResponse.json();

        // Récupération des prévisions
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`
        );

        if (!forecastResponse.ok) {
          throw new Error(`Forecast API error: ${forecastResponse.statusText}`);
        }

        const forecastData = await forecastResponse.json();

        const dailyForecasts = forecastData.list.map((item: any) => ({
          date: item.dt_txt.split(" ")[0],
          temp: Math.round(item.main.temp),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        }));

        return {
          current: {
            temp: Math.round(currentData.main.temp),
            humidity: currentData.main.humidity,
            windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
            description: currentData.weather[0].description,
            icon: currentData.weather[0].icon,
          },
          forecasts: dailyForecasts,
          location: {
            name: currentData.name,
            country: currentData.sys.country,
          },
        };
      } catch (error) {
        console.error("Erreur lors de la récupération de la météo:", error);
        toast({
          title: "Error",
          description: "Failed to fetch weather data. Please try again later.",
          variant: "destructive",
        });
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
    <Card className="p-6">
      <h2 className="text-lg font-bold">{weather.location?.name}, {weather.location?.country}</h2>
      <div className="flex items-center">
        <img src={`http://openweathermap.org/img/wn/${weather.current.icon}@2x.png`} alt={weather.current.description} />
        <div className="ml-4">
          <p className="text-2xl">{weather.current.temp}°C</p>
          <p>{weather.current.description}</p>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold">Forecast</h3>
        <div className="grid grid-cols-2 gap-4">
          {weather.forecasts.map((forecast) => (
            <div key={forecast.date} className="flex flex-col items-center">
              <p>{forecast.date}</p>
              <img src={`http://openweathermap.org/img/wn/${forecast.icon}@2x.png`} alt={forecast.description} />
              <p>{forecast.temp}°C</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
