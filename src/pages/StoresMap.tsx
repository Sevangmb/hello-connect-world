
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { StoreFilters } from "@/components/stores/StoreFilters";
import StoreMap from "@/components/shop/ShopMap";
import { useStores } from "@/hooks/useStores";
import { useNavigate } from "react-router-dom";

const StoresMap = () => {
  const navigate = useNavigate();
  const {
    stores,
    loading,
    filters,
    setFilters,
  } = useStores();

  // Préparer les données pour la carte
  const mapStores = stores.map(store => ({
    id: store.id,
    name: store.name,
    description: store.description || '',
    latitude: store.latitude || 0,
    longitude: store.longitude || 0,
    address: store.address || '',
  })).filter(store => store.latitude && store.longitude);

  // Gérer le clic sur une boutique sur la carte
  const handleShopSelect = (shopId: string) => {
    navigate(`/shops/${shopId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4">Carte des Boutiques</h1>
            <p className="text-gray-600 mb-6">
              La carte des boutiques permet aux utilisateurs de FRING! de localiser 
              visuellement et de découvrir facilement les boutiques de prêt-à-porter 
              indépendantes partenaires à proximité de leur position ou dans une zone 
              géographique choisie.
            </p>

            <StoreFilters 
              filters={filters}
              onFiltersChange={setFilters}
            />
            
            <div className="mt-6">
              <StoreMap 
                shops={mapStores} 
                isLoading={loading} 
                onShopSelect={handleShopSelect}
              />
              
              {stores.length > 0 && mapStores.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 mt-4">
                  <p>Les boutiques trouvées n'ont pas de coordonnées géographiques et ne peuvent pas être affichées sur la carte.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default StoresMap;
