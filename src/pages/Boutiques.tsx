
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, List, MapPin } from "lucide-react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ShopCard } from "@/components/shop/ShopCard";
import { StoreFilters } from "@/components/stores/StoreFilters";
import StoreMap from "@/components/stores/StoreMap";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStores } from "@/hooks/useStores";

export default function Boutiques() {
  const navigate = useNavigate();
  const {
    stores,
    loading,
    filters,
    setFilters,
  } = useStores();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Boutiques</h1>
              <Button onClick={() => navigate("/shops/create")}>
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
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 mt-6">
                    {stores.map((store) => (
                      <ShopCard key={store.id} shop={store} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="map">
                <div className="mt-6">
                  <StoreMap />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
