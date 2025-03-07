
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/modules/auth";
import { supabase } from "@/integrations/supabase/client";
import { ModuleGuard } from "@/components/modules/ModuleGuard";

// Import refactored components
import { ModuleUnavailable } from "@/components/personal/ModuleUnavailable";
import { ClothingSection } from "@/components/personal/ClothingSection";
import { OutfitsSection } from "@/components/personal/OutfitsSection";
import { FavoritesSection } from "@/components/personal/FavoritesSection";
import { CalendarSection } from "@/components/personal/CalendarSection";

const Personal: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [clothingItems, setClothingItems] = useState<any[]>([]);
  const [outfits, setOutfits] = useState<any[]>([]);
  
  useEffect(() => {
    console.log("Personal: Initialisation du chargement");
    
    const fetchData = async () => {
      if (!user) {
        console.log("Personal: Utilisateur non connecté, arrêt du chargement");
        setIsLoading(false);
        return;
      }
      
      try {
        // Récupérer les vêtements
        const { data: clothesData, error: clothesError } = await supabase
          .from("clothes")
          .select("*")
          .eq("user_id", user.id)
          .eq("archived", false)
          .order("created_at", { ascending: false })
          .limit(9);
        
        if (clothesError) throw clothesError;
        setClothingItems(clothesData || []);
        
        // Récupérer les tenues
        const { data: outfitsData, error: outfitsError } = await supabase
          .from("outfits")
          .select("*, top_id(*), bottom_id(*), shoes_id(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(6);
        
        if (outfitsError) throw outfitsError;
        setOutfits(outfitsData || []);
        
        console.log("Personal: Données chargées avec succès");
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
        console.log("Personal: Fin du chargement");
      }
    };
    
    fetchData();
    
    // Force le chargement à se terminer après un délai maximum
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log("Personal: Fin du chargement forcée après timeout");
        setIsLoading(false);
      }
    }, 2000);
    
    return () => {
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Mon Univers</h1>
      
      <Tabs defaultValue="clothes" className="w-full">
        <TabsList className="mb-4 w-full md:w-auto flex overflow-x-auto pb-1">
          <TabsTrigger value="clothes">Mes Vêtements</TabsTrigger>
          <TabsTrigger value="outfits">Mes Tenues</TabsTrigger>
          <TabsTrigger value="favorites">Mes Favoris</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clothes" className="space-y-4">
          <ModuleGuard moduleCode="clothes" fallback={<ModuleUnavailable name="Vêtements" />}>
            <ClothingSection items={clothingItems} />
          </ModuleGuard>
        </TabsContent>
        
        <TabsContent value="outfits" className="space-y-4">
          <ModuleGuard moduleCode="outfits" fallback={<ModuleUnavailable name="Tenues" />}>
            <OutfitsSection outfits={outfits} />
          </ModuleGuard>
        </TabsContent>
        
        <TabsContent value="favorites" className="space-y-4">
          <ModuleGuard moduleCode="outfits" fallback={<ModuleUnavailable name="Favoris" />}>
            <FavoritesSection />
          </ModuleGuard>
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <ModuleGuard moduleCode="clothes" fallback={<ModuleUnavailable name="Calendrier" />}>
            <CalendarSection />
          </ModuleGuard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Personal;
