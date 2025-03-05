import { Button } from "@/components/ui/button";
import { ClothesBasicInfo } from "./forms/ClothesBasicInfo";
import { ClothesDetails } from "./forms/ClothesDetails";
import { ClothesOptions } from "./forms/ClothesOptions";
import ClothesImageUpload from "./forms/ClothesImageUpload";
import { ClothesDetectionButtons } from "./components/ClothesDetectionButtons";
import { ClothesFormData } from "./types";
import { CATEGORIES, STYLES, WEATHER_CATEGORIES } from "./constants/categories";
import { useState } from "react";

interface EditClothesFormProps {
  clothesId: string;
  formData: ClothesFormData;
  onFormChange: (field: keyof ClothesFormData, value: any) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const EditClothesForm = ({ 
  clothesId,
  formData,
  onFormChange,
  onSubmit
}: EditClothesFormProps) => {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Modifier le vêtement</h2>
        <p className="text-muted-foreground">
          Modifiez les informations du vêtement
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-4">
          <ClothesImageUpload
            onChange={(url) => onFormChange('image_url', url)}
            onUploading={setUploading}
            currentImageUrl={formData.image_url || ''}
          />

          {formData.image_url && (
            <ClothesDetectionButtons
              imageUrl={formData.image_url}
              onFormChange={onFormChange}
            />
          )}
        </div>

        <ClothesBasicInfo
          formData={formData}
          onFormChange={onFormChange}
          categories={CATEGORIES}
          styles={STYLES}
          weatherCategories={WEATHER_CATEGORIES}
        />

        <ClothesDetails
          formData={formData}
          onFormChange={onFormChange}
        />

        <ClothesOptions
          formData={formData}
          onFormChange={onFormChange}
        />

        <Button type="submit">
          Enregistrer les modifications
        </Button>
      </form>
    </div>
  );
};
