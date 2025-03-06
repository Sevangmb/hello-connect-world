import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ShopSettings as ShopSettingsType, PaymentMethod, DeliveryOption } from "@/core/shop/domain/types";
import { useShopById, useUpdateShopSettings } from "@/hooks/useShop";
import { supabase } from "@/integrations/supabase/client";

interface ShopSettingsProps {
  shopId: string;
}

export function ShopSettings({ shopId }: ShopSettingsProps) {
  const { toast } = useToast();
  const shopById = useShopById();
  const updateShopSettings = useUpdateShopSettings();
  
  const [settings, setSettings] = useState<Partial<ShopSettingsType>>({
    delivery_options: [],
    payment_methods: [],
    auto_accept_orders: false,
    notification_preferences: {
      email: true,
      app: true
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First get the shop to ensure it exists
        const shop = await shopById.fetchShop(shopId);
        
        // Then fetch shop settings from the database
        const { data, error } = await supabase
          .from('shop_settings')
          .select('*')
          .eq('shop_id', shopId)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            // Settings don't exist yet, use defaults
            return;
          }
          throw error;
        }
        
        // Convert string arrays to the correct types
        setSettings({
          ...data,
          delivery_options: data.delivery_options as DeliveryOption[],
          payment_methods: data.payment_methods as PaymentMethod[],
          notification_preferences: typeof data.notification_preferences === 'string'
            ? JSON.parse(data.notification_preferences)
            : data.notification_preferences
        });
      } catch (error) {
        console.error("Error fetching shop settings:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les paramètres de la boutique",
          variant: "destructive"
        });
      }
    };
    
    fetchData();
  }, [shopId]);

  const handleSave = async () => {
    try {
      await updateShopSettings.updateSettings(shopId, settings);
      
      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres de votre boutique ont été mis à jour"
      });
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la sauvegarde des paramètres",
        variant: "destructive"
      });
    }
  };

  const handleDeliveryOptionToggle = (option: DeliveryOption) => {
    setSettings(prev => {
      const currentOptions = prev.delivery_options || [];
      const newOptions = currentOptions.includes(option)
        ? currentOptions.filter(o => o !== option)
        : [...currentOptions, option];
      
      return {
        ...prev,
        delivery_options: newOptions
      };
    });
  };

  const handlePaymentMethodToggle = (method: PaymentMethod) => {
    setSettings(prev => {
      const currentMethods = prev.payment_methods || [];
      const newMethods = currentMethods.includes(method)
        ? currentMethods.filter(m => m !== method)
        : [...currentMethods, method];
      
      return {
        ...prev,
        payment_methods: newMethods
      };
    });
  };

  if (shopById.loading) {
    return <div>Chargement des paramètres...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Options de livraison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="pickup">Retrait en magasin</Label>
            <Switch
              id="pickup"
              checked={settings.delivery_options?.includes('pickup')}
              onCheckedChange={() => handleDeliveryOptionToggle('pickup')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="delivery">Livraison</Label>
            <Switch
              id="delivery"
              checked={settings.delivery_options?.includes('delivery')}
              onCheckedChange={() => handleDeliveryOptionToggle('delivery')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="both">Les deux options</Label>
            <Switch
              id="both"
              checked={settings.delivery_options?.includes('both')}
              onCheckedChange={() => handleDeliveryOptionToggle('both')}
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
            <Label htmlFor="card">Carte bancaire</Label>
            <Switch
              id="card"
              checked={settings.payment_methods?.includes('card')}
              onCheckedChange={() => handlePaymentMethodToggle('card')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="paypal">PayPal</Label>
            <Switch
              id="paypal"
              checked={settings.payment_methods?.includes('paypal')}
              onCheckedChange={() => handlePaymentMethodToggle('paypal')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="bank_transfer">Virement bancaire</Label>
            <Switch
              id="bank_transfer"
              checked={settings.payment_methods?.includes('bank_transfer')}
              onCheckedChange={() => handlePaymentMethodToggle('bank_transfer')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="cash">Espèces</Label>
            <Switch
              id="cash"
              checked={settings.payment_methods?.includes('cash')}
              onCheckedChange={() => handlePaymentMethodToggle('cash')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commandes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto_accept">Acceptation automatique des commandes</Label>
              <p className="text-sm text-muted-foreground">
                Accepter automatiquement les commandes sans votre validation
              </p>
            </div>
            <Switch
              id="auto_accept"
              checked={settings.auto_accept_orders}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, auto_accept_orders: checked }))}
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
            <Label htmlFor="email_notif">Notifications par email</Label>
            <Switch
              id="email_notif"
              checked={settings.notification_preferences?.email}
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                notification_preferences: {
                  ...prev.notification_preferences,
                  email: checked
                }
              }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="app_notif">Notifications dans l'application</Label>
            <Switch
              id="app_notif"
              checked={settings.notification_preferences?.app}
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                notification_preferences: {
                  ...prev.notification_preferences,
                  app: checked
                }
              }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={updateShopSettings.updating}
        >
          {updateShopSettings.updating ? "Sauvegarde en cours..." : "Sauvegarder les paramètres"}
        </Button>
      </div>
    </div>
  );
}
