import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Store {
  id: string;
  name: string;
  description: string;
  // Ajoutez d'autres propriétés nécessaires ici
}

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
          .from("stores")
          .select("*");

        if (error) throw error;

        if (isMounted) {
          // ...set state or perform other actions...
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

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [toast]);

  return (
    <div>
      <h2>{store.name}</h2>
      <p>{store.description}</p>
      {/* Ajoutez d'autres éléments d'affichage ici */}
    </div>
  );
};

export default StoreMap;
