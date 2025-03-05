
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { UploadCloud, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  onUploading: (isUploading: boolean) => void;
  imageUrl?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUploaded, 
  onUploading, 
  imageUrl = '' 
}) => {
  const [image, setImage] = useState<string>(imageUrl);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const fileSize = file.size / 1024 / 1024; // size in MB

    if (fileSize > 5) {
      toast({
        title: "Fichier trop volumineux",
        description: "L'image ne doit pas dépasser 5 MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      onUploading(true);

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('lovable-uploads')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('lovable-uploads')
        .getPublicUrl(filePath);

      setImage(publicUrl);
      onImageUploaded(publicUrl);

      toast({
        title: "Image téléchargée",
        description: "L'image a été téléchargée avec succès",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement de l'image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      onUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImage('');
    onImageUploaded('');
  };

  return (
    <div className="w-full">
      {image ? (
        <div className="relative mb-4 rounded-md border">
          <img
            src={image}
            alt="Uploaded"
            className="mx-auto h-48 rounded-md object-contain"
          />
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute right-2 top-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="mb-4 flex h-48 flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-4">
          <UploadCloud className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="mb-2 text-sm text-muted-foreground">
            Glissez-déposez une image ou cliquez pour parcourir
          </p>
          <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP (max 5MB)</p>
        </div>
      )}
      <div className="flex items-center justify-center">
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          className="relative"
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          {uploading ? 'Téléchargement...' : 'Télécharger une image'}
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </Button>
      </div>
    </div>
  );
};
