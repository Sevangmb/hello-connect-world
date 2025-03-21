
import { useEffect } from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { eventBus } from "@/core/event-bus/EventBus";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Publier un événement pour indiquer que la page des paramètres est chargée
    eventBus.publish('app:settings-page-loaded', {
      timestamp: Date.now()
    });
    
    // Mesurer le temps de chargement
    const pageLoadStart = performance.now();
    
    return () => {
      const pageLoadEnd = performance.now();
      const loadTime = Math.round(pageLoadEnd - pageLoadStart);
      console.log(`Temps de chargement de la page des paramètres: ${loadTime}ms`);
      
      if (loadTime > 1000) {
        toast({
          title: "Performance",
          description: `Chargement lent: ${loadTime}ms`,
          variant: "destructive"
        });
      }
    };
  }, [toast]);
  
  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Paramètres du compte</h1>
          <ProfileSettings />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Settings;
