import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import MainSidebar from '@/components/MainSidebar';
import { BottomNav } from '@/components/navigation/BottomNav';
import ShopMap from '@/components/shop/ShopMap';
import { ShopCard } from '@/components/shop/ShopCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNearbyShops } from '@/hooks/shop/useNearbyShops';
import { Loader2, MapPin, List, Search, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { NearbyShop } from '@/types/messages';

export default function ShopsMap() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("map");
  const navigate = useNavigate();
  
  const { shops, loading, error, userLocation, refetch } = useNearbyShops({
    radius: 50, // 50km par défaut
  });
  
  // Filtrer les boutiques en fonction de la recherche
  const filteredShops = searchQuery
    ? shops.filter(shop => 
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.address?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : shops;
  
  // Préparer les données pour la carte
  const mapShops = filteredShops.map(shop => ({
    id: shop.id,
    name: shop.name,
    description: shop.description,
    latitude: shop.latitude || 0,
    longitude: shop.longitude || 0,
    address: shop.address || '',
  })).filter(shop => shop.latitude && shop.longitude);
  
  // Gérer le clic sur une boutique sur la carte
  const handleShopSelect = (shopId: string) => {
    navigate(`/shops/${shopId}`);
  };

  // Convertir les shops du hook en type NearbyShop pour ShopCard
  const convertedShops: NearbyShop[] = filteredShops.map(shop => ({
    ...shop,
    address: shop.address || '',
    shop_items: shop.shop_items || [],
  }));
  
  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold">Boutiques</h1>
              <p className="text-muted-foreground mt-1">
                Découvrez les boutiques près de chez vous
              </p>
            </div>
            
            <div className="flex items-center gap-2 self-end md:self-auto">
              {userLocation && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Position détectée
                </Badge>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()} 
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Actualiser
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Rechercher une boutique..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs defaultValue="map" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-[400px] mb-6">
              <TabsTrigger value="map" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Carte
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Liste
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="map" className="mt-0">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
                  <p>{error}</p>
                </div>
              )}
              
              <ShopMap 
                shops={mapShops}
                isLoading={loading}
                onShopSelect={handleShopSelect}
              />
              
              {filteredShops.length > 0 && mapShops.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 mt-4">
                  <p>Les boutiques trouvées n'ont pas de coordonnées géographiques et ne peuvent pas être affichées sur la carte.</p>
                </div>
              )}
              
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Boutiques à proximité ({filteredShops.length})</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {loading ? (
                    <div className="col-span-full flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : convertedShops.length > 0 ? (
                    convertedShops.slice(0, 3).map((shop) => (
                      <ShopCard 
                        key={shop.id} 
                        shop={shop} 
                        showDistance={!!shop.distance}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      <p className="mb-2">Aucune boutique trouvée à proximité.</p>
                      <p className="text-sm">Essayez d'élargir votre recherche ou de désactiver les filtres.</p>
                    </div>
                  )}
                </div>
                
                {filteredShops.length > 3 && (
                  <div className="text-center mt-4">
                    <Button variant="link" onClick={() => setActiveTab("list")}>
                      Voir toutes les boutiques ({filteredShops.length})
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="list" className="mt-0">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
                  <p>{error}</p>
                </div>
              )}
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <div className="col-span-full flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : convertedShops.length > 0 ? (
                  convertedShops.map((shop) => (
                    <ShopCard 
                      key={shop.id} 
                      shop={shop}
                      showDistance={!!shop.distance}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    <p className="mb-2">Aucune boutique trouvée.</p>
                    <p className="text-sm">Essayez de modifier vos critères de recherche.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
