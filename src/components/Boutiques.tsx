import { useState, useEffect } from "react";
import StoreMap from "./StoreMap";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Store {
  id: string;
  name: string;
  description: string;
  // Ajoutez d'autres propriétés nécessaires ici
}

const Boutiques = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const fetchStores = async () => {
      try {
        const { data, error } = await supabase
          .from("stores")
          .select("*");

        if (error) throw error;

        if (isMounted) {
          const filteredData = data.filter((item: any) => item.name && item.description);
          setStores(filteredData);
        }
      } catch (error: any) {
        if (isMounted) {
          console.error("Error fetching stores:", error.message);
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
