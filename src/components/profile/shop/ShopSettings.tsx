
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useShop } from '@/hooks/useShop';
import { useForm } from 'react-hook-form';
import { PaymentMethod, DeliveryOption, ShopSettings as ShopSettingsType } from '@/core/shop/domain/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface SettingsFormValues {
  payment_methods: PaymentMethod[];
  delivery_options: DeliveryOption[];
  auto_accept_orders: boolean;
  notification_preferences: {
    email: boolean;
    app: boolean;
  };
}

const ShopSettings: React.FC = () => {
  const { shop, fetchShopByUserId } = useShop();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const form = useForm<SettingsFormValues>({
    defaultValues: {
      payment_methods: [],
      delivery_options: [],
      auto_accept_orders: false,
      notification_preferences: {
        email: true,
        app: true
      }
    }
  });
  
  const onSubmit = async (data: SettingsFormValues) => {
    if (!shop) return;
    
    try {
      setSaving(true);
      
      // In a real implementation, you would save this with updateShopSettings
      // For now, we'll just show a success message
      
      console.log('Saving shop settings:', data);
      
      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres de votre boutique ont été mis à jour."
      });
    } catch (error) {
      console.error('Error saving shop settings:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres de la boutique."
      });
    } finally {
      setSaving(false);
    }
  };
  
  useEffect(() => {
    const loadSettings = async () => {
      if (!shop) return;
      
      try {
        setLoading(true);
        
        // In a real implementation, you would fetch the settings
        // For now, we'll use dummy data
        
        const dummySettings = {
          payment_methods: ['card', 'paypal'] as PaymentMethod[],
          delivery_options: ['delivery', 'pickup'] as DeliveryOption[],
          auto_accept_orders: true,
          notification_preferences: {
            email: true,
            app: true
          }
        };
        
        form.reset(dummySettings);
      } catch (error) {
        console.error('Error loading shop settings:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les paramètres de la boutique."
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [shop, form, toast]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Méthodes de paiement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="payment-card"
                checked={form.watch('payment_methods').includes('card')}
                onCheckedChange={(checked) => {
                  const current = form.getValues('payment_methods');
                  if (checked) {
                    form.setValue('payment_methods', [...current, 'card'] as PaymentMethod[]);
                  } else {
                    form.setValue('payment_methods', current.filter(m => m !== 'card') as PaymentMethod[]);
                  }
                }}
              />
              <Label htmlFor="payment-card">Carte bancaire</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="payment-paypal"
                checked={form.watch('payment_methods').includes('paypal')}
                onCheckedChange={(checked) => {
                  const current = form.getValues('payment_methods');
                  if (checked) {
                    form.setValue('payment_methods', [...current, 'paypal'] as PaymentMethod[]);
                  } else {
                    form.setValue('payment_methods', current.filter(m => m !== 'paypal') as PaymentMethod[]);
                  }
                }}
              />
              <Label htmlFor="payment-paypal">PayPal</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="payment-bank"
                checked={form.watch('payment_methods').includes('bank_transfer')}
                onCheckedChange={(checked) => {
                  const current = form.getValues('payment_methods');
                  if (checked) {
                    form.setValue('payment_methods', [...current, 'bank_transfer'] as PaymentMethod[]);
                  } else {
                    form.setValue('payment_methods', current.filter(m => m !== 'bank_transfer') as PaymentMethod[]);
                  }
                }}
              />
              <Label htmlFor="payment-bank">Virement bancaire</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="payment-cash"
                checked={form.watch('payment_methods').includes('cash')}
                onCheckedChange={(checked) => {
                  const current = form.getValues('payment_methods');
                  if (checked) {
                    form.setValue('payment_methods', [...current, 'cash'] as PaymentMethod[]);
                  } else {
                    form.setValue('payment_methods', current.filter(m => m !== 'cash') as PaymentMethod[]);
                  }
                }}
              />
              <Label htmlFor="payment-cash">Paiement en espèces</Label>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Options de livraison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="delivery-pickup"
                checked={form.watch('delivery_options').includes('pickup')}
                onCheckedChange={(checked) => {
                  const current = form.getValues('delivery_options');
                  if (checked) {
                    form.setValue('delivery_options', [...current, 'pickup'] as DeliveryOption[]);
                  } else {
                    form.setValue('delivery_options', current.filter(o => o !== 'pickup') as DeliveryOption[]);
                  }
                }}
              />
              <Label htmlFor="delivery-pickup">Retrait en boutique</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="delivery-delivery"
                checked={form.watch('delivery_options').includes('delivery')}
                onCheckedChange={(checked) => {
                  const current = form.getValues('delivery_options');
                  if (checked) {
                    form.setValue('delivery_options', [...current, 'delivery'] as DeliveryOption[]);
                  } else {
                    form.setValue('delivery_options', current.filter(o => o !== 'delivery') as DeliveryOption[]);
                  }
                }}
              />
              <Label htmlFor="delivery-delivery">Livraison à domicile</Label>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Préférences de commande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-accept">Accepter automatiquement les commandes</Label>
              <Switch
                id="auto-accept"
                checked={form.watch('auto_accept_orders')}
                onCheckedChange={(checked) => {
                  form.setValue('auto_accept_orders', checked);
                }}
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
              <Label htmlFor="notify-email">Notifications par email</Label>
              <Switch
                id="notify-email"
                checked={form.watch('notification_preferences.email')}
                onCheckedChange={(checked) => {
                  form.setValue('notification_preferences.email', checked);
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-app">Notifications dans l'application</Label>
              <Switch
                id="notify-app"
                checked={form.watch('notification_preferences.app')}
                onCheckedChange={(checked) => {
                  form.setValue('notification_preferences.app', checked);
                }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sauvegarde en cours...
            </>
          ) : (
            'Sauvegarder les paramètres'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ShopSettings;
