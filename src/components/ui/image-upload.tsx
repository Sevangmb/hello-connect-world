
import React, { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export interface ImageUploadProps {
  bucket?: string;
  folder?: string;
  currentImageUrl?: string;
  onChange: (url: string) => void;
  onUploading?: (isUploading: boolean) => void;
  onImageUploaded?: (url: string) => void;
  value?: string;
  defaultValue?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  bucket = 'images',
  folder = 'uploads',
  currentImageUrl = '',
  onChange,
  onUploading,
  onImageUploaded,
  value,
  defaultValue,
}) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImageUrl || value || defaultValue || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (onUploading) onUploading(true);
      
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      const publicUrl = urlData.publicUrl;
      setImageUrl(publicUrl);
      onChange(publicUrl);
      if (onImageUploaded) onImageUploaded(publicUrl);

    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
      if (onUploading) onUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="relative w-full h-48 border-2 border-dashed rounded-md flex items-center justify-center bg-gray-50 overflow-hidden"
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Uploaded" 
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <ImageIcon size={48} />
            <span className="mt-2">Aucune image</span>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleButtonClick}
        disabled={uploading}
        className="w-full"
      >
        {uploading ? 'Téléchargement...' : (imageUrl ? 'Changer l\'image' : 'Télécharger une image')}
        {!uploading && <Upload className="ml-2 h-4 w-4" />}
      </Button>
    </div>
  );
};

export default ImageUpload;
