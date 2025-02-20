
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useClothingDetection = () => {
  const [detecting, setDetecting] = useState(false);
  const { toast } = useToast();

  const detectClothing = async (imageUrl: string) => {
    try {
      setDetecting(true);
      console.log("Attempting to detect features for image:", imageUrl);
      
      const { data, error } = await supabase.functions.invoke('detect-clothing', {
        body: { imageUrl }
      });

      if (error) {
        console.error("Detection error:", error);
        throw error;
      }

      console.log("Detection succeeded:", data);
      
      if (data?.category || data?.color) {
        toast({
          title: "Détection réussie",
          description: "Les caractéristiques du vêtement ont été détectées",
        });
      } else {
        console.log("No features detected in the response");
        toast({
          title: "Détection partielle",
          description: "Certaines caractéristiques n'ont pas pu être détectées",
        });
      }

      return data;
    } catch (error: any) {
      console.error("Error in detectClothing:", error);
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
