
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { useShop } from '@/hooks/useShop';
import { LoaderCircle } from 'lucide-react';

export function CreateShopForm() {
  const { createShop } = useShop();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createShop.mutateAsync({
      name,
      description,
      image_url: imageUrl || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nom de la boutique <span className="text-red-500">*</span>
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de votre boutique"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez votre boutique"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Image de la boutique
        </label>
        <ImageUpload
          onImageUploaded={setImageUrl}
          onUploading={setIsUploading}
          bucket="shop-images"
          folder="shops"
          currentImageUrl={imageUrl}
        />
      </div>

      <Button
        type="submit"
        disabled={createShop.isPending || isUploading || !name.trim()}
        className="w-full"
      >
        {createShop.isPending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Création en cours...
          </>
        ) : (
          "Créer ma boutique"
        )}
      </Button>
    </form>
  );
}
