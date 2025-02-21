
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ClothesFormData } from "@/components/clothes/types";

export const useClothingDetection = () => {
  const [detecting, setDetecting] = useState(false);
  const { toast } = useToast();

  const detectClothing = async (imageUrl: string): Promise<Partial<ClothesFormData> | null> => {
    try {
      setDetecting(true);
      
      toast({
        title: "Détection en cours",
        description: "Analyse de l'image avec l'IA...",
      });
      
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

      if (!data) {
        console.log("No data in the response");
        toast({
          title: "Aucune détection",
          description: "Aucune caractéristique n'a pu être détectée sur cette image",
        });
        return null;
      }

      const detectedData: Partial<ClothesFormData> = {
        category: data.category || undefined,
        subcategory: data.subcategory || undefined,
        color: data.color || undefined,
        material: data.material || undefined,
        style: data.style || undefined,
        brand: data.brand || undefined,
        description: data.description || undefined
      };

      // Filtrer les valeurs undefined
      const detectedFeatures = Object.entries(detectedData)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}: ${value}`);

      if (detectedFeatures.length > 0) {
        toast({
          title: "Détection réussie",
          description: "Caractéristiques détectées :\n" + detectedFeatures.join("\n"),
        });
        return detectedData;
      } else {
        toast({
          title: "Détection limitée",
          description: "Peu de caractéristiques ont pu être détectées sur cette image",
        });
        return null;
      }

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
