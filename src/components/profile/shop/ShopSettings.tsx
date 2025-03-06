
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useShop } from '@/hooks/useShop';
import { ShopSettings as ShopSettingsType } from '@/core/shop/domain/types';

interface ShopSettingsProps {
  shopId: string;
}

export const ShopSettings: React.FC<ShopSettingsProps> = ({ shopId }) => {
  const { useShopById, useUpdateShopSettings } = useShop();
  const { data: shop, isLoading } = useShopById(shopId);
  const updateShopSettingsMutation = useUpdateShopSettings();
  
  const [values, setValues] = useState({
    paymentMethods: [] as string[],
    autoAcceptOrders: false,
    emailNotifications: true,
    appNotifications: true
  });
  const { toast } = useToast();

  useEffect(() => {
    if (shop && shop.settings) {
      setValues({
        paymentMethods: shop.settings.payment_methods || [],
        autoAcceptOrders: shop.settings.auto_accept_orders || false,
        emailNotifications: shop.settings.notification_preferences?.email !== false,
        appNotifications: shop.settings.notification_preferences?.app !== false
      });
    }
  }, [shop]);

  const onSubmit = async () => {
    try {
      // Remove any shop properties that aren't allowed
      const shopSettings = {
        payment_methods: values.paymentMethods,
        auto_accept_orders: values.autoAcceptOrders,
        notification_preferences: {
          email: values.emailNotifications,
          app: values.appNotifications
        }
      };

      await updateShopSettingsMutation.mutateAsync({
        shopId,
        settings: shopSettings as Partial<ShopSettingsType>
      });

      toast({
        title: "Paramètres enregistrés",
        description: "Les paramètres de votre boutique ont été mis à jour.",
      });
    } catch (error) {
      console.error("Error updating shop settings:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour des paramètres.",
      });
    }
  };

  if (isLoading || !shop) {
    return <div>Chargement des paramètres...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de la boutique</CardTitle>
        <CardDescription>
          Gérez les paramètres de votre boutique.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="paymentMethods">Méthodes de paiement</Label>
          <div className="flex flex-wrap gap-2">
            <Checkbox
              id="paymentMethods-card"
              checked={values.paymentMethods.includes('card')}
              onCheckedChange={(checked) =>
                setValues({
                  ...values,
                  paymentMethods: checked
                    ? [...values.paymentMethods, 'card']
                    : values.paymentMethods.filter((method) => method !== 'card'),
                })
              }
            />
            <Label htmlFor="paymentMethods-card" className="cursor-pointer">
              Carte de crédit
            </Label>
            <Checkbox
              id="paymentMethods-paypal"
              checked={values.paymentMethods.includes('paypal')}
              onCheckedChange={(checked) =>
                setValues({
                  ...values,
                  paymentMethods: checked
                    ? [...values.paymentMethods, 'paypal']
                    : values.paymentMethods.filter((method) => method !== 'paypal'),
                })
              }
            />
            <Label htmlFor="paymentMethods-paypal" className="cursor-pointer">
              PayPal
            </Label>
            <Checkbox
              id="paymentMethods-bank_transfer"
              checked={values.paymentMethods.includes('bank_transfer')}
              onCheckedChange={(checked) =>
                setValues({
                  ...values,
                  paymentMethods: checked
                    ? [...values.paymentMethods, 'bank_transfer']
                    : values.paymentMethods.filter((method) => method !== 'bank_transfer'),
                })
              }
            />
            <Label htmlFor="paymentMethods-bank_transfer" className="cursor-pointer">
              Virement bancaire
            </Label>
            <Checkbox
              id="paymentMethods-cash"
              checked={values.paymentMethods.includes('cash')}
              onCheckedChange={(checked) =>
                setValues({
                  ...values,
                  paymentMethods: checked
                    ? [...values.paymentMethods, 'cash']
                    : values.paymentMethods.filter((method) => method !== 'cash'),
                })
              }
            />
            <Label htmlFor="paymentMethods-cash" className="cursor-pointer">
              Espèces
            </Label>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="autoAcceptOrders">Accepter automatiquement les commandes</Label>
          <Switch
            id="autoAcceptOrders"
            checked={values.autoAcceptOrders}
            onCheckedChange={(checked) => setValues({ ...values, autoAcceptOrders: checked })}
          />
        </div>
        <div className="space-y-2">
          <Label>Préférences de notification</Label>
          <div className="flex items-center space-x-2">
            <Label htmlFor="emailNotifications">Email</Label>
            <Switch
              id="emailNotifications"
              checked={values.emailNotifications}
              onCheckedChange={(checked) => setValues({ ...values, emailNotifications: checked })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="appNotifications">Application</Label>
            <Switch
              id="appNotifications"
              checked={values.appNotifications}
              onCheckedChange={(checked) => setValues({ ...values, appNotifications: checked })}
            />
          </div>
        </div>
        <Button onClick={onSubmit}>Enregistrer les paramètres</Button>
      </CardContent>
    </Card>
  );
};
