
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useClothingDetection = () => {
  const [detecting, setDetecting] = useState(false);
  const { toast } = useToast();

  const detectClothing = async (imageUrl: string) => {
    try {
      setDetecting(true);
      
      const { data, error } = await supabase.functions.invoke('detect-clothing', {
        body: { imageUrl }
      });

      if (error) throw error;
      
      toast({
        title: "Détection réussie",
        description: "Les caractéristiques du vêtement ont été détectées",
      });

      return data;
    } catch (error: any) {
      console.error("Error detecting clothing:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de détecter les caractéristiques du vêtement",
      });
      return null;
    } finally {
      setDetecting(false);
    }
  };

  return { detectClothing, detecting };
};
