
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useShop } from '@/hooks/useShop';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShopItemStatus } from '@/core/shop/domain/types';

interface AddItemFormProps {
  shopId: string;
  onSuccess?: () => void;
}

export const AddItemForm = ({ shopId, onSuccess }: AddItemFormProps) => {
  const { useCreateShopItem } = useShop();
  const createShopItem = useCreateShopItem();
  const [imageUrl, setImageUrl] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock: '1',
    }
  });
  
  const onSubmit = (data: any) => {
    // Create the shop item without 'id' property
    createShopItem.mutate({
      shop_id: shopId,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      image_url: imageUrl,
      status: 'available' as ShopItemStatus
    }, {
      onSuccess: () => {
        reset();
        setImageUrl('');
        if (onSuccess) onSuccess();
      }
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter un article</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name">Nom de l'article</label>
            <Input 
              id="name" 
              {...register('name', { required: 'Le nom est requis' })} 
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          
          <div>
            <label htmlFor="description">Description</label>
            <Textarea 
              id="description" 
              {...register('description')} 
            />
          </div>
          
          <div>
            <label htmlFor="price">Prix</label>
            <Input 
              id="price" 
              type="number" 
              step="0.01" 
              {...register('price', { required: 'Le prix est requis' })} 
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>
          
          <div>
            <label htmlFor="stock">Stock</label>
            <Input 
              id="stock" 
              type="number" 
              {...register('stock', { required: 'Le stock est requis' })} 
            />
            {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
          </div>
          
          <div>
            <label htmlFor="image">Image URL</label>
            <Input 
              id="image" 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={createShopItem.isPending}
          >
            {createShopItem.isPending ? 'Ajout en cours...' : 'Ajouter l\'article'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
