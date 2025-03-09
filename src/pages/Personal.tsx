
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/modules/auth";
import { supabase } from "@/integrations/supabase/client";
import { ModuleGuard } from "@/components/modules/ModuleGuard";
import { Button } from "@/components/ui/button"; // Ajout de l'import manquant

// Import refactored components
import { ModuleUnavailable } from "@/components/personal/ModuleUnavailable";
import { ClothingSection } from "@/components/personal/ClothingSection";
import { OutfitsSection } from "@/components/personal/OutfitsSection";
import { FavoritesSection } from "@/components/personal/FavoritesSection";
import { CalendarSection } from "@/components/personal/CalendarSection";

const Personal: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [clothingItems, setClothingItems] = useState<any[]>([]);
  const [outfits, setOutfits] = useState<any[]>([]);
  
  useEffect(() => {
    console.log("Personal: Initialisation du chargement");
    
    // Référence pour savoir si le composant est toujours monté
    let isMounted = true;
    
    const fetchData = async () => {
      if (!user) {
        console.log("Personal: Utilisateur non connecté, arrêt du chargement");
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }
      
      try {
        // Récupérer les vêtements
        const { data: clothesData, error: clothesError } = await supabase
          .from("clothes")
          .select("*")
          .eq("user_id", user.id)
          .eq("archived", false)
          .order("created_at", { ascending: false });
        
        if (clothesError) throw clothesError;
        
        if (isMounted) {
          setClothingItems(clothesData || []);
          console.log("Personal: Vêtements chargés:", clothesData?.length || 0);
        }
        
        // Récupérer les tenues
        const { data: outfitsData, error: outfitsError } = await supabase
          .from("outfits")
          .select("*, top_id(*), bottom_id(*), shoes_id(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(6);
        
        if (outfitsError) throw outfitsError;
        
        if (isMounted) {
          setOutfits(outfitsData || []);
          console.log("Personal: Tenues chargées:", outfitsData?.length || 0);
          console.log("Personal: Données chargées avec succès");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
    
    // Force le chargement à se terminer après un délai maximum
    const timer = setTimeout(() => {
      if (isMounted && isLoading) {
        console.log("Personal: Fin du chargement forcée après timeout");
        setIsLoading(false);
      }
    }, 2000);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
      console.log("Personal: Nettoyage du timer");
    };
  }, [user]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-500">Chargement de votre univers...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
          <h2 className="text-red-800 font-semibold mb-2">Erreur de chargement</h2>
          <p className="text-red-700">
            Une erreur est survenue lors du chargement de vos données. Veuillez rafraîchir la page ou réessayer plus tard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Mon Univers</h1>
      
      <Tabs defaultValue="clothes" className="w-full">
        <TabsList className="mb-4 w-full grid grid-cols-5 gap-2">
          <TabsTrigger value="clothes" className="px-4 py-2">Mes Vêtements</TabsTrigger>
          <TabsTrigger value="outfits" className="px-4 py-2">Mes Tenues</TabsTrigger>
          <TabsTrigger value="suitcases" className="px-4 py-2">Mes Valises</TabsTrigger>
          <TabsTrigger value="favorites" className="px-4 py-2">Mes Favoris</TabsTrigger>
          <TabsTrigger value="calendar" className="px-4 py-2">Calendrier</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clothes" className="mt-2">
          <ModuleGuard moduleCode="clothes" fallback={<ModuleUnavailable name="Vêtements" />}>
            <ClothingSection items={clothingItems} />
          </ModuleGuard>
        </TabsContent>
        
        <TabsContent value="outfits" className="mt-2">
          <ModuleGuard moduleCode="outfits" fallback={<ModuleUnavailable name="Tenues" />}>
            <OutfitsSection outfits={outfits} />
          </ModuleGuard>
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-2">
          <ModuleGuard moduleCode="outfits" fallback={<ModuleUnavailable name="Favoris" />}>
            <FavoritesSection />
          </ModuleGuard>
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-2">
          <ModuleGuard moduleCode="clothes" fallback={<ModuleUnavailable name="Calendrier" />}>
            <CalendarSection />
          </ModuleGuard>
        </TabsContent>
        
        <TabsContent value="suitcases" className="mt-2">
          <ModuleGuard moduleCode="wardrobe" fallback={<ModuleUnavailable name="Valises" />}>
            <div className="bg-white rounded-lg p-4 mb-4">
              <h2 className="text-xl font-semibold mb-2">Mes Valises</h2>
              <p className="text-gray-600 mb-4">
                Préparez vos voyages en créant des valises virtuelles avec vos vêtements.
              </p>
              <Button 
                onClick={() => window.location.href = '/valises'}
                className="w-full sm:w-auto"
              >
                Gérer mes valises
              </Button>
            </div>
          </ModuleGuard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Personal;
