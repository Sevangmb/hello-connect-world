
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/modules/auth";
import { ClothingItemCard } from "@/components/home/components/ClothingItemCard";
import { supabase } from "@/integrations/supabase/client";
import { ModuleGuard } from "@/components/modules/ModuleGuard";

const Personal: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [clothingItems, setClothingItems] = useState<any[]>([]);
  const [outfits, setOutfits] = useState<any[]>([]);
  
  useEffect(() => {
    console.log("Personal: Initialisation du chargement");
    
    const fetchData = async () => {
      if (!user) return;
      
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
        
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log("Personal: Fin du chargement forcée après timeout");
        setIsLoading(false);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [user, isLoading]);

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

const ModuleUnavailable = ({ name }: { name: string }) => (
  <Card className="p-6 bg-amber-50 border-amber-200">
    <h2 className="text-amber-800 font-semibold mb-2">Module {name} indisponible</h2>
    <p className="text-amber-700">
      Ce module est actuellement désactivé ou en cours de maintenance.
    </p>
  </Card>
);

const ClothingSection = ({ items }: { items: any[] }) => {
  if (items.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Vos Vêtements</h2>
        <p className="text-gray-500 mb-4">Vous n'avez pas encore ajouté de vêtements.</p>
        <button className="bg-primary text-white px-4 py-2 rounded-md">
          Ajouter un vêtement
        </button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
        <span>Vos Vêtements</span>
        <button className="text-sm bg-primary text-white px-3 py-1 rounded-md">
          Voir tous
        </button>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <ClothingCard key={item.id} item={item} />
        ))}
      </div>
    </Card>
  );
};

const OutfitsSection = ({ outfits }: { outfits: any[] }) => {
  if (outfits.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Vos Tenues</h2>
        <p className="text-gray-500 mb-4">Vous n'avez pas encore créé de tenues.</p>
        <button className="bg-primary text-white px-4 py-2 rounded-md">
          Créer une tenue
        </button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
        <span>Vos Tenues</span>
        <button className="text-sm bg-primary text-white px-3 py-1 rounded-md">
          Voir toutes
        </button>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {outfits.map((outfit) => (
          <OutfitCard key={outfit.id} outfit={outfit} />
        ))}
      </div>
    </Card>
  );
};

const FavoritesSection = () => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold mb-4">Vos Favoris</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <FavoriteCard key={i} />
      ))}
    </div>
  </Card>
);

const CalendarSection = () => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold mb-4">Calendrier d'utilisation</h2>
    <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
      <p className="text-gray-500">Calendrier à venir</p>
    </div>
  </Card>
);

const ClothingCard = ({ item }: { item: any }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
    <div className="aspect-square w-full relative">
      <img 
        src={item.image_url || '/placeholder.svg'} 
        alt={item.name} 
        className="object-cover w-full h-full"
      />
    </div>
    <div className="p-3">
      <h3 className="font-medium">{item.name}</h3>
      <div className="flex justify-between items-center mt-1">
        <span className="text-sm text-gray-500">{item.category}</span>
        {item.brand && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{item.brand}</span>}
      </div>
    </div>
  </div>
);

const OutfitCard = ({ outfit }: { outfit: any }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
    <div className="p-3 border-b bg-gray-50">
      <h3 className="font-medium">{outfit.name || "Tenue sans nom"}</h3>
      {outfit.season && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{outfit.season}</span>}
    </div>
    <div className="grid grid-cols-3 gap-1 p-3">
      <div className="aspect-square bg-gray-100 rounded">
        {outfit.top_id && outfit.top_id.image_url && (
          <img src={outfit.top_id.image_url} alt="Haut" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="aspect-square bg-gray-100 rounded">
        {outfit.bottom_id && outfit.bottom_id.image_url && (
          <img src={outfit.bottom_id.image_url} alt="Bas" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="aspect-square bg-gray-100 rounded">
        {outfit.shoes_id && outfit.shoes_id.image_url && (
          <img src={outfit.shoes_id.image_url} alt="Chaussures" className="w-full h-full object-cover" />
        )}
      </div>
    </div>
  </div>
);

const FavoriteCard = () => (
  <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
    <div className="flex gap-3 items-center mb-3">
      <div className="w-12 h-12 bg-gray-100 rounded-md"></div>
      <div>
        <h3 className="font-medium">Favori</h3>
        <p className="text-xs text-gray-500">Ajouté récemment</p>
      </div>
    </div>
    <p className="text-sm text-gray-700">
      Description du favori...
    </p>
  </div>
);

export default Personal;
