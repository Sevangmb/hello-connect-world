
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
          
          if (fieldName === 'category' && typeof value === 'string' && !CATEGORIES.includes(value)) {
            console.warn(`Detected category "${value}" is not in the allowed list`);
            return;
          }

          switch (fieldName) {
            case 'price':
              processedData[fieldName] = typeof value === 'string' ? parseFloat(value) : value as number;
              break;
            case 'weather_categories':
              processedData[fieldName] = Array.isArray(value) ? value : [value.toString()];
              break;
            case 'is_for_sale':
            case 'needs_alteration':
              processedData[fieldName] = Boolean(value);
              break;
            case 'name':
            case 'description':
            case 'category':
            case 'subcategory':
            case 'brand':
            case 'size':
            case 'material':
            case 'color':
            case 'style':
            case 'purchase_date':
              processedData[fieldName] = value.toString();
              break;
          }
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
