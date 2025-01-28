import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cloud, Sun, CloudRain, Shirt, ThermometerSun } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
  location: string;
  recommendation: string;
  feelsLike: number;
  humidity: number;
}

export const WeatherSection = () => {
  const { data: weather, isLoading } = useQuery<WeatherData>({
    queryKey: ["weather"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // For now using mock data
      return {
        temperature: 22,
        feelsLike: 24,
        humidity: 65,
        condition: "sunny",
        location: "Paris",
        recommendation: "Une journée parfaite pour porter un t-shirt léger avec un jean"
      };
    },
  });

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

  const getWeatherIcon = () => {
    switch (weather?.condition) {
      case "sunny":
        return <Sun className="h-12 w-12 text-yellow-500" />;
      case "cloudy":
        return <Cloud className="h-12 w-12 text-gray-500" />;
      case "rainy":
        return <CloudRain className="h-12 w-12 text-blue-500" />;
      default:
        return <Sun className="h-12 w-12 text-yellow-500" />;
    }
  };

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{weather?.temperature}°C</h2>
          <p className="text-muted-foreground">{weather?.location}</p>
        </div>
        {getWeatherIcon()}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <ThermometerSun className="h-5 w-5 text-orange-500" />
          <div>
            <p className="text-sm text-muted-foreground">Ressenti</p>
            <p className="font-medium">{weather?.feelsLike}°C</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm text-muted-foreground">Humidité</p>
            <p className="font-medium">{weather?.humidity}%</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-start gap-2 text-muted-foreground border-t pt-4">
        <Shirt className="h-5 w-5 mt-1 text-primary" />
        <p className="text-sm">{weather?.recommendation}</p>
      </div>
    </Card>
  );
};