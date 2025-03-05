
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ui/image-upload';
import { useShop } from '@/hooks/useShop';
import { Shop } from '@/core/shop/domain/types';

interface ShopSettingsProps {
  shop: Shop | null;
  onUpdate?: () => void;
}

const ShopSettings: React.FC<ShopSettingsProps> = ({ shop, onUpdate }) => {
  const { updateShop } = useShop();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [imageUrl, setImageUrl] = useState(shop?.image_url || '');
  const [isUploading, setIsUploading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: shop?.name || '',
      description: shop?.description || '',
      address: shop?.address || '',
      phone: shop?.phone || '',
      website: shop?.website || '',
    }
  });

  const onSubmit = async (formData: any) => {
    if (!shop) return;
    
    setIsUpdating(true);
    try {
      const updatedShopData = {
        ...formData,
        image_url: imageUrl
      };
      
      await updateShop({
        id: shop.id,
        data: updatedShopData
      });
      
      toast({
        title: "Boutique mise à jour",
        description: "Les informations de votre boutique ont été mises à jour avec succès.",
      });
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating shop:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour de votre boutique.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = (url: string) => {
    setImageUrl(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="image">Image de la boutique</Label>
              <div className="mt-2">
                <ImageUpload 
                  onChange={handleImageChange}
                  onUploading={setIsUploading}
                  currentImageUrl={imageUrl}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="name">Nom de la boutique</Label>
              <Input
                id="name"
                {...register('name', { required: "Le nom est requis" })}
                className="mt-1"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message?.toString()}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                className="mt-1"
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                {...register('address')}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                {...register('phone')}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="website">Site Web</Label>
              <Input
                id="website"
                {...register('website')}
                className="mt-1"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isUpdating || isUploading}
              className="w-full"
            >
              {isUpdating ? "Mise à jour..." : "Enregistrer les modifications"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres de paiement et livraison</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Les paramètres de paiement et de livraison seront disponibles prochainement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopSettings;
