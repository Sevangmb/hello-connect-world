
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useShop } from '@/hooks/useShop';
import { ImageUpload } from '@/components/ui/image-upload';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethod, DeliveryOption } from '@/core/shop/domain/types';

interface ShopSettingsProps {
  shopId: string;
}

export function ShopSettings({ shopId }: ShopSettingsProps) {
  const { shop, isShopLoading, updateShopInfo } = useShop(shopId);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedDeliveryOptions, setSelectedDeliveryOptions] = useState<DeliveryOption[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      image_url: '',
      address: '',
      phone: '',
      website: '',
      auto_accept_orders: false,
    }
  });

  const imageUrl = watch('image_url');

  // Load shop data when available
  useEffect(() => {
    if (shop) {
      reset({
        name: shop.name,
        description: shop.description || '',
        image_url: shop.image_url || '',
        address: shop.address || '',
        phone: shop.phone || '',
        website: shop.website || '',
        auto_accept_orders: false, // This would come from shop settings
      });
    }
  }, [shop, reset]);

  const onSubmit = async (data: any) => {
    if (!shop) return;
    
    try {
      await updateShopInfo.mutateAsync({
        id: shop.id,
        name: data.name,
        description: data.description,
        image_url: data.image_url,
        address: data.address,
        phone: data.phone,
        website: data.website,
      });
      
      toast({
        title: 'Paramètres mis à jour',
        description: 'Les paramètres de votre boutique ont été mis à jour avec succès.',
      });
    } catch (error) {
      console.error('Error updating shop settings:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour les paramètres. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  };

  if (isShopLoading || !shop) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de la boutique</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Image de la boutique</label>
            <ImageUpload 
              onChange={(url) => setValue('image_url', url)} 
              onUploading={setIsUploading}
              value={imageUrl}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nom de la boutique *</Label>
            <Input
              id="name"
              {...register('name', { required: 'Le nom est requis' })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                {...register('address')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                {...register('phone')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                {...register('website')}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Options de paiement et livraison</h3>
            
            <div className="space-y-2">
              <Label>Méthodes de paiement acceptées</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="payment_card"
                    checked={selectedPaymentMethods.includes('card')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPaymentMethods([...selectedPaymentMethods, 'card']);
                      } else {
                        setSelectedPaymentMethods(selectedPaymentMethods.filter(m => m !== 'card'));
                      }
                    }}
                  />
                  <Label htmlFor="payment_card">Carte bancaire</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="payment_paypal"
                    checked={selectedPaymentMethods.includes('paypal')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPaymentMethods([...selectedPaymentMethods, 'paypal']);
                      } else {
                        setSelectedPaymentMethods(selectedPaymentMethods.filter(m => m !== 'paypal'));
                      }
                    }}
                  />
                  <Label htmlFor="payment_paypal">PayPal</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="payment_transfer"
                    checked={selectedPaymentMethods.includes('bank_transfer')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPaymentMethods([...selectedPaymentMethods, 'bank_transfer']);
                      } else {
                        setSelectedPaymentMethods(selectedPaymentMethods.filter(m => m !== 'bank_transfer'));
                      }
                    }}
                  />
                  <Label htmlFor="payment_transfer">Virement bancaire</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="payment_cash"
                    checked={selectedPaymentMethods.includes('cash')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPaymentMethods([...selectedPaymentMethods, 'cash']);
                      } else {
                        setSelectedPaymentMethods(selectedPaymentMethods.filter(m => m !== 'cash'));
                      }
                    }}
                  />
                  <Label htmlFor="payment_cash">Espèces (en personne)</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Options de livraison</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="delivery_pickup"
                    checked={selectedDeliveryOptions.includes('pickup')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedDeliveryOptions([...selectedDeliveryOptions, 'pickup']);
                      } else {
                        setSelectedDeliveryOptions(selectedDeliveryOptions.filter(o => o !== 'pickup'));
                      }
                    }}
                  />
                  <Label htmlFor="delivery_pickup">Retrait en boutique</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="delivery_delivery"
                    checked={selectedDeliveryOptions.includes('delivery')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedDeliveryOptions([...selectedDeliveryOptions, 'delivery']);
                      } else {
                        setSelectedDeliveryOptions(selectedDeliveryOptions.filter(o => o !== 'delivery'));
                      }
                    }}
                  />
                  <Label htmlFor="delivery_delivery">Livraison</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="auto_accept_orders"
                  {...register('auto_accept_orders')}
                />
                <Label htmlFor="auto_accept_orders">Accepter automatiquement les commandes</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Si cette option est activée, les commandes seront automatiquement acceptées sans nécessiter votre confirmation.
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mise à jour...
              </>
            ) : (
              'Enregistrer les modifications'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
