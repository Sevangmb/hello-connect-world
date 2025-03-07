
import { Card } from "@/components/ui/card";
import { WeatherSection } from "@/components/home/WeatherSection";

export default function Home() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Section météo */}
      <WeatherSection />
      
      {/* Carte d'information complémentaire */}
      <Card className="p-6">
        <h1 className="text-xl font-bold mb-4">Bienvenue sur FRING!</h1>
        <p className="text-muted-foreground">
          Votre assistant personnel de mode qui s'adapte à votre style et à la météo.
        </p>
      </Card>
    </div>
  );
}
