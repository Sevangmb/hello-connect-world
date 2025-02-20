
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ClothesFormData } from "@/components/clothes/types";

export const useLabelScanner = (onFieldUpdate: (field: keyof ClothesFormData, value: any) => void) => {
  const [scanning, setScanning] = useState(false);
  const { toast } = useToast();

  const scanLabel = async (imageUrl: string) => {
    try {
      setScanning(true);
      console.log("Starting label scan for image:", imageUrl);
      
      toast({
        title: "Scan en cours",
        description: "Analyse de l'étiquette en cours...",
      });

      const { data, error } = await supabase.functions.invoke('scan-label', {
        body: { imageUrl }
      });

      if (error) {
        console.error("Scan error:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors du scan de l'étiquette",
        });
        return;
      }

      console.log("Scan succeeded:", data);

      if (!data) {
        toast({
          title: "Aucune information détectée",
          description: "Aucune information n'a pu être extraite de l'étiquette",
        });
        return;
      }

      // Mise à jour des champs du formulaire
      const fields: (keyof ClothesFormData)[] = ['brand', 'size', 'material', 'color', 'category'];
      let detectedFields = [];

      fields.forEach(field => {
        if (data[field]) {
          onFieldUpdate(field, data[field]);
          detectedFields.push(`${field}: ${data[field]}`);
        }
      });

      if (detectedFields.length > 0) {
        toast({
          title: "Scan réussi",
          description: "Informations détectées :\n" + detectedFields.join("\n"),
        });
      }

    } catch (error: any) {
      console.error("Error in scanLabel:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de scanner l'étiquette",
      });
    } finally {
      setScanning(false);
    }
  };

  return { scanLabel, scanning };
};
