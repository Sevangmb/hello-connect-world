
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Info, Lightbulb, Clock } from "lucide-react";
import { Suspense, lazy } from "react";

// Lazy load components to improve initial rendering
const LazyWeatherSection = lazy(() => import("@/components/home/WeatherSection").then(
  module => ({ default: module.WeatherSection })
));

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        <MainSidebar />
        
        <main className="flex-1 pt-16 pb-16 md:pt-20 md:pb-8 px-4 md:pl-72 md:pr-6 lg:pr-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* En-tête de page avec titre et description */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Bienvenue sur FRING!</h1>
              <p className="text-gray-600 mt-2">
                Votre assistant personnel de mode qui s'adapte à votre style et à la météo.
              </p>
            </div>
            
            {/* Section météo avec loading fallback */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <Info className="h-5 w-5 mr-2 text-primary" />
                Météo & Suggestions
              </h2>
              
              <Suspense fallback={
                <Card className="h-52 flex items-center justify-center bg-white/80 shadow-sm">
                  <div className="flex flex-col items-center">
                    <Clock className="h-8 w-8 animate-pulse text-primary/50 mb-2" />
                    <p className="text-muted-foreground">Chargement de la météo...</p>
                  </div>
                </Card>
              }>
                <LazyWeatherSection />
              </Suspense>
            </section>
            
            {/* Carte principale d'information */}
            <Card className="border-none shadow-md bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-custom-teal" />
                  Découvrez votre style personnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  FRING! utilise l'intelligence artificielle pour analyser votre garde-robe et vous suggérer des tenues adaptées 
                  à votre style, aux tendances actuelles et aux conditions météorologiques.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer border">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-1">Suggestions personnalisées</h3>
                      <p className="text-xs text-muted-foreground">
                        Des tenues créées spécialement pour vous par notre IA
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer border">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-1">Ma garde-robe</h3>
                      <p className="text-xs text-muted-foreground">
                        Gérez votre collection de vêtements facilement
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            {/* Section découvrir plus */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <Sparkles className="h-5 w-5 mr-2 text-custom-orange" />
                Explorer FRING!
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-all duration-200 cursor-pointer border-none shadow-sm bg-white">
                  <CardContent className="p-5">
                    <h3 className="font-medium mb-2">Challenges mode</h3>
                    <p className="text-sm text-muted-foreground">
                      Participez à des défis de style hebdomadaires
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-all duration-200 cursor-pointer border-none shadow-sm bg-white">
                  <CardContent className="p-5">
                    <h3 className="font-medium mb-2">Planificateur de voyage</h3>
                    <p className="text-sm text-muted-foreground">
                      Préparez vos valises intelligemment
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-all duration-200 cursor-pointer border-none shadow-sm bg-white">
                  <CardContent className="p-5">
                    <h3 className="font-medium mb-2">Communauté</h3>
                    <p className="text-sm text-muted-foreground">
                      Partagez vos styles et découvrez des inspirations
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </main>
      </div>
      
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
