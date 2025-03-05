import React, { useState, useCallback } from 'react';
import { useQuery, useMutation } from 'react-query';
import { useToast } from '@/hooks/use-toast';
import { Shop, PaymentMethod, DeliveryOption, ShopSettings } from '@/core/shop/domain/types';
import { IShopRepository } from '@/core/shop/domain/interfaces/IShopRepository';
import { getShopRepository } from '@/core/shop/infrastructure/ShopServiceProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from "@/components/ui/image-upload";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ShopSettingsProps {
  shop: Shop;
  isShopLoading: boolean;
  refetchShop: () => Promise<any>;
  getShopSettings: (shopId: string) => Promise<ShopSettings | null>;
  createShopSettings: (shopId: string) => Promise<ShopSettings | null>;
  updateShopSettings: (shopId: string, settings: Partial<ShopSettings>) => Promise<ShopSettings | null>;
  getShopReviews: (shopId: string) => Promise<any[]>;
}

export const ShopSettings: React.FC<ShopSettingsProps> = ({
  shop,
  isShopLoading,
  refetchShop,
  getShopSettings,
  createShopSettings,
  updateShopSettings,
  getShopReviews,
}) => {
  const { toast } = useToast();
  const shopRepository: IShopRepository = getShopRepository();
  const [formData, setFormData] = useState({
    name: shop?.name || '',
    description: shop?.description || '',
  });
  const [imageUrl, setImageUrl] = useState(shop?.image_url || '');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedDeliveryOptions, setSelectedDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);
  const [notifyByEmail, setNotifyByEmail] = useState(true);
  const [notifyInApp, setNotifyInApp] = useState(true);

  // Load shop settings
  const { data: shopSettings, isLoading: isShopSettingsLoading } = useQuery(
    ['shopSettings', shop.id],
    () => getShopSettings(shop.id),
    {
      initialData: null,
      enabled: !!shop?.id,
      onSuccess: (settings) => {
        if (settings) {
          setSelectedPaymentMethods(settings.payment_methods || []);
          setSelectedDeliveryOptions(settings.delivery_options || []);
          setAutoAcceptOrders(settings.auto_accept_orders);
          setNotifyByEmail(settings.notification_preferences?.email ?? true);
          setNotifyInApp(settings.notification_preferences?.app ?? true);
        }
      },
    }
  );

  // Mutations
  const updateShopMutation = useMutation<Shop, Error, { id: string; name?: string; description?: string; image_url?: string; }>(
    async (shopData) => {
      if (!shop) throw new Error('Boutique non trouvée');
      return shopRepository.updateShop(shopData);
    },
    {
      onSuccess: async () => {
        toast({
          title: 'Boutique mise à jour',
          description: 'Les informations de votre boutique ont été mises à jour avec succès.',
        });
        await refetchShop();
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: `Impossible de mettre à jour la boutique: ${error.message}`,
        });
      },
    }
  );

  const updateSettingsMutation = useMutation<boolean, Error, { id: string; settings: Partial<ShopSettings>; }>(
    async ({ id, settings }) => {
      if (!shop) throw new Error('Boutique non trouvée');
      if (shopSettings) {
        await updateShopSettings(id, settings);
      } else {
        await createShopSettings(id);
        await updateShopSettings(id, settings);
      }
      return true;
    },
    {
      onSuccess: async () => {
        toast({
          title: 'Paramètres mis à jour',
          description: 'Les paramètres de votre boutique ont été mis à jour avec succès.',
        });
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: `Impossible de mettre à jour les paramètres: ${error.message}`,
        });
      },
    }
  );

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = useCallback((url: string) => {
    setImageUrl(url);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateShopMutation.mutate({
      id: shop.id,
      name: formData.name,
      description: formData.description,
      image_url: imageUrl
    });
  };

  const togglePaymentMethod = (method: string) => {
    setSelectedPaymentMethods(prev =>
      prev.includes(method as PaymentMethod)
        ? prev.filter(m => m !== method)
        : [...prev, method as PaymentMethod]
    );
  };

  const toggleDeliveryOption = (option: string) => {
    setSelectedDeliveryOptions(prev =>
      prev.includes(option as DeliveryOption)
        ? prev.filter(o => o !== option)
        : [...prev, option as DeliveryOption]
    );
  };

  const isPaymentMethodSelected = (method: string) => {
    return selectedPaymentMethods.includes(method as PaymentMethod);
  };

  const isDeliveryOptionSelected = (option: string) => {
    return selectedDeliveryOptions.includes(option as DeliveryOption);
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate({
      id: shop.id,
      settings: {
        payment_methods: selectedPaymentMethods,
        delivery_options: selectedDeliveryOptions,
        auto_accept_orders: autoAcceptOrders,
        notification_preferences: {
          email: notifyByEmail,
          app: notifyInApp
        }
      }
    });
  };

  if (isShopLoading) {
    return <div>Chargement...</div>;
  }

  if (!shop) {
    return <div>Boutique non trouvée.</div>;
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Informations de la boutique</CardTitle>
          <CardDescription>Mettez à jour les informations générales de votre boutique.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom de la boutique</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label>Image de la boutique</Label>
              <ImageUpload
                onChange={handleImageChange}
                defaultImage={imageUrl} // Changed from defaultValue
                onUploading={setIsUploading}
              />
            </div>
            <Button type="submit" disabled={updateShopMutation.isLoading}>
              {updateShopMutation.isLoading ? 'Mise à jour...' : 'Mettre à jour la boutique'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle>Paramètres de la boutique</CardTitle>
          <CardDescription>Configurez les paramètres de paiement, de livraison et de notification.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSettingsSubmit} className="space-y-4">
            <div>
              <Label>Méthodes de paiement</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={isPaymentMethodSelected("card" as PaymentMethod) ? 'secondary' : 'outline'}
                  onClick={() => togglePaymentMethod("card")}
                  type="button"
                >
                  Carte de crédit
                </Button>
                <Button
                  variant={isPaymentMethodSelected("paypal" as PaymentMethod) ? 'secondary' : 'outline'}
                  onClick={() => togglePaymentMethod("paypal")}
                  type="button"
                >
                  PayPal
                </Button>
                <Button
                  variant={isPaymentMethodSelected("bank_transfer" as PaymentMethod) ? 'secondary' : 'outline'}
                  onClick={() => togglePaymentMethod("bank_transfer")}
                  type="button"
                >
                  Virement bancaire
                </Button>
                <Button
                  variant={isPaymentMethodSelected("cash" as PaymentMethod) ? 'secondary' : 'outline'}
                  onClick={() => togglePaymentMethod("cash")}
                  type="button"
                >
                  Espèces
                </Button>
              </div>
            </div>

            <div>
              <Label>Options de livraison</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={isDeliveryOptionSelected("pickup" as DeliveryOption) ? 'secondary' : 'outline'}
                  onClick={() => toggleDeliveryOption("pickup")}
                  type="button"
                >
                  Retrait en magasin
                </Button>
                <Button
                  variant={isDeliveryOptionSelected("delivery" as DeliveryOption) ? 'secondary' : 'outline'}
                  onClick={() => toggleDeliveryOption("delivery")}
                  type="button"
                >
                  Livraison à domicile
                </Button>
                <Button
                  variant={isDeliveryOptionSelected("both" as DeliveryOption) ? 'secondary' : 'outline'}
                  onClick={() => toggleDeliveryOption("both")}
                  type="button"
                >
                  Les deux
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="autoAcceptOrders">Accepter automatiquement les commandes</Label>
              <Switch
                id="autoAcceptOrders"
                checked={autoAcceptOrders}
                onCheckedChange={(checked) => setAutoAcceptOrders(checked)}
              />
            </div>

            <div>
              <Label>Préférences de notification</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notifyByEmail"
                    checked={notifyByEmail}
                    onCheckedChange={(checked) => setNotifyByEmail(checked)}
                  />
                  <Label htmlFor="notifyByEmail">Par e-mail</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notifyInApp"
                    checked={notifyInApp}
                    onCheckedChange={(checked) => setNotifyInApp(checked)}
                  />
                  <Label htmlFor="notifyInApp">Dans l'application</Label>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={updateSettingsMutation.isLoading}>
              {updateSettingsMutation.isLoading ? 'Mise à jour...' : 'Mettre à jour les paramètres'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
