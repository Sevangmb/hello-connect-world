
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import ImageUpload from '@/components/ui/image-upload';
import { Shop, PaymentMethod, DeliveryOption, ShopSettings as ShopSettingsType } from '@/core/shop/domain/types';

// Define the props interface
export interface ShopSettingsProps {
  shop: Shop;
  isShopLoading: boolean;
  refetchShop: () => Promise<any>;
  getShopSettings: (shopId: string) => Promise<ShopSettingsType | null>;
  createShopSettings: (settings: any) => Promise<boolean>;
  updateShopSettings: (data: any) => Promise<boolean>;
  updateShopInfo: (shopData: any) => Promise<Shop>;
}

const ShopSettings: React.FC<ShopSettingsProps> = ({
  shop,
  isShopLoading,
  refetchShop,
  getShopSettings,
  createShopSettings,
  updateShopSettings,
  updateShopInfo
}) => {
  const { toast } = useToast();
  const [name, setName] = useState(shop?.name || '');
  const [description, setDescription] = useState(shop?.description || '');
  const [imageUrl, setImageUrl] = useState(shop?.image_url || '');
  const [imageUploading, setImageUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shopSettingsData, setShopSettingsData] = useState<ShopSettingsType | null>(null);
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);

  // Payment methods state
  const [acceptsCard, setAcceptsCard] = useState(false);
  const [acceptsPaypal, setAcceptsPaypal] = useState(false);
  const [acceptsBankTransfer, setAcceptsBankTransfer] = useState(false);
  const [acceptsCash, setAcceptsCash] = useState(false);

  // Delivery options state
  const [offersPickup, setOffersPickup] = useState(false);
  const [offersDelivery, setOffersDelivery] = useState(false);
  const [offersBoth, setOffersBoth] = useState(false);

  // Auto-accept orders
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);

  // Load shop settings
  useEffect(() => {
    const loadShopSettings = async () => {
      if (shop?.id) {
        setIsSettingsLoading(true);
        try {
          const settings = await getShopSettings(shop.id);
          
          if (settings) {
            setShopSettingsData(settings);
            
            // Set payment methods
            const paymentMethods = settings.payment_methods || [];
            setAcceptsCard(paymentMethods.includes('card' as PaymentMethod));
            setAcceptsPaypal(paymentMethods.includes('paypal' as PaymentMethod));
            setAcceptsBankTransfer(paymentMethods.includes('bank_transfer' as PaymentMethod));
            setAcceptsCash(paymentMethods.includes('cash' as PaymentMethod));
            
            // Set delivery options
            const deliveryOptions = settings.delivery_options || [];
            setOffersPickup(deliveryOptions.includes('pickup' as DeliveryOption));
            setOffersDelivery(deliveryOptions.includes('delivery' as DeliveryOption));
            setOffersBoth(deliveryOptions.includes('both' as DeliveryOption));
            
            // Set auto accept
            setAutoAcceptOrders(settings.auto_accept_orders || false);
            
            // Set notification preferences
            const notificationPrefs = settings.notification_preferences || { email: true, app: true };
            setEmailNotifications(notificationPrefs.email);
            setAppNotifications(notificationPrefs.app);
          }
        } catch (error) {
          console.error('Error loading shop settings:', error);
          toast({
            title: 'Erreur',
            description: 'Impossible de charger les paramètres de la boutique',
            variant: 'destructive',
          });
        } finally {
          setIsSettingsLoading(false);
        }
      }
    };
    
    loadShopSettings();
  }, [shop?.id, getShopSettings, toast]);

  const handleShopInfoUpdate = async () => {
    if (!shop?.id) return;
    
    setIsLoading(true);
    try {
      await updateShopInfo({
        id: shop.id,
        name,
        description,
        image_url: imageUrl,
      });
      
      await refetchShop();
      
      toast({
        title: 'Succès',
        description: 'Informations de la boutique mises à jour',
      });
    } catch (error) {
      console.error('Error updating shop info:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour les informations de la boutique',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShopSettingsUpdate = async () => {
    if (!shop?.id) return;
    
    setIsLoading(true);
    try {
      // Prepare payment methods array
      const paymentMethods: PaymentMethod[] = [];
      if (acceptsCard) paymentMethods.push('card' as PaymentMethod);
      if (acceptsPaypal) paymentMethods.push('paypal' as PaymentMethod);
      if (acceptsBankTransfer) paymentMethods.push('bank_transfer' as PaymentMethod);
      if (acceptsCash) paymentMethods.push('cash' as PaymentMethod);
      
      // Prepare delivery options array
      const deliveryOptions: DeliveryOption[] = [];
      if (offersPickup) deliveryOptions.push('pickup' as DeliveryOption);
      if (offersDelivery) deliveryOptions.push('delivery' as DeliveryOption);
      if (offersBoth) deliveryOptions.push('both' as DeliveryOption);
      
      // Prepare notification preferences
      const notificationPreferences = {
        email: emailNotifications,
        app: appNotifications,
      };
      
      const settingsData = {
        id: shop.id,
        settings: {
          payment_methods: paymentMethods,
          delivery_options: deliveryOptions,
          auto_accept_orders: autoAcceptOrders,
          notification_preferences: notificationPreferences,
        }
      };
      
      // Check if settings already exist
      if (!shopSettingsData) {
        await createShopSettings({
          shop_id: shop.id,
          ...settingsData.settings,
        });
      } else {
        await updateShopSettings(settingsData);
      }
      
      toast({
        title: 'Succès',
        description: 'Paramètres de la boutique mis à jour',
      });
    } catch (error) {
      console.error('Error updating shop settings:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour les paramètres de la boutique',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="general">Informations générales</TabsTrigger>
        <TabsTrigger value="payment">Paiement et livraison</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Informations de la boutique</CardTitle>
            <CardDescription>
              Modifiez les informations principales de votre boutique
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shop-name">Nom de la boutique</Label>
              <Input
                id="shop-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom de votre boutique"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shop-description">Description</Label>
              <Textarea
                id="shop-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez votre boutique"
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Image de la boutique</Label>
              <ImageUpload
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                onUploading={setImageUploading}
              />
            </div>
            
            <Button 
              onClick={handleShopInfoUpdate} 
              disabled={isLoading || imageUploading}
              className="mt-4"
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="payment">
        <Card>
          <CardHeader>
            <CardTitle>Méthodes de paiement</CardTitle>
            <CardDescription>
              Définissez les méthodes de paiement acceptées par votre boutique
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="payment-card" 
                  checked={acceptsCard}
                  onCheckedChange={(checked) => setAcceptsCard(!!checked)} 
                />
                <Label htmlFor="payment-card">Carte bancaire</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="payment-paypal" 
                  checked={acceptsPaypal}
                  onCheckedChange={(checked) => setAcceptsPaypal(!!checked)} 
                />
                <Label htmlFor="payment-paypal">PayPal</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="payment-bank" 
                  checked={acceptsBankTransfer}
                  onCheckedChange={(checked) => setAcceptsBankTransfer(!!checked)} 
                />
                <Label htmlFor="payment-bank">Virement bancaire</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="payment-cash" 
                  checked={acceptsCash}
                  onCheckedChange={(checked) => setAcceptsCash(!!checked)} 
                />
                <Label htmlFor="payment-cash">Espèces (en personne)</Label>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <CardTitle className="text-lg mb-2">Options de livraison</CardTitle>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="delivery-pickup" 
                    checked={offersPickup}
                    onCheckedChange={(checked) => setOffersPickup(!!checked)} 
                  />
                  <Label htmlFor="delivery-pickup">Retrait en personne</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="delivery-shipping" 
                    checked={offersDelivery}
                    onCheckedChange={(checked) => setOffersDelivery(!!checked)} 
                  />
                  <Label htmlFor="delivery-shipping">Livraison</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="delivery-both" 
                    checked={offersBoth}
                    onCheckedChange={(checked) => setOffersBoth(!!checked)} 
                  />
                  <Label htmlFor="delivery-both">Les deux options</Label>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Acceptation automatique des commandes</h3>
                  <p className="text-sm text-muted-foreground">
                    Les commandes seront automatiquement acceptées sans votre validation
                  </p>
                </div>
                <Switch
                  checked={autoAcceptOrders}
                  onCheckedChange={setAutoAcceptOrders}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleShopSettingsUpdate} 
              disabled={isLoading}
              className="mt-4"
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer les paramètres'}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres de notification</CardTitle>
            <CardDescription>
              Configurez vos préférences de notification pour votre boutique
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Notifications par email</h3>
                <p className="text-sm text-muted-foreground">
                  Recevez des emails pour les nouvelles commandes et mises à jour
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Notifications dans l'application</h3>
                <p className="text-sm text-muted-foreground">
                  Recevez des notifications dans l'application pour l'activité de votre boutique
                </p>
              </div>
              <Switch
                checked={appNotifications}
                onCheckedChange={setAppNotifications}
              />
            </div>
            
            <Button 
              onClick={handleShopSettingsUpdate} 
              disabled={isLoading}
              className="mt-4"
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer les préférences'}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ShopSettings;
