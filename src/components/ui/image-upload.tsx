
import React, { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Image, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface ImageUploadProps {
  onChange: (url: string) => void;
  defaultImage?: string;
  onUploading?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, defaultImage = "", onUploading }) => {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image selection
  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the selected image
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the image
    handleImageUpload(file);
  };

  // Handle image upload to Supabase Storage
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    if (onUploading) onUploading(true);
    setError(null);

    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Return the URL
      onChange(publicUrl);
    } catch (error: any) {
      console.error('Error uploading image:', error.message);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      if (onUploading) onUploading(false);
    }
  };

  // Clear the selected image
  const handleClearImage = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        ref={fileInputRef}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={handleClearImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={handleButtonClick}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          <Image size={32} className="text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Click to upload an image</p>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={handleButtonClick}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Select Image'}
      </Button>
    </div>
  );
};

export default ImageUpload;
