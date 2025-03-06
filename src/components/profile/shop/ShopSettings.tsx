
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useShop } from "@/hooks/useShop";
import { DeliveryOption, PaymentMethod, ShopSettings } from "@/core/shop/domain/types";

interface ShopSettingsProps {
  shopId: string;
}

export function ShopSettings({ shopId }: ShopSettingsProps) {
  const { toast } = useToast();
  const { getShopSettings, updateShopSettings } = useShop();
  const settingsQuery = getShopSettings(shopId);
  
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);

  useEffect(() => {
    if (settingsQuery.data) {
      setSettings(settingsQuery.data);
      setDeliveryOptions(settingsQuery.data.delivery_options || []);
      setPaymentMethods(settingsQuery.data.payment_methods || []);
      setAutoAcceptOrders(settingsQuery.data.auto_accept_orders || false);
      setEmailNotifications(settingsQuery.data.notification_preferences?.email || true);
      setAppNotifications(settingsQuery.data.notification_preferences?.app || true);
    }
  }, [settingsQuery.data]);

  const handleDeliveryOptionChange = (option: DeliveryOption, checked: boolean) => {
    if (checked) {
      setDeliveryOptions([...deliveryOptions, option]);
    } else {
      setDeliveryOptions(deliveryOptions.filter(o => o !== option));
    }
  };

  const handlePaymentMethodChange = (method: PaymentMethod, checked: boolean) => {
    if (checked) {
      setPaymentMethods([...paymentMethods, method]);
    } else {
      setPaymentMethods(paymentMethods.filter(m => m !== method));
    }
  };

  const handleSaveSettings = async () => {
    try {
      if (!settings) return;
      
      await updateShopSettings.mutateAsync({
        shopId,
        settings: {
          delivery_options: deliveryOptions,
          payment_methods: paymentMethods,
          auto_accept_orders: autoAcceptOrders,
          notification_preferences: {
            email: emailNotifications,
            app: appNotifications
          }
        }
      });
      
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres de votre boutique ont été mis à jour."
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour des paramètres.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de la boutique</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {settingsQuery.isLoading ? (
          <div>Chargement des paramètres...</div>
        ) : (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Options de livraison</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="delivery-pickup" 
                    checked={deliveryOptions.includes("pickup")}
                    onCheckedChange={(checked) => handleDeliveryOptionChange("pickup", !!checked)} 
                  />
                  <Label htmlFor="delivery-pickup">Retrait en boutique</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="delivery-delivery" 
                    checked={deliveryOptions.includes("delivery")}
                    onCheckedChange={(checked) => handleDeliveryOptionChange("delivery", !!checked)} 
                  />
                  <Label htmlFor="delivery-delivery">Livraison</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="delivery-both" 
                    checked={deliveryOptions.includes("both")}
                    onCheckedChange={(checked) => handleDeliveryOptionChange("both", !!checked)} 
                  />
                  <Label htmlFor="delivery-both">Les deux</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Méthodes de paiement</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="payment-card" 
                    checked={paymentMethods.includes("card")}
                    onCheckedChange={(checked) => handlePaymentMethodChange("card", !!checked)} 
                  />
                  <Label htmlFor="payment-card">Carte bancaire</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="payment-paypal" 
                    checked={paymentMethods.includes("paypal")}
                    onCheckedChange={(checked) => handlePaymentMethodChange("paypal", !!checked)} 
                  />
                  <Label htmlFor="payment-paypal">PayPal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="payment-transfer" 
                    checked={paymentMethods.includes("bank_transfer")}
                    onCheckedChange={(checked) => handlePaymentMethodChange("bank_transfer", !!checked)} 
                  />
                  <Label htmlFor="payment-transfer">Virement bancaire</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="payment-cash" 
                    checked={paymentMethods.includes("cash")}
                    onCheckedChange={(checked) => handlePaymentMethodChange("cash", !!checked)} 
                  />
                  <Label htmlFor="payment-cash">Espèces</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Commandes</h3>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="auto-accept" 
                  checked={autoAcceptOrders}
                  onCheckedChange={setAutoAcceptOrders} 
                />
                <Label htmlFor="auto-accept">Accepter automatiquement les commandes</Label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notifications</h3>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="email-notifications" 
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications} 
                />
                <Label htmlFor="email-notifications">Notifications par email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="app-notifications" 
                  checked={appNotifications}
                  onCheckedChange={setAppNotifications} 
                />
                <Label htmlFor="app-notifications">Notifications dans l'application</Label>
              </div>
            </div>

            <Button onClick={handleSaveSettings} disabled={updateShopSettings.isPending}>
              {updateShopSettings.isPending ? "Enregistrement..." : "Enregistrer les paramètres"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
