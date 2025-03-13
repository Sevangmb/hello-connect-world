import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ShopCard } from "@/components/shop/ShopCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { NearbyShop, ShopStatus } from "@/types/messages";

export default function Shops() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: shops, isLoading } = useQuery({
    queryKey: ["shops", searchQuery],
    queryFn: async () => {
      console.log("Fetching shops with query:", searchQuery);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No user found");
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour voir les boutiques",
          variant: "destructive",
        });
        return [];
      }

      let query = supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (username),
          shop_items (
            id
          )
        `)
        .eq('status', ShopStatus.APPROVED);

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching shops:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les boutiques",
          variant: "destructive",
        });
        throw error;
      }

      console.log("Shops fetched:", data);
      
      // Assurez-vous que le statut est correctement typé en ShopStatus et que shop_items est défini
      return (data || []).map((shop: any) => ({
        ...shop,
        status: shop.status as ShopStatus,
        shop_items: shop.shop_items || [],
        address: shop.address || '',
        latitude: shop.latitude || 0,
        longitude: shop.longitude || 0
      })) as NearbyShop[];
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Boutiques</h1>
            <Button onClick={() => navigate("/shops/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Ouvrir ma boutique
            </Button>
          </div>

          <div className="mb-6">
            <Input
              type="search"
              placeholder="Rechercher une boutique..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {shops?.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
