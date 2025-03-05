
import { useState, useEffect } from 'react';
import { useShop } from '@/hooks/useShop';
import { ShopSettings as ShopSettingsType } from '@/core/shop/domain/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ui/image-upload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShopSettingsProps {
  shopId: string;
}

export function ShopSettings({ shopId }: ShopSettingsProps) {
  const { shop, updateShop, getShopSettings, updateShopSettings } = useShop();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [address, setAddress] = useState('');
  const [settings, setSettings] = useState<ShopSettingsType | null>(null);
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (shop) {
      setName(shop.name || '');
      setDescription(shop.description || '');
      setImageUrl(shop.image_url || '');
      setAddress(shop.address || '');
    }
  }, [shop]);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const shopSettings = await getShopSettings(shopId);
        if (shopSettings) {
          setSettings(shopSettings);
          setAutoAcceptOrders(shopSettings.auto_accept_orders);
          setEmailNotifications(shopSettings.notification_preferences.email);
          setAppNotifications(shopSettings.notification_preferences.app);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchSettings();
    }
  }, [shopId, getShopSettings]);

  const handleUpdateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return;

    setIsUpdating(true);
    try {
      await updateShop.mutateAsync({
        id: shop.id,
        name,
        description,
        image_url: imageUrl,
        address
      });

      // Check if settings exists, update preferences
      if (settings) {
        await updateShopSettings.mutateAsync({
          id: settings.id,
          settings: {
            auto_accept_orders: autoAcceptOrders,
            notification_preferences: {
              email: emailNotifications,
              app: appNotifications
            }
          }
        });
      }

      toast({
        title: 'Paramètres mis à jour',
        description: 'Les paramètres de votre boutique ont été mis à jour',
      });
    } catch (error) {
      console.error('Error updating shop settings:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour les paramètres',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleUpdateShop} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
          <CardDescription>Mettez à jour les informations de votre boutique</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de la boutique</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom de votre boutique"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre boutique"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Adresse de votre boutique"
            />
          </div>
          <div>
            <Label>Image de la boutique</Label>
            <ImageUpload
              onImageUploaded={setImageUrl}
              onUploading={setIsUploading}
              bucket="shop-images"
              folder="shops"
              currentImageUrl={imageUrl}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Préférences</CardTitle>
          <CardDescription>Configurez les options de votre boutique</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Acceptation automatique des commandes</h4>
              <p className="text-sm text-muted-foreground">Les commandes seront automatiquement acceptées</p>
            </div>
            <Switch
              checked={autoAcceptOrders}
              onCheckedChange={setAutoAcceptOrders}
            />
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Notifications</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
                <Label htmlFor="email-notifications">Notifications par email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="app-notifications"
                  checked={appNotifications}
                  onCheckedChange={setAppNotifications}
                />
                <Label htmlFor="app-notifications">Notifications dans l'application</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        disabled={isUpdating || isUploading}
        className="w-full"
      >
        {isUpdating ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Mise à jour en cours...
          </>
        ) : (
          "Enregistrer les modifications"
        )}
      </Button>
    </form>
  );
}
