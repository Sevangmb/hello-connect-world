
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClothesFormData } from "./types";
import { ClothesBasicInfo } from "./forms/ClothesBasicInfo";
import { ClothesDetails } from "./forms/ClothesDetails";
import { ClothesOptions } from "./forms/ClothesOptions";
import { ClothesImageUpload } from "./forms/ClothesImageUpload";
import { useClothesSubmit } from "@/hooks/useClothesSubmit";
import { Loader2 } from "lucide-react";

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
  price: "",
  purchase_date: "",
  is_for_sale: false,
  needs_alteration: false,
};

export const AddClothesForm = () => {
  const [formData, setFormData] = useState<ClothesFormData>(initialFormData);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFormChange = (field: keyof ClothesFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const { submitClothes, loading } = useClothesSubmit(() => {
    setFormData(initialFormData);
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitClothes(formData);
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Ajouter un vêtement</h2>
        <p className="text-muted-foreground">
          Ajoutez un nouveau vêtement à votre garde-robe
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          onImageUrlChange={(url) => handleFormChange('image_url', url)}
          onUploadStateChange={setIsUploading}
          imageUrl={formData.image_url}
        />

        <Button type="submit" disabled={loading || !formData.category || isUploading}>
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
