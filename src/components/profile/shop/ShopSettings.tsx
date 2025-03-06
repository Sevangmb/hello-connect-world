
import React, { useState, useEffect } from 'react';
import { useShop } from '@/hooks/useShop';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DeliveryOption, PaymentMethod, ShopSettings as ShopSettingsType } from '@/core/shop/domain/types';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

export const ShopSettings = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const { useShopById, useUpdateShopSettings, useGetShopSettings } = useShop();
  const { data: shop, isLoading: isShopLoading } = useShopById(shopId);
  const { data: settings, isLoading: isSettingsLoading } = useGetShopSettings(shopId);
  const updateSettings = useUpdateShopSettings();
  
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  
  useEffect(() => {
    if (settings) {
      setDeliveryOptions(settings.delivery_options || []);
      setPaymentMethods(settings.payment_methods || []);
      setAutoAcceptOrders(settings.auto_accept_orders);
      setEmailNotifications(settings.notification_preferences?.email || true);
      setAppNotifications(settings.notification_preferences?.app || true);
    }
  }, [settings]);
  
  const handleSaveSettings = async () => {
    if (!shopId) return;
    
    const updatedSettings: Partial<ShopSettingsType> = {
      delivery_options: deliveryOptions,
      payment_methods: paymentMethods,
      auto_accept_orders: autoAcceptOrders,
      notification_preferences: {
        email: emailNotifications,
        app: appNotifications
      }
    };
    
    try {
      await updateSettings.mutateAsync({ 
        shopId, 
        settingsData: updatedSettings 
      });
      toast.success("Paramètres de la boutique mis à jour");
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres:", error);
      toast.error("Erreur lors de la mise à jour des paramètres");
    }
  };
  
  const toggleDeliveryOption = (option: DeliveryOption) => {
    if (deliveryOptions.includes(option)) {
      setDeliveryOptions(deliveryOptions.filter(o => o !== option));
    } else {
      setDeliveryOptions([...deliveryOptions, option]);
    }
  };
  
  const togglePaymentMethod = (method: PaymentMethod) => {
    if (paymentMethods.includes(method)) {
      setPaymentMethods(paymentMethods.filter(m => m !== method));
    } else {
      setPaymentMethods([...paymentMethods, method]);
    }
  };
  
  if (isShopLoading || isSettingsLoading) {
    return <div className="flex justify-center p-8">Chargement des paramètres...</div>;
  }
  
  if (!shop) {
    return <div className="text-center p-8">Boutique non trouvée</div>;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Options de livraison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Retrait en boutique</span>
            <Switch 
              checked={deliveryOptions.includes('pickup')}
              onCheckedChange={() => toggleDeliveryOption('pickup')}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Livraison à domicile</span>
            <Switch 
              checked={deliveryOptions.includes('delivery')}
              onCheckedChange={() => toggleDeliveryOption('delivery')}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Les deux options</span>
            <Switch 
              checked={deliveryOptions.includes('both')}
              onCheckedChange={() => toggleDeliveryOption('both')}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Méthodes de paiement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Carte bancaire</span>
            <Switch 
              checked={paymentMethods.includes('card')}
              onCheckedChange={() => togglePaymentMethod('card')}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>PayPal</span>
            <Switch 
              checked={paymentMethods.includes('paypal')}
              onCheckedChange={() => togglePaymentMethod('paypal')}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Virement bancaire</span>
            <Switch 
              checked={paymentMethods.includes('bank_transfer')}
              onCheckedChange={() => togglePaymentMethod('bank_transfer')}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Espèces (à la livraison)</span>
            <Switch 
              checked={paymentMethods.includes('cash')}
              onCheckedChange={() => togglePaymentMethod('cash')}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Paramètres des commandes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Acceptation automatique des commandes</span>
            <Switch 
              checked={autoAcceptOrders}
              onCheckedChange={setAutoAcceptOrders}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Notifications par email</span>
            <Switch 
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Notifications dans l'application</span>
            <Switch 
              checked={appNotifications}
              onCheckedChange={setAppNotifications}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          disabled={updateSettings.isPending}
        >
          {updateSettings.isPending ? "Enregistrement..." : "Enregistrer les paramètres"}
        </Button>
      </div>
    </div>
  );
};
