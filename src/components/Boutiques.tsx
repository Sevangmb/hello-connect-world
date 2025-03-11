
import { useState, useEffect } from "react";
import StoreMap from "./StoreMap";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NearbyShop, ShopStatus } from "@/types/messages";

const Boutiques = () => {
  const [stores, setStores] = useState<NearbyShop[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const fetchStores = async () => {
      try {
        const { data, error } = await supabase
          .from("shops")
          .select("*, profiles:user_id (username), shop_items (id)");

        if (error) throw error;

        if (isMounted && data) {
          // Convert shop data to NearbyShop type with proper ShopStatus
          const formattedShops = data.map((shop: any) => ({
            ...shop,
            status: shop.status as ShopStatus
          }));
          
          setStores(formattedShops as NearbyShop[]);
        }
      } catch (error: any) {
        if (isMounted) {
          console.error("Error fetching shops:", error.message);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer les magasins",
          });
        }
      }
    };

    fetchStores();

    return () => {
      isMounted = false;
    };
  }, [toast]);

  return (
    <div>
      <h1>Boutiques</h1>
      <div>
        {stores.map((store) => (
          <StoreMap key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
};

export default Boutiques;
