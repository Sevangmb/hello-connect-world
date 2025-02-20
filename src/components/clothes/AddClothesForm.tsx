
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClothesFormData } from "./types";
import { ClothesBasicInfo } from "./forms/ClothesBasicInfo";
import { ClothesDetails } from "./forms/ClothesDetails";
import { ClothesOptions } from "./forms/ClothesOptions";
import { ClothesImageUpload } from "./forms/ClothesImageUpload";
import { useClothesSubmit } from "@/hooks/useClothesSubmit";
import { useClothingDetection } from "@/hooks/useClothingDetection";
import { Loader2, Wand2 } from "lucide-react";

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
};

export const AddClothesForm = () => {
  const [formData, setFormData] = useState<ClothesFormData>(initialFormData);
  const { detectClothing, detecting } = useClothingDetection();
  
  const handleFormChange = (field: keyof ClothesFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    console.log("Form data updated:", field, value);
  };

  const handleDetectFeatures = async () => {
    if (!formData.image_url) {
      return;
    }

    console.log("Detecting features for image:", formData.image_url);
    const data = await detectClothing(formData.image_url);
    if (data) {
      console.log("Detection results:", data);
      
      const updatedFormData = {
        ...formData,
      };

      if (data.category) {
        console.log("Setting category to:", data.category);
        updatedFormData.category = data.category;
      }

      if (data.color) {
        console.log("Setting color to:", data.color);
        updatedFormData.color = data.color;
      }
      
      console.log("Updating form data to:", updatedFormData);
      setFormData(updatedFormData);
    }
  };

  const { submitClothes, loading } = useClothesSubmit(() => {
    setFormData(initialFormData);
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitClothes(formData);
  };

  console.log("Current form data:", formData);

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Ajouter un vêtement</h2>
        <p className="text-muted-foreground">
          Ajoutez un nouveau vêtement à votre garde-robe
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <ClothesImageUpload
            formData={formData}
            onFormChange={handleFormChange}
          />
          
          {formData.image_url && (
            <Button
              type="button"
              variant="outline"
              onClick={handleDetectFeatures}
              disabled={detecting}
              className="w-full"
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
          )}
        </div>

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

        <Button type="submit" disabled={loading || !formData.category}>
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Enregistrement...
            </>
          ) : (
            "Ajouter le vêtement"
          )}
        </Button>
      </form>
    </div>
  );
};
