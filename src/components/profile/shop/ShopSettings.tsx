
import React, { useState, useEffect } from 'react';
import { useShop } from '@/hooks/useShop';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ShopSettings as ShopSettingsType, DeliveryOption, PaymentMethod } from '@/core/shop/domain/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export const ShopSettings: React.FC = () => {
  const { shop, shopService } = useShop();
  
  const { data: settings, isLoading } = useQuery({
    queryKey: ['shop-settings', shop?.id],
    queryFn: () => shopService.getShopSettings(shop?.id || ''),
    enabled: !!shop?.id
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: Partial<ShopSettingsType>) => 
      shopService.updateShopSettings(shop?.id || '', newSettings),
    onSuccess: () => {
      toast.success('Paramètres mis à jour avec succès');
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour des paramètres: ${error}`);
    }
  });

  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);

  useEffect(() => {
    if (settings) {
      setDeliveryOptions(settings.delivery_options || []);
      setPaymentMethods(settings.payment_methods || []);
      setAutoAcceptOrders(settings.auto_accept_orders || false);
      setEmailNotifications(settings.notification_preferences?.email || true);
      setAppNotifications(settings.notification_preferences?.app || true);
    }
  }, [settings]);

  const handleDeliveryOptionToggle = (option: DeliveryOption) => {
    setDeliveryOptions(prev => 
      prev.includes(option) 
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const handlePaymentMethodToggle = (method: PaymentMethod) => {
    setPaymentMethods(prev => 
      prev.includes(method) 
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  const handleSaveSettings = () => {
    const newSettings: Partial<ShopSettingsType> = {
      delivery_options: deliveryOptions,
      payment_methods: paymentMethods,
      auto_accept_orders: autoAcceptOrders,
      notification_preferences: {
        email: emailNotifications,
        app: appNotifications
      }
    };
    updateSettingsMutation.mutate(newSettings);
  };

  if (isLoading) {
    return <SettingsLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Paramètres de la boutique</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Options de livraison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={deliveryOptions.includes('pickup')}
              onCheckedChange={() => handleDeliveryOptionToggle('pickup')}
            />
            <span>Retrait en boutique</span>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={deliveryOptions.includes('delivery')}
              onCheckedChange={() => handleDeliveryOptionToggle('delivery')}
            />
            <span>Livraison à domicile</span>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={deliveryOptions.includes('both')}
              onCheckedChange={() => handleDeliveryOptionToggle('both')}
            />
            <span>Les deux options</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Méthodes de paiement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={paymentMethods.includes('card')}
              onCheckedChange={() => handlePaymentMethodToggle('card')}
            />
            <span>Carte bancaire</span>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={paymentMethods.includes('paypal')}
              onCheckedChange={() => handlePaymentMethodToggle('paypal')}
            />
            <span>PayPal</span>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={paymentMethods.includes('bank_transfer')}
              onCheckedChange={() => handlePaymentMethodToggle('bank_transfer')}
            />
            <span>Virement bancaire</span>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={paymentMethods.includes('cash')}
              onCheckedChange={() => handlePaymentMethodToggle('cash')}
            />
            <span>Espèces (uniquement pour le retrait)</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des commandes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={autoAcceptOrders}
              onCheckedChange={(checked) => setAutoAcceptOrders(checked)}
            />
            <span>Accepter automatiquement les commandes</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={emailNotifications}
              onCheckedChange={(checked) => setEmailNotifications(checked)}
            />
            <span>Notifications par email</span>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={appNotifications}
              onCheckedChange={(checked) => setAppNotifications(checked)}
            />
            <span>Notifications dans l'application</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          disabled={updateSettingsMutation.isPending}
        >
          {updateSettingsMutation.isPending ? 'Enregistrement...' : 'Enregistrer les paramètres'}
        </Button>
      </div>
    </div>
  );
};

const SettingsLoadingSkeleton: React.FC = () => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-48" />
    
    {[1, 2, 3, 4].map(i => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map(j => (
            <div key={j} className="flex items-center space-x-2">
              <Skeleton className="h-5 w-10 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </CardContent>
      </Card>
    ))}
    
    <div className="flex justify-end">
      <Skeleton className="h-10 w-40" />
    </div>
  </div>
);
