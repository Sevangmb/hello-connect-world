import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useShopById } from "@/hooks/useShop";
import { useUpdateShopSettings } from "@/hooks/useShop";
import { ShopSettings, DeliveryOption, PaymentMethod } from "@/core/shop/domain/types";

const deliveryOptions = [
  { value: "pickup", label: "Pickup" },
  { value: "delivery", label: "Delivery" },
  { value: "both", label: "Both" },
];

const paymentMethods = [
  { value: "card", label: "Card" },
  { value: "paypal", label: "PayPal" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cash", label: "Cash" },
];

interface ShopSettingsProps {
  shopId: string;
}

const formSchema = z.object({
  emailNotifications: z.boolean().default(true),
  appNotifications: z.boolean().default(true),
  autoAcceptOrders: z.boolean().default(false),
  deliveryOptions: z.array(z.string()).default([]),
  paymentMethods: z.array(z.string()).default([]),
});

export function ShopSettings({ shopId }: ShopSettingsProps) {
  const { toast } = useToast();

  // Replace data.shop and isLoading with shop and loading
  const { shop, loading, error, fetchShop } = useShopById(shopId);

  const [selectedDeliveryOptions, setSelectedDeliveryOptions] = useState<string[]>([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const [autoAcceptOrders, setAutoAcceptOrders] = useState<boolean>(false);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [appNotifications, setAppNotifications] = useState<boolean>(true);

  useEffect(() => {
    if (shop) {
      setSelectedDeliveryOptions(shop.settings?.delivery_options || []);
      setSelectedPaymentMethods(shop.settings?.payment_methods || []);
      setAutoAcceptOrders(shop.settings?.auto_accept_orders || false);
      setEmailNotifications(shop.settings?.notification_preferences?.email || true);
      setAppNotifications(shop.settings?.notification_preferences?.app || true);
    }
  }, [shop]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailNotifications: true,
      appNotifications: true,
      autoAcceptOrders: false,
      deliveryOptions: [],
      paymentMethods: [],
    },
  });

  // Replace mutateAsync with updateSettings
  const useUpdateShopSettings = useUpdateShopSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      if (!shop || !shopId) {
        toast({
          title: "Erreur",
          description: "Boutique introuvable",
          variant: "destructive",
        });
        return;
      }
    
      const updatedSettings: Partial<ShopSettings> = {
        delivery_options: selectedDeliveryOptions as DeliveryOption[],
        payment_methods: selectedPaymentMethods as PaymentMethod[],
        auto_accept_orders: autoAcceptOrders,
        notification_preferences: {
          email: emailNotifications,
          app: appNotifications
        }
      };
    
      // Use updateSettings instead of mutateAsync
      await useUpdateShopSettings.updateSettings(shopId, updatedSettings);
    
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres de votre boutique ont été mis à jour avec succès"
      });
    
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la mise à jour des paramètres",
        variant: "destructive"
      });
    }
  };

  // Replace isPending with updating in button
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de la boutique</CardTitle>
        <CardDescription>
          Gérez les paramètres de votre boutique ici.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div>Chargement...</div>
        ) : error ? (
          <div>Erreur: {error.message}</div>
        ) : (
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormField
                    control={form.control}
                    name="deliveryOptions"
                    render={() => (
                      <FormItem>
                        <FormLabel>Options de livraison</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            setSelectedDeliveryOptions(
                              Array.isArray(value) ? value : [value]
                            );
                          }}
                          defaultValue={selectedDeliveryOptions}
                          multiple
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner les options" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {deliveryOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="paymentMethods"
                    render={() => (
                      <FormItem>
                        <FormLabel>Méthodes de paiement</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            setSelectedPaymentMethods(
                              Array.isArray(value) ? value : [value]
                            );
                          }}
                          defaultValue={selectedPaymentMethods}
                          multiple
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner les méthodes" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {paymentMethods.map((method) => (
                              <SelectItem
                                key={method.value}
                                value={method.value}
                              >
                                {method.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="autoAcceptOrders"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Accepter automatiquement les commandes
                      </FormLabel>
                      <FormDescription>
                        Activer pour accepter automatiquement les nouvelles
                        commandes.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={autoAcceptOrders}
                        onCheckedChange={(checked) => {
                          setAutoAcceptOrders(checked);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Notifications par e-mail
                        </FormLabel>
                        <FormDescription>
                          Recevez des notifications par e-mail.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={emailNotifications}
                          onCheckedChange={(checked) => {
                            setEmailNotifications(checked);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Notifications dans l'application
                        </FormLabel>
                        <FormDescription>
                          Recevez des notifications dans l'application.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={appNotifications}
                          onCheckedChange={(checked) => {
                            setAppNotifications(checked);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={useUpdateShopSettings.updating}>
                {useUpdateShopSettings.updating ? "Mise à jour..." : "Enregistrer les modifications"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
