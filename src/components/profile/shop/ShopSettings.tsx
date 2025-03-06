
import React, { useState, useEffect } from 'react';
import { useShop } from '@/hooks/useShop';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { DeliveryOption, PaymentMethod, ShopSettings } from '@/core/shop/domain/types';

const formSchema = z.object({
  delivery_options: z.array(z.string()),
  payment_methods: z.array(z.string()),
  auto_accept_orders: z.boolean(),
  notification_preferences: z.object({
    email: z.boolean(),
    app: z.boolean(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export const ShopSettings = () => {
  const { shop, getShopSettings, updateShopSettings } = useShop();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      delivery_options: [],
      payment_methods: [],
      auto_accept_orders: false,
      notification_preferences: {
        email: true,
        app: true,
      },
    },
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (!shop?.id) return;
      
      try {
        setIsLoading(true);
        const settings = await getShopSettings(shop.id);
        
        if (settings) {
          form.reset({
            delivery_options: settings.delivery_options as string[],
            payment_methods: settings.payment_methods as string[],
            auto_accept_orders: settings.auto_accept_orders,
            notification_preferences: settings.notification_preferences,
          });
        }
      } catch (error) {
        console.error('Error loading shop settings:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de charger les paramètres de la boutique.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [shop?.id, form, getShopSettings, toast]);

  const onSubmit = async (data: FormValues) => {
    if (!shop?.id) return;
    
    try {
      setIsLoading(true);
      
      await updateShopSettings(shop.id, {
        delivery_options: data.delivery_options as DeliveryOption[],
        payment_methods: data.payment_methods as PaymentMethod[],
        auto_accept_orders: data.auto_accept_orders,
        notification_preferences: data.notification_preferences,
      });
      
      toast({
        title: 'Paramètres mis à jour',
        description: 'Les paramètres de votre boutique ont été mis à jour avec succès.',
      });
    } catch (error) {
      console.error('Error updating shop settings:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la mise à jour des paramètres.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de la boutique</CardTitle>
        <CardDescription>Configurez les options de votre boutique</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Options de livraison</h3>
              <p className="text-sm text-muted-foreground">
                Sélectionnez les options de livraison disponibles pour vos clients.
              </p>
              <div className="grid gap-4 pt-4">
                <FormField
                  control={form.control}
                  name="delivery_options"
                  render={() => (
                    <FormItem className="space-y-2">
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="delivery_options"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes('pickup')}
                                    onCheckedChange={(checked) => {
                                      checked
                                        ? field.onChange([...field.value, 'pickup'])
                                        : field.onChange(field.value?.filter((value) => value !== 'pickup'));
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Retrait en boutique</FormLabel>
                                  <FormDescription>
                                    Les clients peuvent venir chercher leurs commandes directement en boutique.
                                  </FormDescription>
                                </div>
                              </FormItem>
                            );
                          }}
                        />
                        <FormField
                          control={form.control}
                          name="delivery_options"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes('delivery')}
                                    onCheckedChange={(checked) => {
                                      checked
                                        ? field.onChange([...field.value, 'delivery'])
                                        : field.onChange(field.value?.filter((value) => value !== 'delivery'));
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Livraison à domicile</FormLabel>
                                  <FormDescription>
                                    Proposer la livraison des commandes à l'adresse des clients.
                                  </FormDescription>
                                </div>
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium">Options de paiement</h3>
              <p className="text-sm text-muted-foreground">
                Sélectionnez les méthodes de paiement acceptées.
              </p>
              <div className="grid gap-4 pt-4">
                <FormField
                  control={form.control}
                  name="payment_methods"
                  render={() => (
                    <FormItem className="space-y-2">
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="payment_methods"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes('card')}
                                  onCheckedChange={(checked) => {
                                    checked
                                      ? field.onChange([...field.value, 'card'])
                                      : field.onChange(field.value?.filter((value) => value !== 'card'));
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Carte bancaire</FormLabel>
                                <FormDescription>
                                  Paiement sécurisé par carte bancaire.
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="payment_methods"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes('paypal')}
                                  onCheckedChange={(checked) => {
                                    checked
                                      ? field.onChange([...field.value, 'paypal'])
                                      : field.onChange(field.value?.filter((value) => value !== 'paypal'));
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>PayPal</FormLabel>
                                <FormDescription>
                                  Accepter les paiements via PayPal.
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="payment_methods"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes('bank_transfer')}
                                  onCheckedChange={(checked) => {
                                    checked
                                      ? field.onChange([...field.value, 'bank_transfer'])
                                      : field.onChange(field.value?.filter((value) => value !== 'bank_transfer'));
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Virement bancaire</FormLabel>
                                <FormDescription>
                                  Accepter les paiements par virement bancaire.
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium">Paramètres des commandes</h3>
              <div className="grid gap-4 pt-4">
                <FormField
                  control={form.control}
                  name="auto_accept_orders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Acceptation automatique des commandes</FormLabel>
                        <FormDescription>
                          Les commandes seront automatiquement acceptées sans validation manuelle.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium">Notifications</h3>
              <div className="grid gap-4 pt-4">
                <FormField
                  control={form.control}
                  name="notification_preferences.email"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Notifications par email</FormLabel>
                        <FormDescription>
                          Recevoir des notifications par email pour les nouvelles commandes.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notification_preferences.app"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Notifications dans l'application</FormLabel>
                        <FormDescription>
                          Recevoir des notifications dans l'application pour les nouvelles commandes.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Enregistrement...' : 'Enregistrer les paramètres'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
