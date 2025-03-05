
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useShop } from "@/hooks/useShop";
import { Shop, ShopSettings as ShopSettingsType } from "@/core/shop/domain/types";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import ImageUpload from "@/components/ui/image-upload";

interface ShopSettingsProps {
  shopId: string;
}

export function ShopSettings({ shopId }: ShopSettingsProps) {
  const { shop, isShopLoading, shopSettings, isShopSettingsLoading, updateShop, updateShopSettings } = useShop();
  const [shopInfo, setShopInfo] = useState<Partial<Shop>>({});
  const [settings, setSettings] = useState<Partial<ShopSettingsType>>({});
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Load shop data when component mounts
  useEffect(() => {
    if (shop && !isShopLoading) {
      setShopInfo({
        name: shop.name,
        description: shop.description,
        image_url: shop.image_url,
        phone: shop.phone,
        address: shop.address,
        website: shop.website
      });
    }
  }, [shop, isShopLoading]);

  // Load shop settings when component mounts
  useEffect(() => {
    if (shopSettings && !isShopSettingsLoading) {
      setSettings({
        payment_methods: shopSettings.payment_methods,
        delivery_options: shopSettings.delivery_options,
        auto_accept_orders: shopSettings.auto_accept_orders,
        notification_preferences: shopSettings.notification_preferences
      });
    }
  }, [shopSettings, isShopSettingsLoading]);

  // Handle shop info form changes
  const handleShopInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShopInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handle image change
  const handleImageChange = (url: string) => {
    setShopInfo(prev => ({ ...prev, image_url: url }));
  };

  // Handle settings form changes
  const handlePaymentMethodChange = (method: string, checked: boolean) => {
    setSettings(prev => {
      const methods = prev.payment_methods ? [...prev.payment_methods] : [];
      if (checked && !methods.includes(method)) {
        methods.push(method);
      } else if (!checked && methods.includes(method)) {
        const index = methods.indexOf(method);
        methods.splice(index, 1);
      }
      return { ...prev, payment_methods: methods };
    });
  };

  const handleDeliveryOptionChange = (option: string, checked: boolean) => {
    setSettings(prev => {
      const options = prev.delivery_options ? [...prev.delivery_options] : [];
      if (checked && !options.includes(option)) {
        options.push(option);
      } else if (!checked && options.includes(option)) {
        const index = options.indexOf(option);
        options.splice(index, 1);
      }
      return { ...prev, delivery_options: options };
    });
  };

  const handleAutoAcceptChange = (checked: boolean) => {
    setSettings(prev => ({ ...prev, auto_accept_orders: checked }));
  };

  const handleNotificationChange = (type: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      notification_preferences: {
        ...(prev.notification_preferences || { email: false, app: false }),
        [type]: checked
      }
    }));
  };

  // Submit handler for shop info form
  const handleShopInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;

    try {
      if (shopId) {
        await updateShop(shopId, shopInfo);
        
        toast({
          title: "Shop information updated",
          description: "Your shop information has been successfully updated.",
        });
      }
    } catch (error) {
      console.error("Error updating shop information:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update shop information. Please try again.",
      });
    }
  };

  // Submit handler for settings form
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (shopId && shopSettings) {
        await updateShopSettings(shopSettings.id, settings);
        
        toast({
          title: "Shop settings updated",
          description: "Your shop settings have been successfully updated.",
        });
      }
    } catch (error) {
      console.error("Error updating shop settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update shop settings. Please try again.",
      });
    }
  };

  if (isShopLoading || isShopSettingsLoading) {
    return <div>Loading shop settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="info">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Shop Information</TabsTrigger>
          <TabsTrigger value="settings">Shop Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Shop Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleShopInfoSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="image">Shop Image</Label>
                  <ImageUpload 
                    onChange={handleImageChange} 
                    defaultValue={shopInfo.image_url} 
                    onUploading={setUploading} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Shop Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={shopInfo.name || ""}
                    onChange={handleShopInfoChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Shop Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={shopInfo.description || ""}
                    onChange={handleShopInfoChange}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={shopInfo.phone || ""}
                    onChange={handleShopInfoChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={shopInfo.address || ""}
                    onChange={handleShopInfoChange}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={shopInfo.website || ""}
                    onChange={handleShopInfoChange}
                    type="url"
                    placeholder="https://example.com"
                  />
                </div>

                <Button type="submit" disabled={uploading}>
                  {uploading ? "Uploading image..." : "Save Information"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Shop Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSettingsSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Methods</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {["card", "paypal", "bank_transfer", "cash"].map(method => (
                      <div key={method} className="flex items-center space-x-2">
                        <Checkbox
                          id={`payment-${method}`}
                          checked={settings.payment_methods?.includes(method) || false}
                          onCheckedChange={(checked) => handlePaymentMethodChange(method, !!checked)}
                        />
                        <Label htmlFor={`payment-${method}`} className="capitalize">
                          {method.replace("_", " ")}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Delivery Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {["pickup", "delivery", "both"].map(option => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`delivery-${option}`}
                          checked={settings.delivery_options?.includes(option) || false}
                          onCheckedChange={(checked) => handleDeliveryOptionChange(option, !!checked)}
                        />
                        <Label htmlFor={`delivery-${option}`} className="capitalize">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Order Handling</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="auto-accept"
                      checked={settings.auto_accept_orders || false}
                      onCheckedChange={(checked) => handleAutoAcceptChange(!!checked)}
                    />
                    <Label htmlFor="auto-accept">Automatically accept orders</Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="notify-email"
                        checked={settings.notification_preferences?.email || false}
                        onCheckedChange={(checked) => handleNotificationChange("email", !!checked)}
                      />
                      <Label htmlFor="notify-email">Email notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="notify-app"
                        checked={settings.notification_preferences?.app || false}
                        onCheckedChange={(checked) => handleNotificationChange("app", !!checked)}
                      />
                      <Label htmlFor="notify-app">In-app notifications</Label>
                    </div>
                  </div>
                </div>

                <Button type="submit">Save Settings</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
