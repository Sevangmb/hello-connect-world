
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useShop } from '@/hooks/useShop';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { DeliveryOption, PaymentMethod, ShopSettings as ShopSettingsType } from '@/core/shop/domain/types';

interface ShopSettingsProps {
  shopId: string;
}

export function ShopSettings({ shopId }: ShopSettingsProps) {
  const { user } = useAuth();
  const { getShopSettings, updateShopSettings } = useShop();
  const [settings, setSettings] = useState<ShopSettingsType | null>(null);
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState(false);
  const [notificationApp, setNotificationApp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      if (shopId) {
        setIsLoading(true);
        try {
          const shopSettings = await getShopSettings(shopId);
          if (shopSettings) {
            setSettings(shopSettings);
            setDeliveryOptions(shopSettings.delivery_options || []);
            setPaymentMethods(shopSettings.payment_methods || []);
            setAutoAcceptOrders(shopSettings.auto_accept_orders || false);
            if (shopSettings.notification_preferences) {
              setNotificationEmail(shopSettings.notification_preferences.email || false);
              setNotificationApp(shopSettings.notification_preferences.app || false);
            }
          }
        } catch (error) {
          console.error('Error loading shop settings:', error);
          toast.error('Impossible de charger les paramètres');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadSettings();
  }, [shopId, getShopSettings]);

  const handleDeliveryOptionChange = (option: DeliveryOption) => {
    if (deliveryOptions.includes(option)) {
      setDeliveryOptions(deliveryOptions.filter(opt => opt !== option));
    } else {
      setDeliveryOptions([...deliveryOptions, option]);
    }
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    if (paymentMethods.includes(method)) {
      setPaymentMethods(paymentMethods.filter(m => m !== method));
    } else {
      setPaymentMethods([...paymentMethods, method]);
    }
  };

  const handleSubmit = async () => {
    if (!settings || !shopId) return;

    try {
      const updatedSettings = {
        ...settings,
        delivery_options: deliveryOptions,
        payment_methods: paymentMethods,
        auto_accept_orders: autoAcceptOrders,
        notification_preferences: {
          email: notificationEmail,
          app: notificationApp
        }
      };

      await updateShopSettings(shopId, updatedSettings);
      toast.success('Paramètres mis à jour avec succès');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Erreur lors de la mise à jour des paramètres');
    }
  };

  if (isLoading) {
    return <div>Chargement des paramètres...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Options de livraison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="delivery-pickup" 
              checked={deliveryOptions.includes('pickup')} 
              onCheckedChange={() => handleDeliveryOptionChange('pickup')} 
            />
            <Label htmlFor="delivery-pickup">Retrait en boutique</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="delivery-delivery" 
              checked={deliveryOptions.includes('delivery')} 
              onCheckedChange={() => handleDeliveryOptionChange('delivery')} 
            />
            <Label htmlFor="delivery-delivery">Livraison à domicile</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="delivery-both" 
              checked={deliveryOptions.includes('both')} 
              onCheckedChange={() => handleDeliveryOptionChange('both')} 
            />
            <Label htmlFor="delivery-both">Les deux options</Label>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Méthodes de paiement acceptées</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="payment-card" 
              checked={paymentMethods.includes('card')} 
              onCheckedChange={() => handlePaymentMethodChange('card')} 
            />
            <Label htmlFor="payment-card">Carte bancaire</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="payment-paypal" 
              checked={paymentMethods.includes('paypal')} 
              onCheckedChange={() => handlePaymentMethodChange('paypal')} 
            />
            <Label htmlFor="payment-paypal">PayPal</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="payment-bank-transfer" 
              checked={paymentMethods.includes('bank_transfer')} 
              onCheckedChange={() => handlePaymentMethodChange('bank_transfer')} 
            />
            <Label htmlFor="payment-bank-transfer">Virement bancaire</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="payment-cash" 
              checked={paymentMethods.includes('cash')} 
              onCheckedChange={() => handlePaymentMethodChange('cash')} 
            />
            <Label htmlFor="payment-cash">Espèces (uniquement pour le retrait en boutique)</Label>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Paramètres généraux</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-accept">Accepter automatiquement les commandes</Label>
            <Switch 
              id="auto-accept" 
              checked={autoAcceptOrders} 
              onCheckedChange={setAutoAcceptOrders} 
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Préférences de notification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notification-email">Notifications par email</Label>
            <Switch 
              id="notification-email" 
              checked={notificationEmail} 
              onCheckedChange={setNotificationEmail} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="notification-app">Notifications dans l'application</Label>
            <Switch 
              id="notification-app" 
              checked={notificationApp} 
              onCheckedChange={setNotificationApp} 
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleSubmit}>
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
}
