
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Package, ShoppingBag, Star, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useShop } from '@/hooks/useShop';
import { useAuth } from '@/hooks/useAuth';
import { CreateShopForm } from './CreateShopForm';
import { ShopSettings } from './ShopSettings';
import { AddItemForm } from './AddItemForm';
import { ShopItemsList } from './ShopItemsList';
import { ShopOrdersList } from './ShopOrdersList';
import { ShopReviewsList } from './ShopReviewsList';

export function ShopDashboard() {
  const { user } = useAuth();
  const { shop, isShopLoading, error, isCurrentUserShopOwner } = useShop(user?.id || null);
  const [activeTab, setActiveTab] = useState('general');
  
  if (isShopLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement...</CardTitle>
          <CardDescription>Récupération des données de votre boutique</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erreur</CardTitle>
          <CardDescription>Un problème est survenu</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  if (!shop && isCurrentUserShopOwner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Créer votre boutique</CardTitle>
          <CardDescription>
            Vous n'avez pas encore de boutique. Créez-en une pour commencer à vendre.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateShopForm />
        </CardContent>
      </Card>
    );
  }
  
  if (!shop) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aucune boutique</CardTitle>
          <CardDescription>
            Cet utilisateur n'a pas encore de boutique.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="border shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle className="flex items-center">
              {shop.name}
              <Badge className="ml-2" variant={
                shop.status === 'approved' ? 'default' :
                shop.status === 'pending' ? 'secondary' :
                'destructive'
              }>
                {shop.status === 'approved' ? 'Approuvée' : 
                 shop.status === 'pending' ? 'En attente' : 
                 shop.status === 'rejected' ? 'Rejetée' : 'Suspendue'}
              </Badge>
            </CardTitle>
            <CardDescription>{shop.description}</CardDescription>
          </div>
          {isCurrentUserShopOwner && shop.status === 'approved' && (
            <Button size="sm" className="bg-primary">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Ajouter un article
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {shop.status === 'pending' && (
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertTitle className="text-yellow-600">Boutique en attente d'approbation</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Votre demande de création de boutique est en cours d'examen par notre équipe. 
              Vous recevrez une notification dès qu'elle sera approuvée.
            </AlertDescription>
          </Alert>
        )}
        
        {shop.status === 'rejected' && (
          <Alert className="mb-4 bg-red-50 border-red-200" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Boutique rejetée</AlertTitle>
            <AlertDescription>
              Votre demande de création de boutique a été rejetée. 
              Veuillez contacter notre service client pour plus d'informations.
            </AlertDescription>
          </Alert>
        )}
        
        {isCurrentUserShopOwner && shop.status === 'approved' && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="general">
                <Package className="h-4 w-4 mr-2" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="orders">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Commandes
              </TabsTrigger>
              <TabsTrigger value="reviews">
                <Star className="h-4 w-4 mr-2" />
                Avis
              </TabsTrigger>
              <TabsTrigger value="settings">
                <SettingsIcon className="h-4 w-4 mr-2" />
                Paramètres
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <ShopItemsList shopId={shop.id} isOwner={isCurrentUserShopOwner} />
              <div className="mt-6">
                <AddItemForm shopId={shop.id} />
              </div>
            </TabsContent>
            
            <TabsContent value="orders">
              <ShopOrdersList shopId={shop.id} />
            </TabsContent>
            
            <TabsContent value="reviews">
              <ShopReviewsList shopId={shop.id} />
            </TabsContent>
            
            <TabsContent value="settings">
              <ShopSettings shopId={shop.id} />
            </TabsContent>
          </Tabs>
        )}
        
        {(!isCurrentUserShopOwner || shop.status !== 'approved') && (
          <ShopItemsList shopId={shop.id} isOwner={isCurrentUserShopOwner} />
        )}
      </CardContent>
    </Card>
  );
}
