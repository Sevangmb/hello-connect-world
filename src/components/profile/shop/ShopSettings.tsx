
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CheckboxGroup, CheckboxItem } from '@/components/ui/checkbox-group';
import { useShop } from '@/hooks/useShop';
import { DeliveryOption, PaymentMethod, ShopSettings as ShopSettingsType } from '@/core/shop/domain/types';

interface ShopSettingsProps {
  shopId: string;
}

export function ShopSettings({ shopId }: ShopSettingsProps) {
  const { toast } = useToast();
  const { fetchShopSettings, updateShopSettings } = useShop();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [settings, setSettings] = useState<ShopSettingsType | null>(null);

  const form = useForm({
    defaultValues: {
      delivery_options: [] as string[],
      payment_methods: [] as string[],
      auto_accept_orders: false,
      notification_email: true,
      notification_app: true
    }
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const shopSettings = await fetchShopSettings(shopId);
        
        if (shopSettings) {
          setSettings(shopSettings);
          
          form.reset({
            delivery_options: shopSettings.delivery_options.map(option => option as unknown as string),
            payment_methods: shopSettings.payment_methods.map(method => method as unknown as string),
            auto_accept_orders: shopSettings.auto_accept_orders,
            notification_email: shopSettings.notification_preferences.email,
            notification_app: shopSettings.notification_preferences.app
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load shop settings'));
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [shopId, fetchShopSettings, form]);

  const onSubmit = async (data: any) => {
    try {
      await updateShopSettings(shopId, {
        delivery_options: data.delivery_options as unknown as DeliveryOption[],
        payment_methods: data.payment_methods as unknown as PaymentMethod[],
        auto_accept_orders: data.auto_accept_orders,
        notification_preferences: {
          email: data.notification_email,
          app: data.notification_app
        }
      });
      
      toast({
        title: 'Settings updated',
        description: 'Your shop settings have been successfully updated.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load shop settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error.message}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shop Settings</CardTitle>
        <CardDescription>
          Configure your shop's delivery options, payment methods, and notification preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="delivery_options"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Options</FormLabel>
                  <FormControl>
                    <CheckboxGroup 
                      value={field.value} 
                      onValueChange={field.onChange}
                      className="flex flex-col space-y-3"
                    >
                      <CheckboxItem value="pickup">Pickup</CheckboxItem>
                      <CheckboxItem value="delivery">Delivery</CheckboxItem>
                      <CheckboxItem value="both">Both</CheckboxItem>
                    </CheckboxGroup>
                  </FormControl>
                  <FormDescription>
                    Select the delivery options your shop will offer
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_methods"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Methods</FormLabel>
                  <FormControl>
                    <CheckboxGroup 
                      value={field.value} 
                      onValueChange={field.onChange}
                      className="flex flex-col space-y-3"
                    >
                      <CheckboxItem value="card">Card</CheckboxItem>
                      <CheckboxItem value="paypal">PayPal</CheckboxItem>
                      <CheckboxItem value="bank_transfer">Bank Transfer</CheckboxItem>
                      <CheckboxItem value="cash">Cash</CheckboxItem>
                    </CheckboxGroup>
                  </FormControl>
                  <FormDescription>
                    Select the payment methods your shop will accept
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="auto_accept_orders"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Auto-Accept Orders</FormLabel>
                    <FormDescription>
                      Automatically accept new orders without manual approval
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
              name="notification_email"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Email Notifications</FormLabel>
                    <FormDescription>
                      Receive notifications via email
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
              name="notification_app"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">App Notifications</FormLabel>
                    <FormDescription>
                      Receive in-app notifications
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

            <Button type="submit" className="w-full sm:w-auto">
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
