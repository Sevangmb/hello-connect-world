
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from '@/components/ui/image-upload';
import { Shop, ShopSettings as ShopSettingsType } from '@/core/shop/domain/types';
import { Skeleton } from '@/components/ui/skeleton';

interface ShopSettingsProps {
  shop: Shop;
}

const ShopSettings: React.FC<ShopSettingsProps> = ({ shop }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [shopInfo, setShopInfo] = useState<Partial<Shop>>({});
  const [settings, setSettings] = useState<Partial<ShopSettingsType>>({});
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Load shop settings
  useEffect(() => {
    const loadShopSettings = async () => {
      try {
        setIsLoading(true);
        
        // Initialize shop info from props
        setShopInfo({
          name: shop.name,
          description: shop.description,
          image_url: shop.image_url,
          phone: shop.phone,
          website: shop.website
        });
        
        setImageUrl(shop.image_url || '');
        
        // Get shop settings (this would be implemented in a real hook)
        // const settingsData = await getShopSettings(shop.id);
        const settingsData: Partial<ShopSettingsType> = {
          delivery_options: ['pickup', 'delivery'],
          payment_methods: ['card', 'paypal'],
          auto_accept_orders: true,
          notification_preferences: {
            email: true,
            app: true
          }
        };
        
        setSettings(settingsData);
      } catch (error) {
        console.error('Error loading shop settings:', error);
        toast({
          variant: "destructive",
          title: "Error loading settings",
          description: "There was a problem loading the shop settings."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadShopSettings();
  }, [shop.id, shop.name, shop.description, shop.image_url, shop.phone, shop.website]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle shop info form submission
  const handleShopInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // This would be implemented in a real hook
      // await updateShopInfo({ 
      //   id: shop.id,
      //   name: shopInfo.name,
      //   description: shopInfo.description,
      //   image_url: imageUrl,
      //   phone: shopInfo.phone,
      //   website: shopInfo.website
      // });
      
      toast({
        title: "Shop updated",
        description: "Your shop information has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating shop:', error);
      toast({
        variant: "destructive",
        title: "Error updating shop",
        description: "There was a problem updating your shop information."
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle shop settings form submission
  const handleShopSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // This would be implemented in a real hook
      // await updateShopSettings.mutateAsync({ 
      //   id: shop.id,
      //   settings
      // });
      
      toast({
        title: "Settings updated",
        description: "Your shop settings have been updated successfully."
      });
    } catch (error) {
      console.error('Error updating shop settings:', error);
      toast({
        variant: "destructive",
        title: "Error updating settings",
        description: "There was a problem updating your shop settings."
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle notification preferences change
  const handleNotificationChange = (type: 'email' | 'app', checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences!,
        [type]: checked
      }
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shop Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shop Settings</CardTitle>
        <CardDescription>
          Manage your shop information and settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="info">
          <TabsList className="mb-4">
            <TabsTrigger value="info">Shop Information</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info">
            <form onSubmit={handleShopInfoSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shop-logo">Shop Logo</Label>
                  <ImageUpload
                    onChange={(url) => setImageUrl(url)}
                    defaultImage={shop.image_url}
                    onUploading={setIsUploading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shop-name">Shop Name</Label>
                  <Input
                    id="shop-name"
                    value={shopInfo.name || ''}
                    onChange={(e) => setShopInfo({ ...shopInfo, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shop-description">Description</Label>
                  <Textarea
                    id="shop-description"
                    value={shopInfo.description || ''}
                    onChange={(e) => setShopInfo({ ...shopInfo, description: e.target.value })}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shop-phone">Phone (Optional)</Label>
                  <Input
                    id="shop-phone"
                    value={shopInfo.phone || ''}
                    onChange={(e) => setShopInfo({ ...shopInfo, phone: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shop-website">Website (Optional)</Label>
                  <Input
                    id="shop-website"
                    value={shopInfo.website || ''}
                    onChange={(e) => setShopInfo({ ...shopInfo, website: e.target.value })}
                    type="url"
                    placeholder="https://example.com"
                  />
                </div>
                
                <Button type="submit" disabled={isSaving || isUploading}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="settings">
            <form onSubmit={handleShopSettingsSubmit}>
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Delivery Options</h3>
                  <CheckboxGroup>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="pickup"
                        checked={settings.delivery_options?.includes('pickup')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSettings({
                              ...settings,
                              delivery_options: [...(settings.delivery_options || []), 'pickup']
                            });
                          } else {
                            setSettings({
                              ...settings,
                              delivery_options: settings.delivery_options?.filter(o => o !== 'pickup')
                            });
                          }
                        }}
                      />
                      <Label htmlFor="pickup">In-store Pickup</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="delivery"
                        checked={settings.delivery_options?.includes('delivery')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSettings({
                              ...settings,
                              delivery_options: [...(settings.delivery_options || []), 'delivery']
                            });
                          } else {
                            setSettings({
                              ...settings,
                              delivery_options: settings.delivery_options?.filter(o => o !== 'delivery')
                            });
                          }
                        }}
                      />
                      <Label htmlFor="delivery">Delivery</Label>
                    </div>
                  </CheckboxGroup>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Payment Methods</h3>
                  <CheckboxGroup>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="card"
                        checked={settings.payment_methods?.includes('card')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSettings({
                              ...settings,
                              payment_methods: [...(settings.payment_methods || []), 'card']
                            });
                          } else {
                            setSettings({
                              ...settings,
                              payment_methods: settings.payment_methods?.filter(m => m !== 'card')
                            });
                          }
                        }}
                      />
                      <Label htmlFor="card">Credit/Debit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="paypal"
                        checked={settings.payment_methods?.includes('paypal')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSettings({
                              ...settings,
                              payment_methods: [...(settings.payment_methods || []), 'paypal']
                            });
                          } else {
                            setSettings({
                              ...settings,
                              payment_methods: settings.payment_methods?.filter(m => m !== 'paypal')
                            });
                          }
                        }}
                      />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="bank_transfer"
                        checked={settings.payment_methods?.includes('bank_transfer')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSettings({
                              ...settings,
                              payment_methods: [...(settings.payment_methods || []), 'bank_transfer']
                            });
                          } else {
                            setSettings({
                              ...settings,
                              payment_methods: settings.payment_methods?.filter(m => m !== 'bank_transfer')
                            });
                          }
                        }}
                      />
                      <Label htmlFor="bank_transfer">Bank Transfer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="cash"
                        checked={settings.payment_methods?.includes('cash')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSettings({
                              ...settings,
                              payment_methods: [...(settings.payment_methods || []), 'cash']
                            });
                          } else {
                            setSettings({
                              ...settings,
                              payment_methods: settings.payment_methods?.filter(m => m !== 'cash')
                            });
                          }
                        }}
                      />
                      <Label htmlFor="cash">Cash</Label>
                    </div>
                  </CheckboxGroup>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Order Processing</h3>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-accept"
                      checked={settings.auto_accept_orders}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, auto_accept_orders: checked })
                      }
                    />
                    <Label htmlFor="auto-accept">Automatically accept orders</Label>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="email-notifications"
                      checked={settings.notification_preferences?.email}
                      onCheckedChange={(checked) => 
                        handleNotificationChange('email', checked)
                      }
                    />
                    <Label htmlFor="email-notifications">Email notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="app-notifications"
                      checked={settings.notification_preferences?.app}
                      onCheckedChange={(checked) => 
                        handleNotificationChange('app', checked)
                      }
                    />
                    <Label htmlFor="app-notifications">In-app notifications</Label>
                  </div>
                </div>
                
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ShopSettings;
