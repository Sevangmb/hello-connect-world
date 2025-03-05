import React, { useState, useEffect } from 'react';
import { useShop } from '@/hooks/useShop';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import ImageUpload from '@/components/ui/image-upload';
import { toast } from '@/hooks/use-toast';
import { PaymentMethod, DeliveryOption, ShopSettings as ShopSettingsType } from '@/core/shop/domain/types';

export function ShopSettings({ shopId }: { shopId: string }) {
  const { 
    shop, 
    isShopLoading, 
    updateShopInfo,
    updateShopSettings,
    getShopSettings
  } = useShop();

  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Load shop data
  useEffect(() => {
    if (shop) {
      setName(shop.name);
      setDescription(shop.description || '');
      setImageUrl(shop.image_url || '');
    }
  }, [shop]);

  // Load shop settings
  useEffect(() => {
    const loadSettings = async () => {
      if (!shopId) return;
      
      setSettingsLoading(true);
      try {
        const settings = await getShopSettings(shopId);
        if (settings) {
          setDeliveryOptions(settings.delivery_options || []);
          setPaymentMethods(settings.payment_methods || []);
          setAutoAcceptOrders(settings.auto_accept_orders || false);
          setEmailNotifications(settings.notification_preferences?.email || true);
          setAppNotifications(settings.notification_preferences?.app || true);
        }
      } catch (error) {
        console.error('Error loading shop settings:', error);
      } finally {
        setSettingsLoading(false);
      }
    };
    
    loadSettings();
  }, [shopId, getShopSettings]);

  // Payment methods handlers
  const handlePaymentMethodChange = (method: PaymentMethod, checked: boolean) => {
    if (checked) {
      setPaymentMethods(prev => [...prev, method]);
    } else {
      setPaymentMethods(prev => prev.filter(m => m !== method));
    }
  };

  const isPaymentMethodSelected = (method: PaymentMethod) => {
    return paymentMethods.includes(method);
  };

  // Delivery options handlers
  const handleDeliveryOptionChange = (option: DeliveryOption, checked: boolean) => {
    if (checked) {
      setDeliveryOptions(prev => [...prev, option]);
    } else {
      setDeliveryOptions(prev => prev.filter(o => o !== option));
    }
  };

  const isDeliveryOptionSelected = (option: DeliveryOption) => {
    return deliveryOptions.includes(option);
  };

  // Save shop info
  const handleSaveShopInfo = async () => {
    if (!shop) return;
    
    setIsLoading(true);
    try {
      const success = await updateShopInfo({
        id: shop.id,
        name,
        description,
        image_url: imageUrl
      });
      
      if (success) {
        toast({
          title: 'Shop updated',
          description: 'Your shop information has been updated successfully.'
        });
      }
    } catch (error) {
      console.error('Error updating shop:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update shop information.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save shop settings
  const handleSaveSettings = async () => {
    if (!shop) return;
    
    setSettingsLoading(true);
    try {
      const settings: Partial<ShopSettingsType> = {
        delivery_options: deliveryOptions,
        payment_methods: paymentMethods,
        auto_accept_orders: autoAcceptOrders,
        notification_preferences: {
          email: emailNotifications,
          app: appNotifications
        }
      };
      
      const success = await updateShopSettings({
        id: shop.id,
        settings
      });
      
      if (success) {
        toast({
          title: 'Settings updated',
          description: 'Your shop settings have been updated successfully.'
        });
      }
    } catch (error) {
      console.error('Error updating shop settings:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update shop settings.'
      });
    } finally {
      setSettingsLoading(false);
    }
  };

  if (isShopLoading) {
    return <div>Loading shop settings...</div>;
  }

  if (!shop) {
    return <div>Shop not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Shop Information */}
      <Card>
        <CardHeader>
          <CardTitle>Shop Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="shopName">Shop Name</Label>
            <Input 
              id="shopName" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter shop name"
            />
          </div>
          
          <div>
            <Label htmlFor="shopDescription">Description</Label>
            <Textarea 
              id="shopDescription" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter shop description"
              rows={3}
            />
          </div>
          
          <div>
            <Label>Shop Image</Label>
            <div className="mt-2">
              <ImageUpload
                onChange={(url) => setImageUrl(url)}
                currentImageUrl={imageUrl}
                onUploading={setIsUploading}
                bucket="shops"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleSaveShopInfo} 
            disabled={isLoading || isUploading}
          >
            {isLoading ? 'Saving...' : 'Save Information'}
          </Button>
        </CardContent>
      </Card>
      
      {/* Shop Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Shop Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Methods */}
          <div>
            <h3 className="text-lg font-medium mb-2">Payment Methods</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="payment-card" 
                  checked={isPaymentMethodSelected('card')}
                  onCheckedChange={(checked) => handlePaymentMethodChange('card', checked === true)}
                />
                <Label htmlFor="payment-card">Credit/Debit Card</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="payment-paypal" 
                  checked={isPaymentMethodSelected('paypal')}
                  onCheckedChange={(checked) => handlePaymentMethodChange('paypal', checked === true)}
                />
                <Label htmlFor="payment-paypal">PayPal</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="payment-bank" 
                  checked={isPaymentMethodSelected('bank_transfer')}
                  onCheckedChange={(checked) => handlePaymentMethodChange('bank_transfer', checked === true)}
                />
                <Label htmlFor="payment-bank">Bank Transfer</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="payment-cash" 
                  checked={isPaymentMethodSelected('cash')}
                  onCheckedChange={(checked) => handlePaymentMethodChange('cash', checked === true)}
                />
                <Label htmlFor="payment-cash">Cash on Delivery</Label>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Delivery Options */}
          <div>
            <h3 className="text-lg font-medium mb-2">Delivery Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="delivery-pickup" 
                  checked={isDeliveryOptionSelected('pickup')}
                  onCheckedChange={(checked) => handleDeliveryOptionChange('pickup', checked === true)}
                />
                <Label htmlFor="delivery-pickup">Pickup</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="delivery-delivery" 
                  checked={isDeliveryOptionSelected('delivery')}
                  onCheckedChange={(checked) => handleDeliveryOptionChange('delivery', checked === true)}
                />
                <Label htmlFor="delivery-delivery">Home Delivery</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="delivery-both" 
                  checked={isDeliveryOptionSelected('both')}
                  onCheckedChange={(checked) => handleDeliveryOptionChange('both', checked === true)}
                />
                <Label htmlFor="delivery-both">Both Options</Label>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Other Settings */}
          <div>
            <h3 className="text-lg font-medium mb-2">Other Settings</h3>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <Label htmlFor="auto-accept">Auto-Accept Orders</Label>
                <p className="text-sm text-gray-500">Automatically accept new orders</p>
              </div>
              <Switch 
                id="auto-accept" 
                checked={autoAcceptOrders}
                onCheckedChange={setAutoAcceptOrders}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive order notifications via email</p>
              </div>
              <Switch 
                id="email-notifications" 
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <Label htmlFor="app-notifications">App Notifications</Label>
                <p className="text-sm text-gray-500">Receive order notifications in the app</p>
              </div>
              <Switch 
                id="app-notifications" 
                checked={appNotifications}
                onCheckedChange={setAppNotifications}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleSaveSettings} 
            disabled={settingsLoading}
          >
            {settingsLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
