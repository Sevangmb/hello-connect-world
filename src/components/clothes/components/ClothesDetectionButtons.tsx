
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, ScanLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClothingDetection } from "@/hooks/useClothingDetection";
import { useLabelScanner } from "@/hooks/useLabelScanner";
import { ClothesFormData } from "../types";
import { CATEGORIES } from "../constants/categories";

interface ClothesDetectionButtonsProps {
  imageUrl: string;
  onFormChange: (field: keyof ClothesFormData, value: any) => void;
}

export const ClothesDetectionButtons = ({ imageUrl, onFormChange }: ClothesDetectionButtonsProps) => {
  const { detectClothing, detecting } = useClothingDetection();
  const { scanLabel, scanning } = useLabelScanner(onFormChange);
  const { toast } = useToast();

  const handleDetectFeatures = async () => {
    console.log("Detecting features for image:", imageUrl);
    const data = await detectClothing(imageUrl);
    
    if (data) {
      console.log("Detection results:", data);
      
      // Mettre à jour chaque champ détecté
      Object.entries(data).forEach(([field, value]) => {
        if (value !== undefined) {
          const fieldName = field as keyof ClothesFormData;
          
          // Skip invalid categories
          if (fieldName === 'category' && !CATEGORIES.includes(value as string)) {
            console.warn(`Detected category "${value}" is not in the allowed list`);
            return;
          }

          // Convert values to the correct type based on the field
          let processedValue = value;
          if (fieldName === 'price') {
            processedValue = typeof value === 'string' ? parseFloat(value) : value;
          } else if (typeof value === 'number') {
            processedValue = value.toString();
          } else if (fieldName === 'weather_categories' && !Array.isArray(value)) {
            processedValue = [value.toString()];
          } else if (['is_for_sale', 'needs_alteration'].includes(fieldName)) {
            processedValue = Boolean(value);
          }

          console.log(`Setting ${field} to:`, processedValue);
          onFormChange(fieldName, processedValue);
        }
      });
    }
  };

  return (
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
        onClick={() => scanLabel(imageUrl)}
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
  );
};
