
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ClothesFormData } from "@/components/clothes/types";

interface VirtualDressingProps {
  userId: string;
}

interface ClothesData extends ClothesFormData {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const VirtualDressing = ({ userId }: VirtualDressingProps) => {
  const [clothes, setClothes] = useState<ClothesData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const { data, error } = await supabase
          .from("clothes")
          .select("*")
          .eq("user_id", userId);

        if (error) throw error;

        setClothes(data as ClothesData[]);
      } catch (error: any) {
        console.error("Error fetching clothes:", error.message);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les vêtements",
        });
      }
    };

    fetchClothes();
  }, [userId, toast]);

  return (
    <div>
      <h1>Virtual Dressing</h1>
      <div className="clothes-grid">
        {clothes.map((item) => (
          <div key={item.id} className="clothes-item">
            <img src={item.image_url || ''} alt={item.name} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
