import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cloud, Sun, CloudRain, Shirt } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const WeatherSection = () => {
  const { data: weather, isLoading } = useQuery({
    queryKey: ["weather"],
    queryFn: async () => {
      // Simulate weather data fetch - replace with actual API call
      return {
        temperature: 22,
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
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">{weather?.temperature}°C</h2>
          <p className="text-muted-foreground">{weather?.location}</p>
        </div>
        {getWeatherIcon()}
      </div>
      
      <div className="flex items-start gap-2 text-muted-foreground">
        <Shirt className="h-5 w-5 mt-1" />
        <p>{weather?.recommendation}</p>
      </div>
    </Card>
  );
};