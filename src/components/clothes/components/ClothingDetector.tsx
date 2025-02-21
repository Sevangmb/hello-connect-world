
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, ScanLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClothingDetection } from "@/hooks/useClothingDetection";
import { useLabelScanner } from "@/hooks/useLabelScanner";
import { ClothesFormData } from "../types";
import { CATEGORIES } from "../constants/categories";

interface ClothingDetectorProps {
  imageUrl: string;
  onDetectionComplete: (data: Partial<ClothesFormData>) => void;
}

export const ClothingDetector = ({ imageUrl, onDetectionComplete }: ClothingDetectorProps) => {
  const { detectClothing, detecting } = useClothingDetection();
  const { scanLabel, scanning } = useLabelScanner((field, value) => {
    handleDetectionResult({ [field]: value });
  });
  const { toast } = useToast();
  const [detectedData, setDetectedData] = useState<Partial<ClothesFormData>>({});

  const handleDetectionResult = (newData: Partial<ClothesFormData>) => {
    const updatedData = { ...detectedData, ...newData };
    setDetectedData(updatedData);
    onDetectionComplete(updatedData);
  };

  const handleDetectFeatures = async () => {
    console.log("Detecting features for image:", imageUrl);
    const data = await detectClothing(imageUrl);
    
    if (data) {
      console.log("Detection results:", data);
      
      const processedData: Partial<ClothesFormData> = {};
      
      Object.entries(data).forEach(([field, value]) => {
        if (value !== undefined) {
          const fieldName = field as keyof ClothesFormData;
          
          if (fieldName === 'category' && !CATEGORIES.includes(value as string)) {
            console.warn(`Detected category "${value}" is not in the allowed list`);
            return;
          }

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

          processedData[fieldName] = processedValue;
        }
      });

      handleDetectionResult(processedData);
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
