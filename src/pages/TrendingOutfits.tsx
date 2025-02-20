
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { TrendingOutfitCard } from "@/components/outfits/TrendingOutfitCard";
import { useTrendingOutfits } from "@/hooks/useTrendingOutfits";

const TrendingOutfits = () => {
  const { data: trendingOutfits, isLoading } = useTrendingOutfits();

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Chargement des tenues populaires...
      </div>
    );
  }

  if (!trendingOutfits?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune tenue populaire pour le moment
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-2xl font-bold">Tenues Populaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingOutfits?.map((outfit) => (
              <TrendingOutfitCard key={outfit.id} outfit={outfit} />
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default TrendingOutfits;
