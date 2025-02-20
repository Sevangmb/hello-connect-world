import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ClothesBasicInfo } from "./forms/ClothesBasicInfo";
import { ClothesDetails } from "./forms/ClothesDetails";
import { ClothesOptions } from "./forms/ClothesOptions";
import { ClothesImageUpload } from "./forms/ClothesImageUpload";
import { ClothesDetectionButtons } from "./components/ClothesDetectionButtons";
import { ClothesFormData } from "./types";
import { CATEGORIES, STYLES, WEATHER_CATEGORIES } from "./constants/categories";
import { useClothesForm } from "./hooks/useClothesForm";
import { ClothesHashtags } from "./forms/ClothesHashtags";

interface ClothesFormProps {
  clothesId?: string;
  initialData?: ClothesFormData;
  onSuccess: () => void;
}

export const ClothesForm = ({ clothesId, initialData, onSuccess }: ClothesFormProps) => {
  const { formData, handleFormChange, handleSubmit, isEditing } = useClothesForm({
    clothesId,
    initialData,
    onSuccess,
  });

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          {isEditing ? "Modifier le vêtement" : "Ajouter un vêtement"}
        </h2>
        <p className="text-muted-foreground">
          {isEditing 
            ? "Modifiez les informations du vêtement" 
            : "Ajoutez un nouveau vêtement à votre garde-robe"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <ClothesImageUpload
            formData={formData}
            onFormChange={handleFormChange}
          />

          {formData.image_url && (
            <ClothesDetectionButtons
              imageUrl={formData.image_url}
              onFormChange={handleFormChange}
            />
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
        
        <ClothesHashtags
          initialHashtags={formData.hashtags}
          onHashtagsChange={(hashtags) => handleFormChange("hashtags", hashtags)}
        />

        <Button 
          type="submit" 
          disabled={!isEditing && !formData.category}
        >
          {isEditing ? "Enregistrer les modifications" : "Ajouter le vêtement"}
        </Button>
      </form>
    </div>
  );
};
