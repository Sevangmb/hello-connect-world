
import React, { useState } from 'react';
import { Button } from './button';
import { Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export interface ImageUploadProps {
  onChange: (url: string) => void;
  onUploading: React.Dispatch<React.SetStateAction<boolean>>;
  currentImageUrl?: string; // Making this prop optional
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  onUploading,
  currentImageUrl = '',
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Maximum size is 5MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      return;
    }

    setError(null);
    onUploading(true);

    try {
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setError(err.message || 'An error occurred during upload.');
    } finally {
      onUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl('');
    onChange('');
  };

  return (
    <div className="space-y-2">
      {previewUrl ? (
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="max-h-64 rounded-md object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Click to upload an image</p>
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
