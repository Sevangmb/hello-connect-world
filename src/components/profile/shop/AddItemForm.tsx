import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from "@/components/ui/image-upload";
import { useShop } from '@/hooks/useShop';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';

interface AddItemFormProps {
  shopId: string;
  onSuccess?: () => void;
}

export function AddItemForm({ shopId, onSuccess }: AddItemFormProps) {
  const { createShopItem } = useShop();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [clothesId, setClothesId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !shopId) return;

    try {
      await createShopItem.mutateAsync({
        shop_id: shopId,
        clothes_id: clothesId || undefined,
        name,
        description,
        price: parseFloat(price) || 0,
        original_price: originalPrice ? parseFloat(originalPrice) : undefined,
        stock: parseInt(stock) || 1,
        status: 'available',
        image_url: imageUrl || undefined
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setOriginalPrice('');
      setStock('1');
      setClothesId('');
      setImageUrl('');
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter l\'article',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nom de l'article <span className="text-red-500">*</span>
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de l'article"
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
          placeholder="Description de l'article"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1">
            Prix <span className="text-red-500">*</span>
          </label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            step="0.01"
            required
          />
        </div>
        
        <div>
          <label htmlFor="originalPrice" className="block text-sm font-medium mb-1">
            Prix original
          </label>
          <Input
            id="originalPrice"
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="0.00"
            step="0.01"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="stock" className="block text-sm font-medium mb-1">
            Stock
          </label>
          <Input
            id="stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="1"
            min="0"
            step="1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Image de l'article
        </label>
        <ImageUpload
          onImageUploaded={setImageUrl}
          onUploading={setIsUploading}
          bucket="shop-images"
          folder="products"
          currentImageUrl={imageUrl}
        />
      </div>

      <Button
        type="submit"
        disabled={createShopItem.isPending || isUploading || !name.trim() || !price}
        className="w-full"
      >
        {createShopItem.isPending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Ajout en cours...
          </>
        ) : (
          "Ajouter l'article"
        )}
      </Button>
    </form>
  );
}
