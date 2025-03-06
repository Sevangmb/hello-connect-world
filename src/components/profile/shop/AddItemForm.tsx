
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useShop } from '@/hooks/useShop';
import { Shop, ShopItem, ShopItemStatus } from '@/core/shop/domain/types';

interface AddItemFormProps {
  shop: Shop;
  onSuccess?: () => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ shop, onSuccess }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const { useCreateShopItem } = useShop();
  const createShopItem = useCreateShopItem();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // Simuler un upload d'image pour le moment
      setTimeout(() => {
        setImageUrl('/placeholder.svg');
        setValue('image_url', '/placeholder.svg');
        setUploading(false);
        toast.success('Image téléchargée');
      }, 1500);
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      toast.error('Erreur lors du téléchargement de l\'image');
      setUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const item: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'> = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        original_price: data.original_price ? parseFloat(data.original_price) : undefined,
        stock: parseInt(data.stock, 10),
        image_url: data.image_url || '/placeholder.svg',
        status: data.status as ShopItemStatus || 'available',
        clothes_id: data.clothes_id || '',
        shop_id: shop.id,
      };

      await createShopItem.mutateAsync({
        shopId: shop.id,
        item
      });

      toast.success('Article ajouté avec succès');
      reset();
      setImageUrl('');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'article:', error);
      toast.error('Erreur lors de l\'ajout de l\'article. Veuillez réessayer.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Nom de l'article *</label>
          <Input
            id="name"
            type="text"
            {...register('name', { required: 'Le nom est requis' })}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message as string}</p>}
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1">Prix *</label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            {...register('price', { required: 'Le prix est requis' })}
          />
          {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message as string}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="original_price" className="block text-sm font-medium mb-1">Prix d'origine</label>
          <Input
            id="original_price"
            type="number"
            step="0.01"
            min="0"
            {...register('original_price')}
          />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium mb-1">Stock *</label>
          <Input
            id="stock"
            type="number"
            min="0"
            {...register('stock', { required: 'Le stock est requis' })}
          />
          {errors.stock && <p className="text-sm text-red-500 mt-1">{errors.stock.message as string}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1">Statut</label>
        <Select defaultValue="available" onValueChange={(value) => setValue('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="sold_out">Épuisé</SelectItem>
            <SelectItem value="archived">Archivé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          id="description"
          rows={4}
          {...register('description')}
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium mb-1">Image</label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
        />
        <input type="hidden" {...register('image_url')} value={imageUrl} />
        {imageUrl && (
          <div className="mt-2">
            <img src={imageUrl} alt="Aperçu" className="w-32 h-32 object-cover rounded-md" />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting || createShopItem.isPending || uploading}
        >
          {isSubmitting || createShopItem.isPending ? 'En cours...' : 'Ajouter l\'article'}
        </Button>
      </div>
    </form>
  );
};
