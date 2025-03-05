
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useShop } from '@/hooks/useShop';

const shopSettingsSchema = z.object({
  return_policy: z.string().optional(),
  auto_accept_orders: z.boolean().default(false),
  notification_new_order: z.boolean().default(true),
  notification_order_status: z.boolean().default(true),
  notification_low_stock: z.boolean().default(true),
  notification_email: z.boolean().default(true),
  notification_in_app: z.boolean().default(true),
});

type ShopSettingsFormValues = z.infer<typeof shopSettingsSchema>;

export function ShopSettings() {
  const { shop, settings, loading, updateShopInfo } = useShop();
  
  const form = useForm<ShopSettingsFormValues>({
    resolver: zodResolver(shopSettingsSchema),
    defaultValues: {
      return_policy: settings?.return_policy || '',
      auto_accept_orders: settings?.auto_accept_orders || false,
      notification_new_order: settings?.notification_preferences?.new_order || true,
      notification_order_status: settings?.notification_preferences?.order_status_change || true,
      notification_low_stock: settings?.notification_preferences?.low_stock || true,
      notification_email: settings?.notification_preferences?.email || true,
      notification_in_app: settings?.notification_preferences?.in_app || true,
    },
  });
  
  const onSubmit = async (values: ShopSettingsFormValues) => {
    if (!shop) return;
    
    const shopData = {
      name: shop.name,
      description: shop.description,
      // Autres champs à mettre à jour si nécessaire
    };
    
    await updateShopInfo(shopData);
    
    // La mise à jour des paramètres serait gérée ici
    // Mais comme nous n'avons pas encore implémenté cette fonctionnalité dans le repository,
    // nous affichons seulement un message dans la console
    console.log('Settings to update:', values);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informations de la boutique</CardTitle>
              <CardDescription>
                Mettez à jour les informations principales de votre boutique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="return_policy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Politique de retour</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Décrivez votre politique de retour..."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      Cette information sera affichée aux clients lors de leur achat.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="auto_accept_orders"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Acceptation automatique des commandes</FormLabel>
                      <FormDescription>
                        Les commandes seront automatiquement acceptées sans validation manuelle
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configurez vos préférences de notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="notification_new_order"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Nouvelles commandes</FormLabel>
                      <FormDescription>
                        Recevoir une notification pour chaque nouvelle commande
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notification_order_status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Changements de statut</FormLabel>
                      <FormDescription>
                        Recevoir une notification quand une commande change de statut
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notification_low_stock"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Stock bas</FormLabel>
                      <FormDescription>
                        Recevoir une notification quand le stock d'un article est bas
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="space-y-2 mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium">Canaux de notification</h4>
                
                <FormField
                  control={form.control}
                  name="notification_email"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Email</FormLabel>
                        <FormDescription>
                          Recevoir les notifications par email
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notification_in_app"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Dans l'application</FormLabel>
                        <FormDescription>
                          Recevoir les notifications dans l'application
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
