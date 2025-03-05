
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { PaymentMethod, DeliveryOption, ShopSettings as ShopSettingsType } from '@/core/shop/domain/types';
import { useShop } from '@/hooks/useShop';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { toast } from 'sonner';

interface ShopSettingsProps {
  shopId: string;
}

export const ShopSettings: React.FC<ShopSettingsProps> = ({ shopId }) => {
  const { shop, updateShop, refetchShop } = useShop();
  const [name, setName] = useState(shop?.name || '');
  const [description, setDescription] = useState(shop?.description || '');
  const [imageUrl, setImageUrl] = useState(shop?.image_url || '');
  const [address, setAddress] = useState(shop?.address || '');
  const [phone, setPhone] = useState(shop?.phone || '');
  const [website, setWebsite] = useState(shop?.website || '');
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState<ShopSettingsType | null>(null);
  const [loading, setLoading] = useState(false);
  const shopService = getShopService();

  // Payment methods checkboxes
  const [acceptCard, setAcceptCard] = useState(false);
  const [acceptPaypal, setAcceptPaypal] = useState(false);
  const [acceptBankTransfer, setAcceptBankTransfer] = useState(false);
  const [acceptCash, setAcceptCash] = useState(false);

  // Delivery options
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('both');
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);

  useEffect(() => {
    if (shop) {
      setName(shop.name || '');
      setDescription(shop.description || '');
      setImageUrl(shop.image_url || '');
      setAddress(shop.address || '');
      setPhone(shop.phone || '');
      setWebsite(shop.website || '');
    }
  }, [shop]);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!shopId) return;
      
      setLoading(true);
      try {
        const shopSettings = await shopService.getShopSettings(shopId);
        if (shopSettings) {
          setSettings(shopSettings);
          
          // Set payment methods
          setAcceptCard(shopSettings.payment_methods.includes('card'));
          setAcceptPaypal(shopSettings.payment_methods.includes('paypal'));
          setAcceptBankTransfer(shopSettings.payment_methods.includes('bank_transfer'));
          setAcceptCash(shopSettings.payment_methods.includes('cash'));
          
          // Set delivery option
          if (shopSettings.delivery_options.length > 0) {
            setDeliveryOption(shopSettings.delivery_options[0] as DeliveryOption);
          }
          
          // Set auto accept
          setAutoAcceptOrders(shopSettings.auto_accept_orders);
          
          // Set notification preferences
          setEmailNotifications(shopSettings.notification_preferences.email);
          setAppNotifications(shopSettings.notification_preferences.app);
        }
      } catch (error) {
        console.error('Error fetching shop settings:', error);
        toast.error('Unable to load shop settings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [shopId, shopService]);

  const handleUpdateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shopId || !shop) return;
    
    // Update shop details
    updateShop.mutate({
      id: shopId,
      name,
      description,
      image_url: imageUrl,
      address,
      phone,
      website
    });
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shopId) return;
    
    // Collect payment methods
    const paymentMethods: PaymentMethod[] = [];
    if (acceptCard) paymentMethods.push('card');
    if (acceptPaypal) paymentMethods.push('paypal');
    if (acceptBankTransfer) paymentMethods.push('bank_transfer');
    if (acceptCash) paymentMethods.push('cash');
    
    try {
      await shopService.updateShopSettings(shopId, {
        payment_methods: paymentMethods,
        delivery_options: [deliveryOption],
        auto_accept_orders: autoAcceptOrders,
        notification_preferences: {
          email: emailNotifications,
          app: appNotifications
        }
      });
      
      toast.success('Shop settings updated successfully');
    } catch (error) {
      console.error('Error updating shop settings:', error);
      toast.error('Failed to update shop settings');
    }
  };

  if (loading) {
    return <div>Loading shop settings...</div>;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Shop Information</CardTitle>
          <CardDescription>Manage your shop's basic information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateShop} className="space-y-4">
            <div>
              <Label htmlFor="name">Shop Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Shop name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Describe your shop"
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="image">Shop Image</Label>
              <ImageUpload
                onChange={setImageUrl}
                onUploading={setUploading}
                currentImageUrl={imageUrl}
              />
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Shop address"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Contact phone"
                type="tel"
              />
            </div>
            
            <div>
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website" 
                value={website} 
                onChange={(e) => setWebsite(e.target.value)} 
                placeholder="Your website"
                type="url"
              />
            </div>
            
            <Button type="submit" disabled={uploading || updateShop.isPending}>
              {updateShop.isPending ? 'Updating...' : 'Update Shop Info'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Shop Settings</CardTitle>
          <CardDescription>Configure how your shop operates</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateSettings} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Payment Methods</h3>
              <p className="text-sm text-gray-500 mb-2">Select which payment methods you accept</p>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="card" 
                    checked={acceptCard} 
                    onCheckedChange={(checked) => setAcceptCard(checked === true)}
                  />
                  <Label htmlFor="card">Credit/Debit Card</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="paypal" 
                    checked={acceptPaypal} 
                    onCheckedChange={(checked) => setAcceptPaypal(checked === true)}
                  />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="bank" 
                    checked={acceptBankTransfer} 
                    onCheckedChange={(checked) => setAcceptBankTransfer(checked === true)}
                  />
                  <Label htmlFor="bank">Bank Transfer</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="cash" 
                    checked={acceptCash} 
                    onCheckedChange={(checked) => setAcceptCash(checked === true)}
                  />
                  <Label htmlFor="cash">Cash</Label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Delivery Options</h3>
              <p className="text-sm text-gray-500 mb-2">How do you want to fulfill orders?</p>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="pickup" 
                    name="delivery" 
                    value="pickup"
                    checked={deliveryOption === 'pickup'}
                    onChange={() => setDeliveryOption('pickup')}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="pickup">Customer Pickup Only</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="delivery" 
                    name="delivery" 
                    value="delivery"
                    checked={deliveryOption === 'delivery'}
                    onChange={() => setDeliveryOption('delivery')}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="delivery">Delivery Only</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="both" 
                    name="delivery" 
                    value="both"
                    checked={deliveryOption === 'both'}
                    onChange={() => setDeliveryOption('both')}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="both">Both Options</Label>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="auto-accept" 
                  checked={autoAcceptOrders} 
                  onCheckedChange={(checked) => setAutoAcceptOrders(checked === true)}
                />
                <div>
                  <Label htmlFor="auto-accept">Auto-accept Orders</Label>
                  <p className="text-sm text-gray-500">Orders will be automatically confirmed when placed</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Notification Preferences</h3>
              <p className="text-sm text-gray-500 mb-2">How do you want to be notified?</p>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="email-notif" 
                    checked={emailNotifications} 
                    onCheckedChange={(checked) => setEmailNotifications(checked === true)}
                  />
                  <Label htmlFor="email-notif">Email Notifications</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="app-notif" 
                    checked={appNotifications} 
                    onCheckedChange={(checked) => setAppNotifications(checked === true)}
                  />
                  <Label htmlFor="app-notif">In-App Notifications</Label>
                </div>
              </div>
            </div>
            
            <Button type="submit">Save Settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
