
import { useShop } from '@/hooks/useShop';
import type { ShopSettings as ShopSettingsType } from '@/core/shop/domain/types';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'sonner';

interface ShopSettingsProps {
  shop?: ShopSettingsType;
}

export const ShopSettings = () => {
  const { shop, updateShopSettings } = useShop();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      autoAcceptOrders: shop?.settings?.auto_accept_orders || false,
      emailNotifications: shop?.settings?.notification_preferences?.email || true,
      appNotifications: shop?.settings?.notification_preferences?.app || true
    }
  });

  const onSubmit = async (data: any) => {
    if (!shop?.id) return;
    setIsLoading(true);
    try {
      await updateShopSettings(shop.id, {
        auto_accept_orders: data.autoAcceptOrders,
        notification_preferences: {
          email: data.emailNotifications,
          app: data.appNotifications
        }
      });
      toast.success('Paramètres mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des paramètres');
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="autoAcceptOrders"
              checked={form.watch('autoAcceptOrders')}
              onCheckedChange={checked => form.setValue('autoAcceptOrders', checked)}
            />
            <label htmlFor="autoAcceptOrders" className="text-sm font-medium">
              Accepter automatiquement les commandes
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="emailNotifications"
              checked={form.watch('emailNotifications')}
              onCheckedChange={checked => form.setValue('emailNotifications', checked)}
            />
            <label htmlFor="emailNotifications" className="text-sm font-medium">
              Notifications par e-mail
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="appNotifications"
              checked={form.watch('appNotifications')}
              onCheckedChange={checked => form.setValue('appNotifications', checked)}
            />
            <label htmlFor="appNotifications" className="text-sm font-medium">
              Notifications dans l'application
            </label>
          </div>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </form>
    </Form>
  );
};
