
import React, { useState } from "react";
import { Shop } from "@/core/shop/domain/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useShop } from "@/hooks/useShop";
import ImageUpload from "@/components/ui/image-upload";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

interface ShopSettingsProps {
  shop: Shop;
  onUpdate?: () => void;
}

export default function ShopSettings({ shop, onUpdate }: ShopSettingsProps) {
  const { updateShop } = useShop();
  const { toast } = useToast();
  const [name, setName] = useState(shop.name);
  const [description, setDescription] = useState(shop.description || "");
  const [imageUrl, setImageUrl] = useState(shop.image_url || "");
  const [address, setAddress] = useState(shop.address || "");
  const [phone, setPhone] = useState(shop.phone || "");
  const [website, setWebsite] = useState(shop.website || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Settings
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  
  // Payment methods
  const [acceptCard, setAcceptCard] = useState(true);
  const [acceptPaypal, setAcceptPaypal] = useState(true);
  const [acceptBankTransfer, setAcceptBankTransfer] = useState(false);
  const [acceptCash, setAcceptCash] = useState(false);
  
  // Delivery options
  const [offerPickup, setOfferPickup] = useState(true);
  const [offerDelivery, setOfferDelivery] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const updatedData = {
        name,
        description,
        image_url: imageUrl,
        address,
        phone,
        website,
      };
      
      await updateShop(shop.id, updatedData);
      
      toast({
        title: "Boutique mise à jour",
        description: "Les informations de votre boutique ont été mises à jour avec succès.",
      });
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error updating shop:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la boutique.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare payment methods array
    const paymentMethods = [];
    if (acceptCard) paymentMethods.push("card");
    if (acceptPaypal) paymentMethods.push("paypal");
    if (acceptBankTransfer) paymentMethods.push("bank_transfer");
    if (acceptCash) paymentMethods.push("cash");
    
    // Prepare delivery options array
    const deliveryOptions = [];
    if (offerPickup) deliveryOptions.push("pickup");
    if (offerDelivery) deliveryOptions.push("delivery");
    if (offerPickup && offerDelivery) deliveryOptions.push("both");
    
    // Prepare notification preferences
    const notificationPreferences = {
      email: emailNotifications,
      app: appNotifications
    };
    
    const settingsData = {
      auto_accept_orders: autoAcceptOrders,
      payment_methods: paymentMethods,
      delivery_options: deliveryOptions,
      notification_preferences: notificationPreferences
    };
    
    try {
      // Here we would save the settings
      // For now just show a toast
      toast({
        title: "Paramètres enregistrés",
        description: "Les paramètres de votre boutique ont été mis à jour.",
      });
    } catch (error) {
      console.error("Error updating shop settings:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des paramètres.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations de la boutique</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shop-image">Image de la boutique</Label>
              <ImageUpload
                onChange={setImageUrl}
                onUploading={setIsUploading}
                currentImageUrl={imageUrl}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shop-name">Nom de la boutique</Label>
              <Input
                id="shop-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shop-description">Description</Label>
              <Textarea
                id="shop-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shop-address">Adresse</Label>
              <Textarea
                id="shop-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shop-phone">Téléphone</Label>
                <Input
                  id="shop-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shop-website">Site web</Label>
                <Input
                  id="shop-website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={isUploading || isUpdating}
              className="w-full md:w-auto"
            >
              {isUpdating ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de la boutique</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSettingsSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Commandes</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-accept">Acceptation automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Accepter automatiquement les nouvelles commandes
                  </p>
                </div>
                <Switch
                  id="auto-accept"
                  checked={autoAcceptOrders}
                  onCheckedChange={setAutoAcceptOrders}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Modes de paiement</h3>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="payment-card" 
                    checked={acceptCard}
                    onCheckedChange={(checked) => setAcceptCard(!!checked)}
                  />
                  <Label htmlFor="payment-card">Carte bancaire</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="payment-paypal" 
                    checked={acceptPaypal}
                    onCheckedChange={(checked) => setAcceptPaypal(!!checked)}
                  />
                  <Label htmlFor="payment-paypal">PayPal</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="payment-bank" 
                    checked={acceptBankTransfer}
                    onCheckedChange={(checked) => setAcceptBankTransfer(!!checked)}
                  />
                  <Label htmlFor="payment-bank">Virement bancaire</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="payment-cash" 
                    checked={acceptCash}
                    onCheckedChange={(checked) => setAcceptCash(!!checked)}
                  />
                  <Label htmlFor="payment-cash">Espèces (en personne)</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Options de livraison</h3>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="delivery-pickup" 
                    checked={offerPickup}
                    onCheckedChange={(checked) => setOfferPickup(!!checked)}
                  />
                  <Label htmlFor="delivery-pickup">Retrait en personne</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="delivery-shipping" 
                    checked={offerDelivery}
                    onCheckedChange={(checked) => setOfferDelivery(!!checked)}
                  />
                  <Label htmlFor="delivery-shipping">Livraison</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notifications</h3>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="notify-email" 
                    checked={emailNotifications}
                    onCheckedChange={(checked) => setEmailNotifications(!!checked)}
                  />
                  <Label htmlFor="notify-email">Notifications par email</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="notify-app" 
                    checked={appNotifications}
                    onCheckedChange={(checked) => setAppNotifications(!!checked)}
                  />
                  <Label htmlFor="notify-app">Notifications dans l'application</Label>
                </div>
              </div>
            </div>
            
            <Button type="submit" className="w-full md:w-auto">
              Enregistrer les paramètres
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
