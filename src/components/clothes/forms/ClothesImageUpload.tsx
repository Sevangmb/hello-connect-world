
import React from 'react';
import { ImageUpload } from "@/components/ui/image-upload";
import { ClothesFormData } from "../types";

interface ClothesImageUploadProps {
  formData: ClothesFormData;
  onFormChange: (field: keyof ClothesFormData, value: any) => void;
}

export default function ClothesImageUpload({ formData, onFormChange }: ClothesImageUploadProps) {
  const handleImageChange = (url: string) => {
    onFormChange("image_url", url);
  };

  const [isUploading, setIsUploading] = React.useState(false);

  return (
    <div className="space-y-4">
      <div className="form-control">
        <label className="block text-sm font-medium">
          Image du vêtement
        </label>
        <div className="mt-1">
          <ImageUpload
            onChange={handleImageChange}
            onUploading={setIsUploading}
            defaultValue={formData.image_url || ''}
          />
        </div>
      </div>
    </div>
  );
}

// Fix for correct imports in parent files
export { default as ClothesImageUpload } from './ClothesImageUpload';
