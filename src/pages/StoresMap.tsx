
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { StoreFilters } from "@/components/stores/StoreFilters";
import StoreMap from "@/components/stores/StoreMap";
import { useStores } from "@/hooks/useStores";

const StoresMap = () => {
  const {
    stores,
    loading,
    filters,
    setFilters,
  } = useStores();

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
            
            <StoreMap />
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default StoresMap;
