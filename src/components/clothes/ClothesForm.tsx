import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, ScanLine } from "lucide-react";
import { useClothesSubmit } from "@/hooks/useClothesSubmit";
import { useClothingDetection } from "@/hooks/useClothingDetection";
import { useLabelScanner } from "@/hooks/useLabelScanner";
import { ClothesBasicInfo } from "./forms/ClothesBasicInfo";
import { ClothesDetails } from "./forms/ClothesDetails";
import { ClothesOptions } from "./forms/ClothesOptions";
import { ClothesImageUpload } from "./forms/ClothesImageUpload";
import { ClothesFormData } from "./types";
import { supabase } from "@/integrations/supabase/client";

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
  "Vacances",
  "Business",
];

const WEATHER_CATEGORIES = [
  "Été",
  "Hiver",
  "Mi-saison",
  "Pluie",
  "Soleil",
  "Intérieur",
];

const initialFormData: ClothesFormData = {
  name: "",
  description: "",
  category: "",
  image_url: null,
  brand: "",
  size: "",
  material: "",
  color: "",
  style: "",
  price: null,
  purchase_date: "",
  is_for_sale: false,
  needs_alteration: false,
  weather_categories: [],
};

interface ClothesFormProps {
  clothesId?: string;
  initialData?: ClothesFormData;
  onSuccess: () => void;
}

export const ClothesForm = ({ clothesId, initialData, onSuccess }: ClothesFormProps) => {
  const [formData, setFormData] = useState<ClothesFormData>(initialData || initialFormData);
  const { detectClothing, detecting } = useClothingDetection();
  const { scanLabel, scanning } = useLabelScanner((field, value) => handleFormChange(field, value));
  const { toast } = useToast();
  const isEditing = Boolean(clothesId);
  
  const handleFormChange = (field: keyof ClothesFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    console.log("Form data updated:", field, value);
  };

  const handleDetectFeatures = async () => {
    if (!formData.image_url) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez d'abord ajouter une image",
      });
      return;
    }

    console.log("Detecting features for image:", formData.image_url);
    const data = await detectClothing(formData.image_url);
    
    if (data) {
      console.log("Detection results:", data);
      
      const updatedFormData = { ...formData };
      let changes = false;

      if (data.category && CATEGORIES.includes(data.category)) {
        console.log("Setting category to:", data.category);
        updatedFormData.category = data.category;
        changes = true;
      }

      if (data.color) {
        console.log("Setting color to:", data.color);
        updatedFormData.color = data.color;
        changes = true;
      }
      
      if (changes) {
        console.log("Updating form data to:", updatedFormData);
        setFormData(updatedFormData);
      }
    }
  };

  const { submitClothes, loading: submitLoading } = useClothesSubmit(() => {
    setFormData(initialFormData);
    onSuccess();
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
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
            weather_categories: formData.weather_categories,
            updated_at: new Date().toISOString(),
          })
          .eq("id", clothesId);

        if (error) throw error;

        toast({
          title: "Vêtement modifié",
          description: "Le vêtement a été modifié avec succès",
        });

        onSuccess();
      } else {
        await submitClothes(formData);
      }
    } catch (error: any) {
      console.error("Error submitting clothes:", error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: isEditing ? "Impossible de modifier le vêtement" : "Impossible d'ajouter le vêtement",
      });
    }
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          {isEditing ? "Modifier le vêtement" : "Ajouter un vêtement"}
        </h2>
        <p className="text-muted-foreground">
          {isEditing ? "Modifiez les informations du vêtement" : "Ajoutez un nouveau vêtement à votre garde-robe"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <ClothesImageUpload
            formData={formData}
            onFormChange={handleFormChange}
          />

          {formData.image_url && (
            <div className="flex flex-col md:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleDetectFeatures}
                disabled={detecting}
                className="flex-1"
              >
                {detecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Détection en cours...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Détecter les caractéristiques
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => scanLabel(formData.image_url!)}
                disabled={scanning}
                className="flex-1"
              >
                {scanning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scan en cours...
                  </>
                ) : (
                  <>
                    <ScanLine className="w-4 h-4 mr-2" />
                    Scanner l'étiquette
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <ClothesBasicInfo
          formData={formData}
          onFormChange={handleFormChange}
          categories={CATEGORIES}
          styles={STYLES}
          weatherCategories={WEATHER_CATEGORIES}
        />

        <ClothesDetails
          formData={formData}
          onFormChange={handleFormChange}
        />

        <ClothesOptions
          formData={formData}
          onFormChange={handleFormChange}
        />

        <Button type="submit" disabled={submitLoading || (!isEditing && !formData.category)}>
          {submitLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              {isEditing ? "Enregistrement..." : "Ajout en cours..."}
            </>
          ) : (
            isEditing ? "Enregistrer les modifications" : "Ajouter le vêtement"
          )}
        </Button>
      </form>
    </div>
  );
};
