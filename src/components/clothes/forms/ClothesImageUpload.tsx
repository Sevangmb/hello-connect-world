
import React, { useState } from 'react';
import { ImageUpload } from '@/components/ui/image-upload';
import { Dispatch, SetStateAction } from 'react';

interface ClothesImageUploadProps {
  onChange: (url: string) => void;
  onUploading: Dispatch<SetStateAction<boolean>>;
  defaultValue?: string;
}

const ClothesImageUpload: React.FC<ClothesImageUploadProps> = ({
  onChange,
  onUploading,
  defaultValue = ''
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Image du vêtement
      </label>
      <div className="mt-1">
        <ImageUpload
          onChange={onChange}
          onUploading={onUploading}
          currentImageUrl={defaultValue}
        />
      </div>
      <p className="text-xs text-gray-500">
        Téléchargez une image claire du vêtement.
      </p>
    </div>
  );
};

export default ClothesImageUpload;
