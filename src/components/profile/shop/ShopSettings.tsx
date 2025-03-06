
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useShop } from '@/hooks/useShop';
import { useToast } from '@/hooks/use-toast';
import { ShopSettings as ShopSettingsType, DeliveryOption, PaymentMethod } from '@/core/shop/domain/types';
import { Loader2 } from 'lucide-react';

export function ShopSettings() {
  const { toast } = useToast();
  const { 
    shop, 
    loading,
    fetchShopByUserId,
    updateShopSettings: updateSettings 
  } = useShop();

  const [settings, setSettings] = useState<ShopSettingsType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch shop and settings
  useEffect(() => {
    const loadData = async () => {
      await fetchShopByUserId();
    };
    
    loadData();
  }, [fetchShopByUserId]);

  // Set initial settings when shop is loaded
  useEffect(() => {
    if (shop && shop.settings) {
      setSettings(shop.settings);
    } else if (shop && !shop.settings) {
      // Create default settings object if none exists
      setSettings({
        id: '',
        shop_id: shop.id,
        delivery_options: ['pickup', 'delivery'] as DeliveryOption[],
        payment_methods: ['card', 'paypal'] as PaymentMethod[],
        auto_accept_orders: false,
        notification_preferences: {
          email: true,
          app: true,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }, [shop]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shop || !settings) return;
    
    try {
      setIsSubmitting(true);
      
      await updateSettings(shop.id, settings);
      
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres de votre boutique ont été mis à jour avec succès",
      });
    } catch (error) {
      console.error("Error updating shop settings:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeliveryOptionChange = (option: DeliveryOption, checked: boolean) => {
    if (!settings) return;
    
    setSettings(prev => {
      if (!prev) return prev;
      
      const newOptions = checked 
        ? [...prev.delivery_options, option] 
        : prev.delivery_options.filter(opt => opt !== option);
      
      return {
        ...prev,
        delivery_options: newOptions as DeliveryOption[]
      };
    });
  };

  const handlePaymentMethodChange = (method: PaymentMethod, checked: boolean) => {
    if (!settings) return;
    
    setSettings(prev => {
      if (!prev) return prev;
      
      const newMethods = checked 
        ? [...prev.payment_methods, method] 
        : prev.payment_methods.filter(m => m !== method);
      
      return {
        ...prev,
        payment_methods: newMethods as PaymentMethod[]
      };
    });
  };

  const handleAutoAcceptChange = (checked: boolean) => {
    if (!settings) return;
    
    setSettings(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        auto_accept_orders: checked
      };
    });
  };

  const handleNotificationChange = (key: 'email' | 'app', checked: boolean) => {
    if (!settings) return;
    
    setSettings(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        notification_preferences: {
          ...prev.notification_preferences,
          [key]: checked
        }
      };
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center p-12">
        <h2 className="text-2xl font-bold mb-4">Aucune boutique trouvée</h2>
        <p className="text-muted-foreground mb-6">
          Vous devez d'abord créer une boutique pour accéder aux paramètres.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Paramètres de la boutique</h1>
        <p className="text-muted-foreground">
          Configurez les options de votre boutique pour une meilleure expérience client.
        </p>
      </div>

      {settings && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="delivery" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="delivery">Livraison</TabsTrigger>
              <TabsTrigger value="payment">Paiement</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="delivery" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Options de livraison</CardTitle>
                  <CardDescription>
                    Définissez les modes de livraison que vous proposez à vos clients.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="pickup"
                        checked={settings.delivery_options.includes('pickup')}
                        onCheckedChange={(checked) => 
                          handleDeliveryOptionChange('pickup', checked as boolean)
                        }
                      />
                      <Label htmlFor="pickup">Retrait en boutique</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="delivery"
                        checked={settings.delivery_options.includes('delivery')}
                        onCheckedChange={(checked) => 
                          handleDeliveryOptionChange('delivery', checked as boolean)
                        }
                      />
                      <Label htmlFor="delivery">Livraison à domicile</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="both"
                        checked={settings.delivery_options.includes('both')}
                        onCheckedChange={(checked) => 
                          handleDeliveryOptionChange('both', checked as boolean)
                        }
                      />
                      <Label htmlFor="both">Les deux options</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Méthodes de paiement</CardTitle>
                  <CardDescription>
                    Choisissez les modes de paiement acceptés dans votre boutique.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="card"
                        checked={settings.payment_methods.includes('card')}
                        onCheckedChange={(checked) => 
                          handlePaymentMethodChange('card', checked as boolean)
                        }
                      />
                      <Label htmlFor="card">Carte bancaire</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="paypal"
                        checked={settings.payment_methods.includes('paypal')}
                        onCheckedChange={(checked) => 
                          handlePaymentMethodChange('paypal', checked as boolean)
                        }
                      />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="bank_transfer"
                        checked={settings.payment_methods.includes('bank_transfer')}
                        onCheckedChange={(checked) => 
                          handlePaymentMethodChange('bank_transfer', checked as boolean)
                        }
                      />
                      <Label htmlFor="bank_transfer">Virement bancaire</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="cash"
                        checked={settings.payment_methods.includes('cash')}
                        onCheckedChange={(checked) => 
                          handlePaymentMethodChange('cash', checked as boolean)
                        }
                      />
                      <Label htmlFor="cash">Espèces (à la livraison)</Label>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="auto_accept"
                        checked={settings.auto_accept_orders}
                        onCheckedChange={handleAutoAcceptChange}
                      />
                      <Label htmlFor="auto_accept">Acceptation automatique des commandes</Label>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Les commandes seront automatiquement acceptées sans validation manuelle.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de notification</CardTitle>
                  <CardDescription>
                    Configurez comment vous souhaitez être notifié des événements de votre boutique.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="notify_email"
                        checked={settings.notification_preferences.email}
                        onCheckedChange={(checked) => 
                          handleNotificationChange('email', checked)
                        }
                      />
                      <Label htmlFor="notify_email">Notifications par email</Label>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">
                      Recevez des emails pour les nouvelles commandes, messages et avis.
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="notify_app"
                        checked={settings.notification_preferences.app}
                        onCheckedChange={(checked) => 
                          handleNotificationChange('app', checked)
                        }
                      />
                      <Label htmlFor="notify_app">Notifications dans l'application</Label>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">
                      Recevez des notifications dans l'application pour toutes les activités.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ShopSettings;
