
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DeliveryOption, PaymentMethod, ShopSettings as ShopSettingsType } from '@/core/shop/domain/types';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { shopService } from '@/core/shop/infrastructure/ShopServiceProvider';

interface ShopSettingsProps {
  shopId: string;
}

export function ShopSettings({ shopId }: ShopSettingsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<ShopSettingsType | null>(null);
  
  const deliveryOptions: DeliveryOption[] = ['pickup', 'delivery', 'both'];
  const paymentMethods: PaymentMethod[] = ['card', 'paypal', 'bank_transfer', 'cash'];
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        if (shopId) {
          const shopSettings = await shopService.getShopSettings(shopId);
          if (shopSettings) {
            setSettings(shopSettings);
          } else {
            // Create default settings
            setSettings({
              id: '',
              shop_id: shopId,
              delivery_options: ['pickup'],
              payment_methods: ['card'],
              auto_accept_orders: false,
              notification_preferences: {
                email: true,
                app: true,
              },
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }
        }
      } catch (error) {
        console.error('Error fetching shop settings:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les paramètres",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [shopId, toast]);
  
  const handleDeliveryOptionChange = (option: DeliveryOption, checked: boolean) => {
    if (!settings) return;
    
    setSettings(prev => {
      if (!prev) return prev;
      
      let updatedOptions: DeliveryOption[] = [...prev.delivery_options];
      
      if (checked) {
        if (!updatedOptions.includes(option)) {
          updatedOptions.push(option);
        }
      } else {
        updatedOptions = updatedOptions.filter(opt => opt !== option);
      }
      
      return {
        ...prev,
        delivery_options: updatedOptions,
      };
    });
  };
  
  const handlePaymentMethodChange = (method: PaymentMethod, checked: boolean) => {
    if (!settings) return;
    
    setSettings(prev => {
      if (!prev) return prev;
      
      let updatedMethods: PaymentMethod[] = [...prev.payment_methods];
      
      if (checked) {
        if (!updatedMethods.includes(method)) {
          updatedMethods.push(method);
        }
      } else {
        updatedMethods = updatedMethods.filter(m => m !== method);
      }
      
      return {
        ...prev,
        payment_methods: updatedMethods,
      };
    });
  };
  
  const handleAutoAcceptChange = (checked: boolean) => {
    if (!settings) return;
    
    setSettings(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        auto_accept_orders: checked,
      };
    });
  };
  
  const handleNotificationChange = (type: 'email' | 'app', checked: boolean) => {
    if (!settings) return;
    
    setSettings(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        notification_preferences: {
          ...prev.notification_preferences,
          [type]: checked,
        },
      };
    });
  };
  
  const saveSettings = async () => {
    if (!settings || !shopId) return;
    
    try {
      setSaving(true);
      
      const updatedSettings = {
        ...settings,
        updated_at: new Date().toISOString(),
      };
      
      await shopService.updateShopSettings(updatedSettings);
      
      toast({
        title: "Succès",
        description: "Paramètres enregistrés avec succès",
      });
    } catch (error) {
      console.error('Error saving shop settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return <div>Chargement des paramètres...</div>;
  }
  
  if (!settings) {
    return <div>Paramètres non disponibles</div>;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Options de livraison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {deliveryOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox 
                id={`delivery-${option}`}
                checked={settings.delivery_options.includes(option)}
                onCheckedChange={(checked) => handleDeliveryOptionChange(option, !!checked)}
              />
              <label 
                htmlFor={`delivery-${option}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option === 'pickup' ? 'Retrait en magasin' : 
                 option === 'delivery' ? 'Livraison' : 'Les deux'}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Méthodes de paiement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method} className="flex items-center space-x-2">
              <Checkbox 
                id={`payment-${method}`}
                checked={settings.payment_methods.includes(method)}
                onCheckedChange={(checked) => handlePaymentMethodChange(method, !!checked)}
              />
              <label 
                htmlFor={`payment-${method}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {method === 'card' ? 'Carte bancaire' : 
                 method === 'paypal' ? 'PayPal' : 
                 method === 'bank_transfer' ? 'Virement bancaire' : 'Espèces'}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Paramètres des commandes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Acceptation automatique des commandes</p>
              <p className="text-sm text-gray-500">Les commandes seront automatiquement acceptées</p>
            </div>
            <Switch 
              checked={settings.auto_accept_orders}
              onCheckedChange={handleAutoAcceptChange}
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
            <div>
              <p className="font-medium">Notifications par email</p>
              <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
            </div>
            <Switch 
              checked={settings.notification_preferences.email}
              onCheckedChange={(checked) => handleNotificationChange('email', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications dans l'application</p>
              <p className="text-sm text-gray-500">Recevoir des notifications dans l'application</p>
            </div>
            <Switch 
              checked={settings.notification_preferences.app}
              onCheckedChange={(checked) => handleNotificationChange('app', checked)}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
        </Button>
      </div>
    </div>
  );
}
