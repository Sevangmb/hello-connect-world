
import React, { useState, useRef, Dispatch, SetStateAction } from 'react';
import { Button } from './button';
import { Upload, Image as ImageIcon } from 'lucide-react';

export interface ImageUploadProps {
  onChange: (url: string) => void;
  value?: string;
  onUploading: Dispatch<SetStateAction<boolean>>;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value = '', onUploading }) => {
  const [previewUrl, setPreviewUrl] = useState<string>(value);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Update local state first
    setIsUploading(true);
    onUploading(true);

    // Create a local preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // Define the FormData for uploading
      const formData = new FormData();
      formData.append('file', file);

      // Upload to the server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
      onUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      
      {previewUrl ? (
        <div className="relative w-full h-48 bg-muted rounded-md overflow-hidden">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            onClick={triggerFileInput}
            className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm"
            size="sm"
          >
            Changer
          </Button>
        </div>
      ) : (
        <div
          onClick={triggerFileInput}
          className="w-full h-48 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary transition-colors"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Téléchargement...</p>
            </div>
          ) : (
            <>
              <div className="p-2 bg-muted rounded-full">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Cliquez pour télécharger</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
