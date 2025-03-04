
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WeatherOutfitSuggestion } from "./WeatherOutfitSuggestion";
import { useWeatherData } from "./hooks/useWeatherData";
import { Thermometer, Droplets, Wind, MapPin, Clock, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const WeatherSection = () => {
  const { data: weather, isLoading, error } = useWeatherData();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="grid grid-cols-5 gap-2 w-full">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
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
      <Card className="p-6 overflow-hidden relative">
        {/* Fond décoratif */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 -rotate-12">
          <img 
            src={`https://openweathermap.org/img/wn/${weather.current.icon}@4x.png`} 
            alt="" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* En-tête avec localisation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">{weather.location?.name}, {weather.location?.country}</h2>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Mis à jour {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        
        {/* Conditions actuelles */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img 
              src={`https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`} 
              alt={weather.current.description}
              className="w-16 h-16"
            />
            <div className="ml-2">
              <p className="text-3xl font-bold">{weather.current.temp}°C</p>
              <Badge variant="outline" className="capitalize mt-1">
                {weather.current.description}
              </Badge>
            </div>
          </div>
          
          {/* Statistiques actuelles */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center text-muted-foreground">
                <Thermometer className="w-4 h-4 mr-1" />
                <span className="text-xs">Ressenti</span>
              </div>
              <span className="font-medium">{weather.current.feelsLike || weather.current.temp}°C</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center text-muted-foreground">
                <Droplets className="w-4 h-4 mr-1" />
                <span className="text-xs">Humidité</span>
              </div>
              <span className="font-medium">{weather.current.humidity}%</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center text-muted-foreground">
                <Wind className="w-4 h-4 mr-1" />
                <span className="text-xs">Vent</span>
              </div>
              <span className="font-medium">{weather.current.windSpeed} km/h</span>
            </div>
          </div>
        </div>
        
        <Separator className="mb-4" />
        
        {/* Prévisions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="w-4 h-4 text-primary" />
            <h3 className="font-medium">Prévisions</h3>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {weather.forecasts.map((forecast, index) => (
              <div key={`${forecast.date}-${index}`} className="flex flex-col items-center text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <p className="font-medium text-xs">{forecast.date}</p>
                <img 
                  src={`https://openweathermap.org/img/wn/${forecast.icon}.png`} 
                  alt={forecast.description}
                  className="w-10 h-10"
                />
                <p className="font-semibold">{forecast.temp}°C</p>
                <p className="text-xs text-muted-foreground capitalize truncate w-full text-center">{forecast.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <WeatherOutfitSuggestion 
        temperature={weather.current.temp} 
        description={weather.current.description}
      />
    </div>
  );
};
