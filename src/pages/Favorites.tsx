
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShopCard } from "@/components/shop/ShopCard";

const Favorites = () => {
  const [favoriteShops, setFavoriteShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteShops = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: favorites, error } = await supabase
          .from('favorite_shops')
          .select(`
            shop_id,
            shops (
              id,
              name,
              description,
              average_rating,
              categories
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        const shops = favorites?.map(fav => fav.shops) || [];
        setFavoriteShops(shops);
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteShops();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mes Boutiques Favorites</CardTitle>
              <CardDescription>Les boutiques que vous suivez</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center">Chargement...</p>
              ) : favoriteShops.length === 0 ? (
                <p className="text-center text-gray-500">Vous n'avez pas encore de boutiques favorites</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteShops.map((shop) => (
                    <ShopCard key={shop.id} shop={shop} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Favorites;
