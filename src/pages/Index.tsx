
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { WeatherSection } from "@/components/home/WeatherSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 pb-8 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bienvenue sur FRING!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Découvrez des suggestions de tenues adaptées à la météo du jour 
                et explorez votre garde-robe de manière intelligente.
              </p>
            </CardContent>
          </Card>
          
          <WeatherSection />
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Découvrir plus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Explorez d'autres fonctionnalités de FRING! pour gérer votre garde-robe 
                et trouver l'inspiration mode.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1">Suggestions IA</h3>
                    <p className="text-xs text-muted-foreground">
                      Découvrez des tenues personnalisées générées par IA
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1">Ma garde-robe</h3>
                    <p className="text-xs text-muted-foreground">
                      Gérez et organisez tous vos vêtements
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;
