
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { shopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { ShopSettings as ShopSettingsType } from '@/core/shop/domain/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface ShopSettingsProps {
  shopId: string;
}

export function ShopSettings({ shopId }: ShopSettingsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<ShopSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        if (shopId) {
          const shopSettings = await shopService.getShopSettings(shopId);
          setSettings(shopSettings);
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les paramètres",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [shopId, toast]);

  const handleSaveSettings = async () => {
    try {
      setUpdating(true);
      if (shopId && settings) {
        await shopService.updateShopSettings(shopId, settings);
        toast({
          title: "Succès",
          description: "Les paramètres ont été mis à jour"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleDeliveryOption = (option: string) => {
    if (!settings) return;
    
    let updatedOptions = [...settings.delivery_options];
    
    if (updatedOptions.includes(option)) {
      updatedOptions = updatedOptions.filter(o => o !== option);
    } else {
      updatedOptions.push(option);
    }
    
    setSettings({
      ...settings,
      delivery_options: updatedOptions
    });
  };

  const handleTogglePaymentMethod = (method: string) => {
    if (!settings) return;
    
    let updatedMethods = [...settings.payment_methods];
    
    if (updatedMethods.includes(method)) {
      updatedMethods = updatedMethods.filter(m => m !== method);
    } else {
      updatedMethods.push(method);
    }
    
    setSettings({
      ...settings,
      payment_methods: updatedMethods
    });
  };

  if (loading) {
    return <div>Chargement des paramètres...</div>;
  }

  if (!settings) {
    return <div>Aucun paramètre trouvé.</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Paramètres de la boutique</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Options de livraison</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="pickup" 
                checked={settings.delivery_options.includes('pickup')}
                onCheckedChange={() => handleToggleDeliveryOption('pickup')}
              />
              <Label htmlFor="pickup">Retrait sur place</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="delivery" 
                checked={settings.delivery_options.includes('delivery')}
                onCheckedChange={() => handleToggleDeliveryOption('delivery')}
              />
              <Label htmlFor="delivery">Livraison</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="both" 
                checked={settings.delivery_options.includes('both')}
                onCheckedChange={() => handleToggleDeliveryOption('both')}
              />
              <Label htmlFor="both">Les deux options</Label>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Méthodes de paiement</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="card" 
                checked={settings.payment_methods.includes('card')}
                onCheckedChange={() => handleTogglePaymentMethod('card')}
              />
              <Label htmlFor="card">Carte bancaire</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="paypal" 
                checked={settings.payment_methods.includes('paypal')}
                onCheckedChange={() => handleTogglePaymentMethod('paypal')}
              />
              <Label htmlFor="paypal">PayPal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="bank_transfer" 
                checked={settings.payment_methods.includes('bank_transfer')}
                onCheckedChange={() => handleTogglePaymentMethod('bank_transfer')}
              />
              <Label htmlFor="bank_transfer">Virement bancaire</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="cash" 
                checked={settings.payment_methods.includes('cash')}
                onCheckedChange={() => handleTogglePaymentMethod('cash')}
              />
              <Label htmlFor="cash">Espèces</Label>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Autres paramètres</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto_accept">Acceptation automatique des commandes</Label>
              <Switch 
                id="auto_accept" 
                checked={settings.auto_accept_orders}
                onCheckedChange={(checked) => 
                  setSettings({...settings, auto_accept_orders: checked})
                }
              />
            </div>
            
            <div>
              <h5 className="text-sm font-medium mb-2">Préférences de notification</h5>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="email_notif" 
                    checked={settings.notification_preferences.email}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        notification_preferences: {
                          ...settings.notification_preferences,
                          email: !!checked
                        }
                      })
                    }
                  />
                  <Label htmlFor="email_notif">Notifications par email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="app_notif" 
                    checked={settings.notification_preferences.app}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        notification_preferences: {
                          ...settings.notification_preferences,
                          app: !!checked
                        }
                      })
                    }
                  />
                  <Label htmlFor="app_notif">Notifications dans l'application</Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleSaveSettings}
        disabled={updating}
      >
        {updating ? 'Enregistrement...' : 'Enregistrer les paramètres'}
      </Button>
    </div>
  );
}
