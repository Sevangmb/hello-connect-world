
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WeatherOutfitSuggestion } from "./WeatherOutfitSuggestion";
import { useWeatherData } from "./hooks/useWeatherData";

export const WeatherSection = () => {
  const { data: weather, isLoading, error } = useWeatherData();

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
