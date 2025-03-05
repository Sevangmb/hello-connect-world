import React from "react";
import { useFormContext } from "react-hook-form";
import ImageUpload from "@/components/ui/image-upload";

interface ClothesImageUploadProps {
  onUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClothesImageUpload: React.FC<ClothesImageUploadProps> = ({ onUploading }) => {
  const { setValue, getValues } = useFormContext();

  const handleImageChange = (url: string) => {
    setValue("image_url", url);
  };

  const imageUrl = getValues("image_url");

  return (
    <ImageUpload
      onChange={handleImageChange}
      defaultImage={imageUrl}
      onUploading={onUploading}
    />
  );
};

export default ClothesImageUpload;
