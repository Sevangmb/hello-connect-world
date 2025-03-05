
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useShop } from '@/hooks/useShop';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShopItemsList } from './ShopItemsList';
import { ShopOrdersList } from './ShopOrdersList';
import { ShopReviewsList } from './ShopReviewsList';
import { ShopSettings } from './ShopSettings';
import { AddItemForm } from './AddItemForm';
import { ShopStatus } from '@/core/shop/domain/types';
import { AlertCircle, Package, Settings, ShoppingBag, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function ShopDashboard() {
  const { shop, isShopLoading, updateShopStatus, isCurrentUserShopOwner } = useShop();
  const [isAddingItem, setIsAddingItem] = useState(false);

  if (isShopLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <Alert variant="default" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Aucune boutique</AlertTitle>
        <AlertDescription>
          Vous n'avez pas encore de boutique. Créez une boutique pour commencer à vendre.
        </AlertDescription>
      </Alert>
    );
  }

  const handleStatusUpdate = (status: ShopStatus) => {
    updateShopStatus.mutate({ id: shop.id, status });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{shop.name}</CardTitle>
              <CardDescription>{shop.description}</CardDescription>
            </div>
            {isCurrentUserShopOwner && shop.status === 'pending' && (
              <div className="space-x-2">
                <Button 
                  variant="secondary" 
                  onClick={() => handleStatusUpdate('inactive')}
                  disabled={updateShopStatus.isPending}
                >
                  Mettre en pause
                </Button>
              </div>
            )}
            {isCurrentUserShopOwner && shop.status === 'inactive' && (
              <Button 
                variant="secondary" 
                onClick={() => handleStatusUpdate('pending')}
                disabled={updateShopStatus.isPending}
              >
                Activer
              </Button>
            )}
          </div>
          <div className="flex items-center mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              shop.status === 'approved' ? 'bg-green-100 text-green-800' :
              shop.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              shop.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {shop.status === 'approved' ? 'Approuvée' :
               shop.status === 'pending' ? 'En attente' :
               shop.status === 'rejected' ? 'Rejetée' :
               shop.status === 'inactive' ? 'Inactive' :
               shop.status === 'suspended' ? 'Suspendue' : shop.status}
            </span>
            {shop.average_rating > 0 && (
              <div className="ml-4 flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>{shop.average_rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="items">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="items" className="flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Commandes
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center">
            <Star className="h-4 w-4 mr-2" />
            Avis
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="items">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Articles</CardTitle>
                <CardDescription>Gérez les articles de votre boutique</CardDescription>
              </div>
              {isCurrentUserShopOwner && (
                <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
                  <DialogTrigger asChild>
                    <Button>Ajouter un article</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un nouvel article</DialogTitle>
                    </DialogHeader>
                    <AddItemForm 
                      shopId={shop.id} 
                      onSuccess={() => setIsAddingItem(false)} 
                    />
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              <ShopItemsList 
                shopId={shop.id} 
                isOwner={isCurrentUserShopOwner} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Commandes</CardTitle>
              <CardDescription>Gérez les commandes de votre boutique</CardDescription>
            </CardHeader>
            <CardContent>
              <ShopOrdersList shopId={shop.id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Avis</CardTitle>
              <CardDescription>Consultez les avis sur votre boutique</CardDescription>
            </CardHeader>
            <CardContent>
              <ShopReviewsList shopId={shop.id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
              <CardDescription>Gérez les paramètres de votre boutique</CardDescription>
            </CardHeader>
            <CardContent>
              <ShopSettings shopId={shop.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
