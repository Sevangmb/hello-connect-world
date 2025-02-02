import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, MapPin, Phone, Globe, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function StoresList() {
  const [shops, setShops] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchShops();
    fetchFavorites();
  }, []);

  const fetchShops = async () => {
    try {
      console.log("Fetching stores list...");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No user found");
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour voir la liste des boutiques",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (username),
          shop_items (
            id
          )
        `)
        .eq('status', 'approved');

      if (error) {
        console.error('Error fetching stores:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des boutiques",
          variant: "destructive",
        });
        return;
      }

      console.log("Stores fetched:", data);
      setShops(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorite_shops')
        .select('shop_id');

      if (error) throw error;

      setFavorites(data.map(fav => fav.shop_id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (shopId: string) => {
    try {
      if (favorites.includes(shopId)) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorite_shops')
          .delete()
          .eq('shop_id', shopId);

        if (error) throw error;

        setFavorites(favorites.filter(id => id !== shopId));
        toast({
          title: "Boutique retirée des favoris",
          description: "La boutique a été retirée de vos favoris",
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorite_shops')
          .insert({ shop_id: shopId });

        if (error) throw error;

        setFavorites([...favorites, shopId]);
        toast({
          title: "Boutique ajoutée aux favoris",
          description: "La boutique a été ajoutée à vos favoris",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les favoris",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Liste des Boutiques</h1>
          </div>

          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {shops.map((shop) => (
                <Card key={shop.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{shop.name}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(shop.id);
                          }}
                        >
                          <Heart 
                            className={`h-5 w-5 ${favorites.includes(shop.id) ? 'fill-current text-red-500' : 'text-gray-400'}`}
                          />
                        </Button>
                        <ShoppingBag className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">{shop.description}</p>
                    <div className="flex flex-col gap-2">
                      {shop.address && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{shop.address}</span>
                        </div>
                      )}
                      {shop.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{shop.phone}</span>
                        </div>
                      )}
                      {shop.website && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="h-4 w-4" />
                          <span>{shop.website}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Par {shop.profiles?.username || 'Inconnu'}
                      </span>
                      <Badge variant="secondary">
                        {shop.shop_items?.length || 0} articles
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}