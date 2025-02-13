
import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Store } from "@/hooks/useStores";

interface StoreMapProps {
  store: Store;
}

const StoreMap: React.FC<StoreMapProps> = ({ store }) => {
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("shops")
          .select("*");

        if (error) throw error;

        if (isMounted) {
          // ...set state or perform other actions...
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

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [toast]);

  return (
    <div>
      <h2>{store.name}</h2>
      <p>{store.description}</p>
    </div>
  );
};

export default StoreMap;
