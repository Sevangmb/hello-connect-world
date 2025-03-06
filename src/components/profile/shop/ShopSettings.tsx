import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useShop } from '@/hooks/useShop';
import { ShopSettings as ShopSettingsType, DeliveryOption, PaymentMethod } from '@/core/shop/domain/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save } from 'lucide-react';

interface ShopSettingsProps {
  shopId: string;
}

export const ShopSettings = ({ shopId }: ShopSettingsProps) => {
  const { useShopById, useUpdateShopSettings } = useShop();
  const { data: shop, isLoading } = useShopById(shopId);
  const { toast } = useToast();
  const updateSettings = useUpdateShopSettings();
  
  const [settings, setSettings] = useState<Partial<ShopSettingsType>>({
    delivery_options: ['pickup'],
    payment_methods: ['card'],
    auto_accept_orders: true,
    notification_preferences: {
      email: true,
      app: true,
    },
  });
  
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (shop?.settings) {
      setSettings(shop.settings);
    }
  }, [shop]);

  const handleDeliveryOptionChange = (option: DeliveryOption) => {
    setSettings(prev => {
      const currentOptions = prev.delivery_options || [];
      if (currentOptions.includes(option)) {
        return {
          ...prev,
          delivery_options: currentOptions.filter(opt => opt !== option),
        };
      } else {
        return {
          ...prev,
          delivery_options: [...currentOptions, option],
        };
      }
    });
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setSettings(prev => {
      const currentMethods = prev.payment_methods || [];
      if (currentMethods.includes(method)) {
        return {
          ...prev,
          payment_methods: currentMethods.filter(m => m !== method),
        };
      } else {
        return {
          ...prev,
          payment_methods: [...currentMethods, method],
        };
      }
    });
  };

  const handleAutoAcceptChange = (checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      auto_accept_orders: checked,
    }));
  };

  const handleNotificationChange = (type: 'email' | 'app', checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [type]: checked,
      },
    }));
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings.mutateAsync({
        shopId,
        settingsData: settings,
      });
      
      toast({
        title: "Paramètres enregistrés",
        description: "Les paramètres de votre boutique ont été mis à jour avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des paramètres:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des paramètres.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de la boutique</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : shop ? (
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="delivery">Livraison</TabsTrigger>
                <TabsTrigger value="payment">Paiement</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="auto-accept" 
                      checked={settings.auto_accept_orders}
                      onCheckedChange={handleAutoAcceptChange}
                    />
                    <Label htmlFor="auto-accept">Accepter automatiquement les commandes</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Si activé, les commandes seront automatiquement acceptées sans votre intervention.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="delivery" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Options de livraison</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="pickup" 
                        checked={settings.delivery_options?.includes('pickup')}
                        onCheckedChange={() => handleDeliveryOptionChange('pickup')}
                      />
                      <Label htmlFor="pickup">Retrait en boutique</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="delivery" 
                        checked={settings.delivery_options?.includes('delivery')}
                        onCheckedChange={() => handleDeliveryOptionChange('delivery')}
                      />
                      <Label htmlFor="delivery">Livraison à domicile</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="both" 
                        checked={settings.delivery_options?.includes('both')}
                        onCheckedChange={() => handleDeliveryOptionChange('both')}
                      />
                      <Label htmlFor="both">Les deux options</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="payment" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Méthodes de paiement acceptées</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="card" 
                        checked={settings.payment_methods?.includes('card')}
                        onCheckedChange={() => handlePaymentMethodChange('card')}
                      />
                      <Label htmlFor="card">Carte bancaire</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="paypal" 
                        checked={settings.payment_methods?.includes('paypal')}
                        onCheckedChange={() => handlePaymentMethodChange('paypal')}
                      />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="bank_transfer" 
                        checked={settings.payment_methods?.includes('bank_transfer')}
                        onCheckedChange={() => handlePaymentMethodChange('bank_transfer')}
                      />
                      <Label htmlFor="bank_transfer">Virement bancaire</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="cash" 
                        checked={settings.payment_methods?.includes('cash')}
                        onCheckedChange={() => handlePaymentMethodChange('cash')}
                      />
                      <Label htmlFor="cash">Espèces (à la livraison)</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Préférences de notification</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="email-notif" 
                        checked={settings.notification_preferences?.email}
                        onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                      />
                      <Label htmlFor="email-notif">Notifications par email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="app-notif" 
                        checked={settings.notification_preferences?.app}
                        onCheckedChange={(checked) => handleNotificationChange('app', checked)}
                      />
                      <Label htmlFor="app-notif">Notifications dans l'application</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveSettings}
                disabled={updateSettings.isPending}
              >
                {updateSettings.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <p>Impossible de charger les paramètres de la boutique.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ShopSettings;
