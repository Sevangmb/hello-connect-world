
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ClothesBasicInfo } from "./forms/ClothesBasicInfo";
import { ClothesDetails } from "./forms/ClothesDetails";
import { ClothesOptions } from "./forms/ClothesOptions";
import { ClothesImageUpload } from "./forms/ClothesImageUpload";
import { ClothesFormData } from "./types";

const CATEGORIES = [
  "Hauts",
  "Bas",
  "Robes",
  "Manteaux",
  "Chaussures",
  "Accessoires",
];

const STYLES = [
  "Casual",
  "Formel",
  "Sport",
  "Soirée",
  "Plage",
  "Business",
];

interface EditClothesFormProps {
  clothesId: string;
  initialData: ClothesFormData;
  onSuccess: () => void;
}

export const EditClothesForm = ({ clothesId, initialData, onSuccess }: EditClothesFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ClothesFormData>(initialData);

  const handleFormChange = (field: keyof ClothesFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Convert price to number for database
      const priceValue = formData.price ? Number(formData.price) : null;
      
      const { error } = await supabase
        .from("clothes")
        .update({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          brand: formData.brand,
          size: formData.size,
          material: formData.material,
          color: formData.color,
          style: formData.style,
          price: priceValue,
          purchase_date: formData.purchase_date,
          is_for_sale: formData.is_for_sale,
          needs_alteration: formData.needs_alteration,
          image_url: formData.image_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", clothesId);

      if (error) throw error;

      toast({
        title: "Vêtement modifié",
        description: "Le vêtement a été modifié avec succès",
      });

      queryClient.invalidateQueries({ queryKey: ["clothes"] });
      onSuccess();
    } catch (error: any) {
      console.error("Error updating clothes:", error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le vêtement",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ClothesBasicInfo
        formData={formData}
        onFormChange={handleFormChange}
        categories={CATEGORIES}
        styles={STYLES}
      />

      <ClothesDetails
        formData={formData}
        onFormChange={handleFormChange}
      />

      <ClothesOptions
        formData={formData}
        onFormChange={handleFormChange}
      />

      <ClothesImageUpload
        formData={formData}
        onFormChange={handleFormChange}
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer"
          )}
        </Button>
      </div>
    </form>
  );
};
