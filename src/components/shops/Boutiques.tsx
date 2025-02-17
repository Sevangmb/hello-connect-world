import { useState, useEffect } from "react";
import StoreMap from "./StoreMap";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Store } from "@/hooks/useStores";

const Boutiques = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [stats, setStats] = useState({ totalShops: 0, avgItems: 0 });
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const fetchStores = async () => {
      try {
        const { data, error } = await supabase
          .from("shops")
          .select("*, profiles:user_id (username), shop_items (id)");

        if (error) throw error;

        console.debug("Données reçues :", data);
        if (isMounted && data) {
          setStores(data as Store[]);

          // Calcul des statistiques : nombre total de magasins et moyenne des items par magasin
          const totalShops = data.length;
          const totalItems = data.reduce((acc: number, shop: any) => {
            return acc + (shop.shop_items ? shop.shop_items.length : 0);
          }, 0);
          const avgItems = totalShops > 0 ? totalItems / totalShops : 0;
          setStats({ totalShops, avgItems });
          console.debug("Statistiques :", { totalShops, avgItems });
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
        <h2>Statistiques</h2>
        <p>Total de boutiques: {stats.totalShops}</p>
        <p>Moyenne d&apos;items par boutique: {stats.avgItems.toFixed(2)}</p>
      </div>
      {stores.length > 0 ? (
        <div>
          {stores.map((store) => (
            <StoreMap key={store.id} store={store} />
          ))}
        </div>
      ) : (
        <p>Aucun magasin disponible.</p>
      )}
    </div>
  );
};

export default Boutiques;