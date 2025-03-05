
import React from "react";
import ImageUpload from "@/components/ui/image-upload";
import { ClothesFormData } from "../types";

interface ClothesImageUploadProps {
  formData: ClothesFormData;
  onFormChange: (field: keyof ClothesFormData, value: any) => void;
}

export const ClothesImageUpload = ({
  formData,
  onFormChange,
}: ClothesImageUploadProps) => {
  const handleImageUploaded = (url: string) => {
    onFormChange("image_url", url);
  };

  return (
    <ImageUpload
      currentImageUrl={formData.image_url}
      onImageUploaded={handleImageUploaded}
      bucket="clothes"
    />
  );
};
