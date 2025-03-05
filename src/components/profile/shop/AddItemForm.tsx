
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useShop } from '@/hooks/useShop';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ui/image-upload';
import { Loader2 } from 'lucide-react';

interface AddItemFormProps {
  shopId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AddItemForm({ shopId, onSuccess, onCancel }: AddItemFormProps) {
  const { createShopItem } = useShop(shopId);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock: '1',
      image_url: '',
    }
  });

  const imageUrl = watch('image_url');

  const onSubmit = async (data: { name: string; description: string; price: string; stock: string; image_url: string }) => {
    try {
      await createShopItem.mutateAsync({
        shop_id: shopId,
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        image_url: data.image_url || undefined,
        status: 'available',
      });

      reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter l\'article. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Ajouter un nouvel article</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Image de l'article</label>
          <ImageUpload 
            onChange={(url) => setValue('image_url', url)} 
            onUploading={setIsUploading}
            value={imageUrl}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Nom de l'article *
          </label>
          <Input
            id="name"
            {...register('name', { required: 'Le nom est requis' })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            rows={3}
            {...register('description')}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium">
              Prix *
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              {...register('price', { 
                required: 'Le prix est requis',
                min: { value: 0, message: 'Le prix doit être positif' } 
              })}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="stock" className="block text-sm font-medium">
              Stock
            </label>
            <Input
              id="stock"
              type="number"
              min="1"
              step="1"
              {...register('stock', { 
                required: 'La quantité est requise',
                min: { value: 1, message: 'Le stock minimum est de 1' } 
              })}
            />
            {errors.stock && (
              <p className="text-sm text-red-500">{errors.stock.message}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          
          <Button 
            type="submit" 
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ajout en cours...
              </>
            ) : (
              'Ajouter l\'article'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
