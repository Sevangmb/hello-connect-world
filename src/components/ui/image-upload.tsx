
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  onUploading?: (isUploading: boolean) => void;
  bucket?: string;
  folder?: string;
  currentImageUrl?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function ImageUpload({
  onImageUploaded,
  onUploading,
  bucket = 'shop-images',
  folder = 'products',
  currentImageUrl,
  value,
  onChange
}: ImageUploadProps) {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string | null>(currentImageUrl || value || null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Update the image URL when value changes externally
    if (value !== undefined && value !== imageUrl) {
      setImageUrl(value);
    }
  }, [value]);

  useEffect(() => {
    // Update the image URL when currentImageUrl changes externally
    if (currentImageUrl !== undefined && currentImageUrl !== imageUrl) {
      setImageUrl(currentImageUrl);
    }
  }, [currentImageUrl]);

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${folder}/${Math.random().toString(36).substring(2)}.${fileExt}`;

      setIsUploading(true);
      if (onUploading) onUploading(true);

      // Make sure the bucket exists
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        if (!buckets?.find(b => b.name === bucket)) {
          await supabase.storage.createBucket(bucket, {
            public: true
          });
        }
      } catch (error) {
        console.error('Error checking/creating bucket:', error);
      }

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          upsert: true
        });

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      setImageUrl(urlData.publicUrl);
      onImageUploaded(urlData.publicUrl);
      
      // Call onChange if provided
      if (onChange) {
        onChange(urlData.publicUrl);
      }

      toast({
        title: 'Image téléchargée',
        description: 'L\'image a été téléchargée avec succès',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de télécharger l\'image',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (onUploading) onUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl(null);
    onImageUploaded('');
    
    // Call onChange if provided
    if (onChange) {
      onChange('');
    }
  };

  return (
    <div className="w-full">
      {imageUrl ? (
        <div className="relative w-full h-40 mb-2">
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-full h-full object-cover rounded-md"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-center">
          <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-2">
            Glissez et déposez une image, ou cliquez pour parcourir
          </p>
          <input
            type="file"
            id="imageUpload"
            className="hidden"
            accept="image/*"
            onChange={uploadImage}
            disabled={isUploading}
          />
          <label
            htmlFor="imageUpload"
            className="cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
          >
            {isUploading ? 'Téléchargement...' : 'Sélectionner une image'}
          </label>
        </div>
      )}
    </div>
  );
}
