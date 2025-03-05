
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

export interface ImageUploadProps {
  onUploading: (isUploading: boolean) => void;
  onChange: (url: string) => void;
  value?: string; // Add value prop
}

export function ImageUpload({ onUploading, onChange, value }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately 
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Set uploading state
    setIsUploading(true);
    onUploading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload to Supabase Storage
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      // Reset preview on error
      setPreviewUrl(value || null);
    } finally {
      setIsUploading(false);
      onUploading(false);
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      
      <div className="flex flex-col items-center gap-4">
        {previewUrl ? (
          <div className="relative w-full">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto rounded-md object-cover max-h-[200px]"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-[200px] border-dashed"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {isUploading ? 'Uploading...' : 'Click to upload image'}
              </span>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
}
