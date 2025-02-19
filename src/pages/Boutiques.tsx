
import { useNavigate } from "react-router-dom";
import { Plus, List, MapPin } from "lucide-react";
import { PageLayout } from "@/components/layouts/PageLayout";
import { ShopCard } from "@/components/shop/ShopCard";
import { StoreFilters } from "@/components/stores/StoreFilters";
import StoreMap from "@/components/stores/StoreMap";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStores } from "@/hooks/useStores";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Boutiques() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    stores,
    loading,
    filters,
    setFilters,
  } = useStores();

  const handleCreateShop = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour créer une boutique",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    navigate("/shops/create");
  };

  return (
    <PageLayout>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Boutiques</h1>
            <p className="text-sm text-muted-foreground">
              Découvrez les boutiques de vêtements de seconde main
            </p>
          </div>
          <Button onClick={handleCreateShop}>
            <Plus className="h-4 w-4 mr-2" />
            Ouvrir ma boutique
          </Button>
        </div>

        <StoreFilters 
          filters={filters}
          onFiltersChange={setFilters}
        />

        <Tabs defaultValue="list" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Liste
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Carte
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            {loading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : stores?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune boutique trouvée
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 mt-6">
                {stores.map((store) => (
                  <ShopCard 
                    key={store.id} 
                    shop={store}
                    onAction={() => navigate(`/shops/${store.id}`)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="map">
            <div className="mt-6 h-[500px]">
              <StoreMap />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
