import React from 'react';
import { useShop } from '@/hooks/useShop';
import { ImageUpload } from '@/components/ui/image-upload';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { DeliveryOption, PaymentMethod, Shop, ShopSettings as ShopSettingsType } from '@/core/shop/domain/types';

export interface ShopSettingsProps {
  shopId: string;
}

export default function ShopSettings({ shopId }: ShopSettingsProps) {
  const { toast } = useToast();
  const [shopName, setShopName] = React.useState('');
  const [shopDescription, setShopDescription] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);
  const [isGeneralInfoSaving, setIsGeneralInfoSaving] = React.useState(false);
  const [isPreferencesSaving, setIsPreferencesSaving] = React.useState(false);
  
  // Payment methods state
  const [acceptsCard, setAcceptsCard] = React.useState(false);
  const [acceptsPaypal, setAcceptsPaypal] = React.useState(false);
  const [acceptsBankTransfer, setAcceptsBankTransfer] = React.useState(false);
  const [acceptsCash, setAcceptsCash] = React.useState(false);
  
  // Delivery options state
  const [offersPickup, setOffersPickup] = React.useState(false);
  const [offersDelivery, setOffersDelivery] = React.useState(false);
  
  // Other settings
  const [autoAcceptOrders, setAutoAcceptOrders] = React.useState(false);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [appNotifications, setAppNotifications] = React.useState(true);

  // Mock implementation for the shop hooks
  const { shop, isShopLoading } = useShop();
  
  const updateShopInfo = async (id: string, data: Partial<Shop>) => {
    // Mock implementation
    return { id: '123', ...data } as Shop;
  };
  
  const shopSettings: ShopSettingsType = {
    id: '123',
    shop_id: shopId,
    delivery_options: ['pickup', 'delivery'],
    payment_methods: ['card', 'paypal'],
    auto_accept_orders: false,
    notification_preferences: {
      email: true,
      app: true
    },
    created_at: '',
    updated_at: ''
  };
  
  const isShopSettingsLoading = false;
  
  const getShopSettings = async (shopId: string) => {
    // Mock implementation
    return shopSettings;
  };
  
  const updateShopSettings = async (shopId: string, data: Partial<ShopSettingsType>) => {
    // Mock implementation
    return true;
  };

  // Load shop data
  React.useEffect(() => {
    if (shop) {
      setShopName(shop.name);
      setShopDescription(shop.description);
      setImageUrl(shop.image_url || '');
    }
  }, [shop]);

  // Load shop settings
  React.useEffect(() => {
    const loadShopSettings = async () => {
      try {
        const settings = await getShopSettings(shopId);
        
        // Set payment methods
        setAcceptsCard(settings.payment_methods.includes('card' as PaymentMethod));
        setAcceptsPaypal(settings.payment_methods.includes('paypal' as PaymentMethod));
        setAcceptsBankTransfer(settings.payment_methods.includes('bank_transfer' as PaymentMethod));
        setAcceptsCash(settings.payment_methods.includes('cash' as PaymentMethod));
        
        // Set delivery options
        setOffersPickup(settings.delivery_options.includes('pickup' as DeliveryOption));
        setOffersDelivery(settings.delivery_options.includes('delivery' as DeliveryOption));
        
        // Set other settings
        setAutoAcceptOrders(settings.auto_accept_orders);
        setEmailNotifications(settings.notification_preferences.email);
        setAppNotifications(settings.notification_preferences.app);
      } catch (error) {
        console.error('Error loading shop settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load shop settings',
          variant: 'destructive',
        });
      }
    };

    if (shopId) {
      loadShopSettings();
    }
  }, [shopId, toast]);

  const handleSaveGeneralInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneralInfoSaving(true);

    try {
      const result = await updateShopInfo(shopId, {
        name: shopName,
        description: shopDescription,
        image_url: imageUrl,
      });

      if (result) {
        toast({
          title: 'Settings updated',
          description: 'Shop information has been updated successfully',
        });
      }
    } catch (error) {
      console.error('Error updating shop info:', error);
      toast({
        title: 'Error',
        description: 'Failed to update shop information',
        variant: 'destructive',
      });
    } finally {
      setIsGeneralInfoSaving(false);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPreferencesSaving(true);

    try {
      // Build payment methods array
      const paymentMethods: PaymentMethod[] = [];
      if (acceptsCard) paymentMethods.push('card' as PaymentMethod);
      if (acceptsPaypal) paymentMethods.push('paypal' as PaymentMethod);
      if (acceptsBankTransfer) paymentMethods.push('bank_transfer' as PaymentMethod);
      if (acceptsCash) paymentMethods.push('cash' as PaymentMethod);

      // Build delivery options array
      const deliveryOptions: DeliveryOption[] = [];
      if (offersPickup) deliveryOptions.push('pickup' as DeliveryOption);
      if (offersDelivery) deliveryOptions.push('delivery' as DeliveryOption);

      const success = await updateShopSettings(shopId, {
        payment_methods: paymentMethods,
        delivery_options: deliveryOptions,
        auto_accept_orders: autoAcceptOrders,
        notification_preferences: {
          email: emailNotifications,
          app: appNotifications,
        },
      });

      if (success) {
        toast({
          title: 'Preferences updated',
          description: 'Shop preferences have been updated successfully',
        });
      }
    } catch (error) {
      console.error('Error updating shop preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to update shop preferences',
        variant: 'destructive',
      });
    } finally {
      setIsPreferencesSaving(false);
    }
  };

  if (isShopLoading || isShopSettingsLoading) {
    return <div>Loading shop settings...</div>;
  }

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold">Shop Settings</h3>

      {/* General Information */}
      <div className="space-y-4">
        <h4 className="text-md font-medium">General Information</h4>
        <form onSubmit={handleSaveGeneralInfo} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Shop Image</label>
            <ImageUpload 
              value={imageUrl}
              onChange={(value) => setImageUrl(value)}
              onUploading={setIsUploading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="shopName" className="block text-sm font-medium">
              Shop Name
            </label>
            <input
              id="shopName"
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="shopDescription" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="shopDescription"
              value={shopDescription}
              onChange={(e) => setShopDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows={4}
            ></textarea>
          </div>

          <Button type="submit" disabled={isUploading || isGeneralInfoSaving}>
            {isGeneralInfoSaving ? 'Saving...' : 'Save Information'}
          </Button>
        </form>
      </div>

      {/* Shop Preferences */}
      <div className="space-y-4">
        <h4 className="text-md font-medium">Shop Preferences</h4>
        <form onSubmit={handleSavePreferences} className="space-y-6">
          {/* Payment Methods */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Payment Methods</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="acceptsCard"
                  checked={acceptsCard}
                  onChange={(e) => setAcceptsCard(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="acceptsCard" className="text-sm">
                  Credit/Debit Card
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="acceptsPaypal"
                  checked={acceptsPaypal}
                  onChange={(e) => setAcceptsPaypal(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="acceptsPaypal" className="text-sm">
                  PayPal
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="acceptsBankTransfer"
                  checked={acceptsBankTransfer}
                  onChange={(e) => setAcceptsBankTransfer(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="acceptsBankTransfer" className="text-sm">
                  Bank Transfer
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="acceptsCash"
                  checked={acceptsCash}
                  onChange={(e) => setAcceptsCash(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="acceptsCash" className="text-sm">
                  Cash on Delivery/Pickup
                </label>
              </div>
            </div>
          </div>

          {/* Delivery Options */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Delivery Options</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="offersPickup"
                  checked={offersPickup}
                  onChange={(e) => setOffersPickup(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="offersPickup" className="text-sm">
                  Customer Pickup
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="offersDelivery"
                  checked={offersDelivery}
                  onChange={(e) => setOffersDelivery(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="offersDelivery" className="text-sm">
                  Home Delivery
                </label>
              </div>
            </div>
          </div>

          {/* Other Settings */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Order Processing</h5>
            <div className="flex items-center space-x-2">
              <Switch
                checked={autoAcceptOrders}
                onCheckedChange={setAutoAcceptOrders}
                id="auto-accept"
              />
              <label htmlFor="auto-accept" className="text-sm">
                Automatically accept orders
              </label>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Notification Preferences</h5>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  id="email-notifications"
                />
                <label htmlFor="email-notifications" className="text-sm">
                  Email notifications
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={appNotifications}
                  onCheckedChange={setAppNotifications}
                  id="app-notifications"
                />
                <label htmlFor="app-notifications" className="text-sm">
                  In-app notifications
                </label>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isPreferencesSaving}>
            {isPreferencesSaving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </form>
      </div>
    </div>
  );
}

// Fix for correct imports in parent files
export { default as ShopSettings } from './ShopSettings';
