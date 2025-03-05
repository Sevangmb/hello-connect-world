
import React, { useState, useEffect } from 'react';
import { useShop } from '@/hooks/useShop';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/clothes/components/ImageUpload';
import { CheckboxGroup, CheckboxItem } from '@/components/ui/checkbox-group';
import { DeliveryOption, PaymentMethod } from '@/core/shop/domain/types';

interface ShopSettingsProps {
  shopId: string;
}

export const ShopSettings: React.FC<ShopSettingsProps> = ({ shopId }) => {
  const { shop, getShopSettings, updateShopInfo, updateShopSettings } = useShop();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [shopData, setShopData] = useState({
    id: shopId,
    name: '',
    description: '',
    phone: '',
    website: '',
    address: '',
    image_url: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        // Load shop settings
        const shopSettings = await getShopSettings(shopId);
        setSettings(shopSettings);
        
        // Initialize shop data
        if (shop) {
          setShopData({
            id: shop.id,
            name: shop.name || '',
            description: shop.description || '',
            phone: shop.phone || '',
            website: shop.website || '',
            address: shop.address || '',
            image_url: shop.image_url || ''
          });
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les paramètres de la boutique.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [getShopSettings, shop, shopId, toast]);

  const handleShopInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShopData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (url: string) => {
    setShopData(prev => ({ ...prev, image_url: url }));
  };

  const handlePaymentMethodsChange = (values: string[]) => {
    if (settings) {
      setSettings({
        ...settings,
        payment_methods: values as PaymentMethod[]
      });
    }
  };

  const handleDeliveryOptionsChange = (values: string[]) => {
    if (settings) {
      setSettings({
        ...settings,
        delivery_options: values as DeliveryOption[]
      });
    }
  };

  const handleAutoAcceptChange = (checked: boolean) => {
    if (settings) {
      setSettings({
        ...settings,
        auto_accept_orders: checked
      });
    }
  };

  const handleNotificationChange = (type: 'email' | 'app', checked: boolean) => {
    if (settings) {
      setSettings({
        ...settings,
        notification_preferences: {
          ...settings.notification_preferences,
          [type]: checked
        }
      });
    }
  };

  const saveShopInfo = async () => {
    setUpdating(true);
    try {
      // Only send allowed fields to updateShopInfo
      const updateData = {
        id: shopData.id,
        name: shopData.name,
        description: shopData.description,
        image_url: shopData.image_url,
        phone: shopData.phone,
        website: shopData.website,
        address: shopData.address
      };
      
      await updateShopInfo.mutateAsync(updateData);
      
      toast({
        title: "Informations mises à jour",
        description: "Les informations de la boutique ont été mises à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations de la boutique.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const saveShopSettings = async () => {
    if (!settings) return;
    
    setUpdating(true);
    try {
      await updateShopSettings(shopId, settings);
      
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres de la boutique ont été mis à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres de la boutique.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations de la boutique</CardTitle>
          <CardDescription>Modifiez les informations générales de votre boutique.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="image">Image de la boutique</Label>
              <div className="mt-2">
                <ImageUpload 
                  imageUrl={shopData.image_url}
                  onImageUploaded={handleImageChange}
                  onUploading={setIsUploading}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="name">Nom de la boutique</Label>
              <Input
                id="name"
                name="name"
                value={shopData.name}
                onChange={handleShopInfoChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={shopData.description}
                onChange={handleShopInfoChange}
                className="mt-1"
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                value={shopData.phone}
                onChange={handleShopInfoChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                name="website"
                value={shopData.website}
                onChange={handleShopInfoChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                name="address"
                value={shopData.address}
                onChange={handleShopInfoChange}
                className="mt-1"
              />
            </div>
            
            <Button 
              onClick={saveShopInfo} 
              disabled={updating || isUploading}
              className="mt-2"
            >
              {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enregistrer les informations
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {settings && (
        <Card>
          <CardHeader>
            <CardTitle>Paramètres de vente</CardTitle>
            <CardDescription>Configurez les méthodes de paiement et options de livraison.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label>Méthodes de paiement acceptées</Label>
                <CheckboxGroup 
                  className="mt-2"
                  value={settings.payment_methods}
                  onValueChange={handlePaymentMethodsChange}
                >
                  <CheckboxItem value="card">Carte bancaire</CheckboxItem>
                  <CheckboxItem value="paypal">PayPal</CheckboxItem>
                  <CheckboxItem value="bank_transfer">Virement bancaire</CheckboxItem>
                  <CheckboxItem value="cash">Espèces (en personne)</CheckboxItem>
                </CheckboxGroup>
              </div>
              
              <div>
                <Label>Options de livraison</Label>
                <CheckboxGroup 
                  className="mt-2"
                  value={settings.delivery_options}
                  onValueChange={handleDeliveryOptionsChange}
                >
                  <CheckboxItem value="pickup">Retrait en boutique</CheckboxItem>
                  <CheckboxItem value="delivery">Livraison</CheckboxItem>
                  <CheckboxItem value="both">Les deux</CheckboxItem>
                </CheckboxGroup>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto_accept" className="block">Acceptation automatique des commandes</Label>
                  <p className="text-sm text-muted-foreground">Accepter automatiquement les nouvelles commandes</p>
                </div>
                <Switch
                  id="auto_accept"
                  checked={settings.auto_accept_orders}
                  onCheckedChange={handleAutoAcceptChange}
                />
              </div>
              
              <div>
                <Label className="mb-2 block">Préférences de notification</Label>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label htmlFor="email_notif" className="font-normal">Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">Recevoir des emails pour les nouvelles commandes</p>
                  </div>
                  <Switch
                    id="email_notif"
                    checked={settings.notification_preferences.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label htmlFor="app_notif" className="font-normal">Notifications dans l'application</Label>
                    <p className="text-sm text-muted-foreground">Recevoir des notifications dans l'application</p>
                  </div>
                  <Switch
                    id="app_notif"
                    checked={settings.notification_preferences.app}
                    onCheckedChange={(checked) => handleNotificationChange('app', checked)}
                  />
                </div>
              </div>
              
              <Button 
                onClick={saveShopSettings} 
                disabled={updating}
                className="mt-2"
              >
                {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Enregistrer les paramètres
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
