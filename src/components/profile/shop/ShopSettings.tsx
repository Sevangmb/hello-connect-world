
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useShop } from '@/hooks/useShop';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { DeliveryOption, PaymentMethod, ShopSettings as ShopSettingsType } from '@/core/shop/domain/types';

interface ShopSettingsProps {
  shopId: string;
}

export function ShopSettings({ shopId }: ShopSettingsProps) {
  const { user } = useAuth();
  const { getShopSettings, updateShopSettings } = useShop();
  const { data: settingsData, isLoading } = getShopSettings(shopId);
  
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  
  useEffect(() => {
    if (settingsData) {
      setDeliveryOptions(settingsData.delivery_options || []);
      setPaymentMethods(settingsData.payment_methods || []);
      setAutoAcceptOrders(settingsData.auto_accept_orders || false);
      
      const notifPrefs = settingsData.notification_preferences || { 
        email: true, 
        app: true 
      };
      
      setNotificationsEnabled(notifPrefs.email || notifPrefs.app);
      setEmailNotifications(notifPrefs.email || false);
      setAppNotifications(notifPrefs.app || false);
    }
  }, [settingsData]);
  
  const handleDeliveryOptionToggle = (option: DeliveryOption) => {
    setDeliveryOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(o => o !== option);
      } else {
        return [...prev, option];
      }
    });
  };
  
  const handlePaymentMethodToggle = (method: PaymentMethod) => {
    setPaymentMethods(prev => {
      if (prev.includes(method)) {
        return prev.filter(m => m !== method);
      } else {
        return [...prev, method];
      }
    });
  };
  
  const handleSaveSettings = async () => {
    try {
      await updateShopSettings.mutate({
        shopId,
        data: {
          delivery_options: deliveryOptions,
          payment_methods: paymentMethods,
          auto_accept_orders: autoAcceptOrders,
          notification_preferences: {
            email: emailNotifications,
            app: appNotifications
          }
        }
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des paramètres",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div>Chargement des paramètres...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Options de livraison</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="delivery-pickup"
              checked={deliveryOptions.includes('pickup')}
              onCheckedChange={() => handleDeliveryOptionToggle('pickup')}
            />
            <Label htmlFor="delivery-pickup">Retrait en personne</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="delivery-delivery"
              checked={deliveryOptions.includes('delivery')}
              onCheckedChange={() => handleDeliveryOptionToggle('delivery')}
            />
            <Label htmlFor="delivery-delivery">Livraison</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="delivery-both"
              checked={deliveryOptions.includes('both')}
              onCheckedChange={() => handleDeliveryOptionToggle('both')}
            />
            <Label htmlFor="delivery-both">Les deux options</Label>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Méthodes de paiement</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="payment-card"
              checked={paymentMethods.includes('card')}
              onCheckedChange={() => handlePaymentMethodToggle('card')}
            />
            <Label htmlFor="payment-card">Carte bancaire</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="payment-paypal"
              checked={paymentMethods.includes('paypal')}
              onCheckedChange={() => handlePaymentMethodToggle('paypal')}
            />
            <Label htmlFor="payment-paypal">PayPal</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="payment-bank"
              checked={paymentMethods.includes('bank_transfer')}
              onCheckedChange={() => handlePaymentMethodToggle('bank_transfer')}
            />
            <Label htmlFor="payment-bank">Virement bancaire</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="payment-cash"
              checked={paymentMethods.includes('cash')}
              onCheckedChange={() => handlePaymentMethodToggle('cash')}
            />
            <Label htmlFor="payment-cash">Espèces (en personne)</Label>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Paramètres des commandes</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="auto-accept"
              checked={autoAcceptOrders}
              onCheckedChange={setAutoAcceptOrders}
            />
            <Label htmlFor="auto-accept">Accepter automatiquement les commandes</Label>
          </div>
          
          <p className="text-sm text-gray-500">
            Si activé, les commandes seront automatiquement acceptées. Sinon, vous devrez les accepter manuellement.
          </p>
        </div>
        
        <Separator className="my-4" />
        
        <h3 className="text-lg font-medium mb-4">Notifications</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="notifications-enabled"
              checked={notificationsEnabled}
              onCheckedChange={(checked) => {
                setNotificationsEnabled(checked);
                if (checked) {
                  setEmailNotifications(true);
                  setAppNotifications(true);
                } else {
                  setEmailNotifications(false);
                  setAppNotifications(false);
                }
              }}
            />
            <Label htmlFor="notifications-enabled">Activer les notifications</Label>
          </div>
          
          {notificationsEnabled && (
            <>
              <div className="flex items-center space-x-2 ml-6">
                <Switch 
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
                <Label htmlFor="email-notifications">Notifications par email</Label>
              </div>
              
              <div className="flex items-center space-x-2 ml-6">
                <Switch 
                  id="app-notifications"
                  checked={appNotifications}
                  onCheckedChange={setAppNotifications}
                />
                <Label htmlFor="app-notifications">Notifications dans l'application</Label>
              </div>
            </>
          )}
        </div>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          disabled={updateShopSettings.isPending}
        >
          {updateShopSettings.isPending ? "Enregistrement..." : "Enregistrer les paramètres"}
        </Button>
      </div>
    </div>
  );
}
