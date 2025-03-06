
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useShop } from '@/hooks/useShop';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Shop, DeliveryOption, PaymentMethod } from '@/core/shop/domain/types';
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { Checkbox } from '@/components/ui/checkbox';

const ShopSettings: React.FC<{ shop: Shop }> = ({ shop }) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    defaultValues: {
      name: shop.name,
      description: shop.description || '',
      address: shop.address || '',
      phone: shop.phone || '',
      website: shop.website || '',
      payment_methods: [],
      delivery_options: [],
      categories: shop.categories || []
    }
  });

  const { useUpdateShop } = useShop();
  const updateShopMutation = useUpdateShop();

  // Préparer les catégories pour l'affichage
  const formattedCategories = typeof shop.categories === 'string' 
    ? shop.categories 
    : Array.isArray(shop.categories) 
      ? shop.categories.join(', ') 
      : '';

  const onSubmit = async (data: any) => {
    try {
      // Préparer les données pour la mise à jour
      const updateData = {
        name: data.name,
        description: data.description,
        address: data.address,
        phone: data.phone,
        website: data.website,
        // Convertir les catégories de chaîne séparée par des virgules en tableau
        categories: data.categories.split(',').map((cat: string) => cat.trim())
      };

      await updateShopMutation.mutateAsync({
        id: shop.id,
        shop: updateData
      });

      toast.success('Paramètres de la boutique mis à jour');
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['shop', shop.id] });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la boutique:', error);
      toast.error('Erreur lors de la mise à jour. Veuillez réessayer.');
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Paramètres de la boutique</span>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Modifier</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>Annuler</Button>
              <Button onClick={handleSubmit(onSubmit)}>Enregistrer</Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">Nom</label>
              <Input
                id="name"
                disabled={!isEditing}
                {...register('name', { required: 'Le nom est requis' })}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message as string}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium">Adresse</label>
              <Input
                id="address"
                disabled={!isEditing}
                {...register('address')}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium">Téléphone</label>
              <Input
                id="phone"
                disabled={!isEditing}
                {...register('phone')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="website" className="block text-sm font-medium">Site web</label>
              <Input
                id="website"
                disabled={!isEditing}
                {...register('website')}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">Description</label>
            <Textarea
              id="description"
              disabled={!isEditing}
              {...register('description')}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="categories" className="block text-sm font-medium">Catégories (séparées par des virgules)</label>
            <Input
              id="categories"
              disabled={!isEditing}
              {...register('categories')}
              defaultValue={formattedCategories}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ShopSettings;
