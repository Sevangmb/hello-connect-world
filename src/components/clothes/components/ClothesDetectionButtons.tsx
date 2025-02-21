
import { ClothingDetector } from "./ClothingDetector";
import { ClothesFormData } from "../types";

interface ClothesDetectionButtonsProps {
  imageUrl: string;
  onFormChange: (field: keyof ClothesFormData, value: any) => void;
}

export const ClothesDetectionButtons = ({ imageUrl, onFormChange }: ClothesDetectionButtonsProps) => {
  const handleDetectionComplete = (data: Partial<ClothesFormData>) => {
    Object.entries(data).forEach(([field, value]) => {
      if (value !== undefined) {
        onFormChange(field as keyof ClothesFormData, value);
      }
    });
  };

  return (
    <ClothingDetector
      imageUrl={imageUrl}
      onDetectionComplete={handleDetectionComplete}
    />
  );
};
