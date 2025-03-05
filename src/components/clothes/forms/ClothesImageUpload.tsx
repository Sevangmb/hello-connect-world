
import React, { Dispatch, SetStateAction } from 'react';
import { ImageUpload } from '@/components/ui/image-upload';

export interface ClothesImageUploadProps {
  onChange: (url: string) => void;
  onUploading: Dispatch<SetStateAction<boolean>>;
  currentImageUrl: string;
}

const ClothesImageUpload: React.FC<ClothesImageUploadProps> = ({
  onChange,
  onUploading,
  currentImageUrl
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Image du vêtement</label>
      <ImageUpload
        onChange={onChange}
        onUploading={onUploading}
        currentImageUrl={currentImageUrl}
      />
      {currentImageUrl && (
        <div className="mt-2">
          <p className="text-sm text-gray-500">Image actuelle:</p>
          <img 
            src={currentImageUrl} 
            alt="Vêtement" 
            className="mt-2 max-h-48 rounded-md object-cover" 
          />
        </div>
      )}
    </div>
  );
};

export default ClothesImageUpload;
