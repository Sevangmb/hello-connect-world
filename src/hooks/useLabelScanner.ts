
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ClothesFormData } from "@/components/clothes/types";

export const useLabelScanner = (onFormChange: (field: keyof ClothesFormData, value: any) => void) => {
  const [scanning, setScanning] = useState(false);
  const { toast } = useToast();

  const scanLabel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setScanning(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Vous devez sélectionner une image de l'étiquette");
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from("clothes")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("clothes")
        .getPublicUrl(filePath);

      const response = await supabase.functions.invoke('scan-label', {
        body: { imageUrl: publicUrl }
      });

      if (response.error) throw response.error;

      const { brand, size, material, color, category } = response.data;

      onFormChange('brand', brand || '');
      onFormChange('size', size || '');
      onFormChange('material', material || '');
      onFormChange('color', color || '');
      onFormChange('category', category || '');

      toast({
        title: "Étiquette analysée",
        description: "Les informations ont été extraites avec succès",
      });
    } catch (error: any) {
      console.error("Error scanning label:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'analyser l'étiquette",
      });
    } finally {
      setScanning(false);
    }
  };

  return { scanLabel, scanning };
};
