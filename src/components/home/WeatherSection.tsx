import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cloud, Sun, CloudRain, Shirt, ThermometerSun, Wind, Droplets, CloudFog, CloudDrizzle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WeatherData {
  current: {
    temperature: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'foggy' | 'drizzle';
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    pressure: number;
    visibility: number;
    description: string;
  };
  forecast: Array<{
    date: string;
    temperature: {
      min: number;
      max: number;
    };
    condition: 'sunny' | 'cloudy' | 'rainy' | 'foggy' | 'drizzle';
    description: string;
  }>;
  location: string;
  recommendation: string;
}

export const WeatherSection = () => {
  const { data: weather, isLoading } = useQuery<WeatherData>({
    queryKey: ["weather"],
    queryFn: async () => {
      try {
        const { data: secretData, error: secretError } = await supabase
          .from('secrets')
          .select('value')
          .eq('key', 'OPENWEATHER_API_KEY')
          .single();

        if (secretError) {
          console.error("Error fetching API key:", secretError);
          throw secretError;
        }

        if (!secretData?.value) {
          throw new Error("OpenWeather API key not found");
        }

        const OPENWEATHER_API_KEY = secretData.value;

        // Coordonnées de Paris par défaut
        const lat = 48.8566;
        const lon = 2.3522;
        
        // Récupération des données actuelles
        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`
        );
        const currentData = await currentResponse.json();

        // Récupération des prévisions
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`
        );
        const forecastData = await forecastResponse.json();

        // Traitement des prévisions pour obtenir une par jour
        const dailyForecast = forecastData.list
          .filter((_: any, index: number) => index % 8 === 0) // Une mesure par jour
          .slice(0, 7) // 7 jours
          .map((day: any) => ({
            date: new Date(day.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'long' }),
            temperature: {
              min: Math.round(day.main.temp_min),
              max: Math.round(day.main.temp_max)
            },
            condition: getConditionFromId(day.weather[0].id),
            description: day.weather[0].description
          }));

        return {
          current: {
            temperature: Math.round(currentData.main.temp),
            condition: getConditionFromId(currentData.weather[0].id),
            feelsLike: Math.round(currentData.main.feels_like),
            humidity: currentData.main.humidity,
            windSpeed: Math.round(currentData.wind.speed * 3.6), // Conversion en km/h
            pressure: currentData.main.pressure,
            visibility: Math.round(currentData.visibility / 1000), // Conversion en km
            description: currentData.weather[0].description
          },
          forecast: dailyForecast,
          location: "Paris",
          recommendation: getClothingRecommendation(Math.round(currentData.main.temp), currentData.weather[0].id)
        };
      } catch (error) {
        console.error("Erreur lors de la récupération de la météo:", error);
        throw error;
      }
    },
    refetchInterval: 1800000, // Rafraîchissement toutes les 30 minutes
  });

  const getConditionFromId = (id: number): WeatherData['current']['condition'] => {
    if (id >= 200 && id < 300) return 'rainy'; // Orage
    if (id >= 300 && id < 400) return 'drizzle'; // Bruine
    if (id >= 500 && id < 600) return 'rainy'; // Pluie
    if (id >= 700 && id < 800) return 'foggy'; // Brouillard
    if (id === 800) return 'sunny'; // Ciel dégagé
    return 'cloudy'; // Nuageux
  };

  const getClothingRecommendation = (temp: number, weatherId: number): string => {
    if (temp < 10) {
      return "Il fait froid ! Pensez à porter un manteau chaud, une écharpe et des gants.";
    } else if (temp < 15) {
      return "Une veste ou un pull chaud sera parfait pour aujourd'hui.";
    } else if (temp < 20) {
      return "Un pull léger ou une veste fine sera idéal.";
    } else if (temp < 25) {
      return "Température agréable pour un t-shirt avec éventuellement une petite veste.";
    } else {
      return "Il fait chaud ! Privilégiez des vêtements légers et respirants.";
    }
  };

  const getWeatherIcon = (condition: WeatherData['current']['condition']) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-12 w-12 text-yellow-500" />;
      case "cloudy":
        return <Cloud className="h-12 w-12 text-gray-500" />;
      case "rainy":
        return <CloudRain className="h-12 w-12 text-blue-500" />;
      case "foggy":
        return <CloudFog className="h-12 w-12 text-gray-400" />;
      case "drizzle":
        return <CloudDrizzle className="h-12 w-12 text-blue-400" />;
      default:
        return <Sun className="h-12 w-12 text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Météo actuelle */}
      <Card className="p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{weather?.current.temperature}°C</h2>
            <p className="text-muted-foreground capitalize">{weather?.current.description}</p>
            <p className="text-muted-foreground">{weather?.location}</p>
          </div>
          {weather && getWeatherIcon(weather.current.condition)}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <ThermometerSun className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Ressenti</p>
              <p className="font-medium">{weather?.current.feelsLike}°C</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Humidité</p>
              <p className="font-medium">{weather?.current.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Vent</p>
              <p className="font-medium">{weather?.current.windSpeed} km/h</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-muted-foreground">Visibilité</p>
              <p className="font-medium">{weather?.current.visibility} km</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-2 text-muted-foreground border-t pt-4">
          <Shirt className="h-5 w-5 mt-1 text-primary" />
          <p className="text-sm">{weather?.recommendation}</p>
        </div>
      </Card>

      {/* Prévisions sur 7 jours */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Prévisions sur 7 jours</h3>
        <div className="grid gap-4">
          {weather?.forecast.map((day, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-4">
                {getWeatherIcon(day.condition)}
                <div>
                  <p className="font-medium capitalize">{day.date}</p>
                  <p className="text-sm text-muted-foreground capitalize">{day.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{day.temperature.max}°C</p>
                <p className="text-sm text-muted-foreground">{day.temperature.min}°C</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};