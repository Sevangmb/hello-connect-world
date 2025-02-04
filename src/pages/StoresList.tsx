import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ShopCard } from "@/components/shops/ShopCard";
import { StoreFilters } from "@/components/stores/StoreFilters";
import { useStores } from "@/hooks/useStores";

export default function StoresList() {
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
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Liste des Boutiques</h1>
          </div>

          <StoreFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />

          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {stores.map((store) => (
                <ShopCard key={store.id} shop={store} />
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}