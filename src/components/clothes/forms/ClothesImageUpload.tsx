
import React, { Dispatch, SetStateAction } from 'react';
import ImageUpload from '@/components/ui/image-upload';
import { FormLabel } from '@/components/ui/form';

interface ClothesImageUploadProps {
  onChange: (url: string) => void;
  defaultValue?: string;
  onUploading: Dispatch<SetStateAction<boolean>>;
}

const ClothesImageUpload: React.FC<ClothesImageUploadProps> = ({ 
  onChange, 
  defaultValue = '', 
  onUploading 
}) => {
  return (
    <div className="space-y-2">
      <FormLabel htmlFor="image">Image du vêtement</FormLabel>
      <ImageUpload 
        onChange={onChange} 
        value={defaultValue}
        onUploading={onUploading}
      />
      <p className="text-xs text-muted-foreground mt-1">
        Prenez une photo claire de votre vêtement sur un fond uni.
      </p>
    </div>
  );
};

export default ClothesImageUpload;
