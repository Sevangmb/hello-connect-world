
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { toast } from 'sonner';

interface AddItemFormProps {
  shopId: string;
}

type FormValues = {
  name: string;
  description: string;
  price: string;
  stock: string;
  image_url: string;
};

const AddItemForm: React.FC<AddItemFormProps> = ({ shopId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const shopService = getShopService();
      
      await shopService.createShopItem({
        shop_id: shopId,
        status: 'available',
        description: data.description,
        name: data.name,
        image_url: data.image_url,
        price: parseFloat(data.price),
        stock: parseInt(data.stock, 10),
        id: '',
        created_at: '',
        updated_at: ''
      });
      
      toast.success('Article ajouté avec succès !');
      reset();
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error(`Erreur lors de l'ajout de l'article: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter un nouvel article</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de l'article</Label>
            <Input
              id="name"
              {...register('name', { required: 'Le nom est requis' })}
              placeholder="Ex: T-shirt blanc"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description', {
                required: 'La description est requise',
              })}
              placeholder="Décrivez votre article"
              rows={4}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Prix (€)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', {
                  required: 'Le prix est requis',
                  min: { value: 0.01, message: 'Le prix doit être supérieur à 0' },
                })}
                placeholder="29.99"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                {...register('stock', {
                  required: 'Le stock est requis',
                  min: { value: 1, message: 'Le stock doit être au moins de 1' },
                })}
                placeholder="10"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="image_url">URL de l'image</Label>
            <Input
              id="image_url"
              {...register('image_url')}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Ajout en cours...' : 'Ajouter l\'article'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddItemForm;
