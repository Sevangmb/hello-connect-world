import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useShop } from '@/hooks/useShop';
import { useUserShop } from '@/hooks/useUserShop';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function ShopSettings() {
  const { toast } = useToast();
  const { data: shop, isLoading } = useUserShop();
  const { useUpdateShop } = useShop();
  
  const [name, setName] = useState(shop?.name || '');
  const [description, setDescription] = useState(shop?.description || '');
  const [phone, setPhone] = useState(shop?.phone || '');
  const [website, setWebsite] = useState(shop?.website || '');
  const [address, setAddress] = useState(shop?.address || '');
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyApp, setNotifyApp] = useState(true);
  
  const updateShopMutation = useUpdateShop();
  
  const handleSave = () => {
    if (!shop) return;
    
    updateShopMutation.mutate({ 
      id: shop.id,
      data: {
        name,
        description,
        phone,
        website,
        address,
        settings: {
          auto_accept_orders: autoAcceptOrders,
          notification_preferences: {
            email: notifyEmail,
            app: notifyApp
          }
        }
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Paramètres sauvegardés",
          description: "Les paramètres de votre boutique ont été mis à jour avec succès."
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de sauvegarder les paramètres. Veuillez réessayer."
        });
      }
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!shop) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-2">Aucune boutique trouvée</h2>
        <p className="text-muted-foreground">Vous devez créer une boutique avant de pouvoir modifier ses paramètres.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Paramètres de la boutique</h2>
        <p className="text-muted-foreground">
          Gérez les paramètres et les préférences de votre boutique.
        </p>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>
                Ces informations seront affichées publiquement sur votre page boutique.
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
                  placeholder="Description de votre boutique"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shop-phone">Téléphone</Label>
                <Input 
                  id="shop-phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="Numéro de téléphone"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shop-website">Site web</Label>
                <Input 
                  id="shop-website" 
                  value={website} 
                  onChange={(e) => setWebsite(e.target.value)} 
                  placeholder="Site web (optionnel)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shop-address">Adresse</Label>
                <Textarea 
                  id="shop-address" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="Adresse de votre boutique"
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={updateShopMutation.isPending}>
                {updateShopMutation.isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Sauvegarde...
                  </>
                ) : (
                  "Sauvegarder"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres des commandes</CardTitle>
              <CardDescription>
                Configurez la façon dont vous gérez les commandes entrantes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Méthodes de paiement acceptées</h3>
                <p className="text-sm text-muted-foreground">
                  Ces options seront configurées automatiquement en fonction de votre compte.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Options de livraison</h3>
                <p className="text-sm text-muted-foreground">
                  Les options de livraison seront configurées dans la section dédiée.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={updateShopMutation.isPending}>
                {updateShopMutation.isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Sauvegarde...
                  </>
                ) : (
                  "Sauvegarder"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>
                Configurez comment vous souhaitez être notifié des événements de votre boutique.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-email">Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications par email
                  </p>
                </div>
                <Switch
                  id="notify-email"
                  checked={notifyEmail}
                  onCheckedChange={setNotifyEmail}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-app">Notifications dans l'application</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications dans l'application
                  </p>
                </div>
                <Switch
                  id="notify-app"
                  checked={notifyApp}
                  onCheckedChange={setNotifyApp}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={updateShopMutation.isPending}>
                {updateShopMutation.isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Sauvegarde...
                  </>
                ) : (
                  "Sauvegarder"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
