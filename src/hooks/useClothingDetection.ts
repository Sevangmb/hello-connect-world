
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
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la détection",
        });
        return null;
      }

      console.log("Detection succeeded:", data);
      
      if (!data?.category && !data?.color) {
        console.log("No features detected in the response");
        toast({
          title: "Aucune détection",
          description: "Aucune caractéristique n'a pu être détectée sur cette image",
        });
        return null;
      }

      let description = "Détection réussie !";
      if (data.category) description += `\nCatégorie : ${data.category}`;
      if (data.color) description += `\nCouleur : ${data.color}`;

      toast({
        title: "Détection réussie",
        description: description,
      });

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
