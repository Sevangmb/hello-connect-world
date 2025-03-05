
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AddItemForm } from './AddItemForm';
import { ShopItemsList } from './ShopItemsList';
import { ShopOrdersList } from './ShopOrdersList';
import { ShopReviewsList } from './ShopReviewsList';
import { ShopSettings } from './ShopSettings';
import { useShop } from '@/hooks/useShop';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export function ShopDashboard() {
  const { shopId } = useParams<{ shopId: string }>();
  const { shop, isShopLoading, shopError, isCurrentUserShopOwner } = useShop(shopId);
  const [showAddItemForm, setShowAddItemForm] = useState(false);

  if (isShopLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (shopError || !shop) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Boutique non trouvée</h2>
        <p className="text-muted-foreground">
          Cette boutique n'existe pas ou a été supprimée.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl">{shop.name}</CardTitle>
              <CardDescription className="mt-2">{shop.description}</CardDescription>
            </div>
            {isCurrentUserShopOwner && (
              <Button 
                onClick={() => setShowAddItemForm(prev => !prev)}
                className="mt-4 sm:mt-0"
              >
                {showAddItemForm ? 'Annuler' : 'Ajouter un article'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showAddItemForm && isCurrentUserShopOwner && (
            <div className="mb-6">
              <AddItemForm 
                shopId={shop.id} 
                onSuccess={() => setShowAddItemForm(false)}
                onCancel={() => setShowAddItemForm(false)}
              />
            </div>
          )}
          
          <Tabs defaultValue="items">
            <TabsList className="mb-6">
              <TabsTrigger value="items">Articles</TabsTrigger>
              {isCurrentUserShopOwner && (
                <>
                  <TabsTrigger value="orders">Commandes</TabsTrigger>
                  <TabsTrigger value="settings">Paramètres</TabsTrigger>
                </>
              )}
              <TabsTrigger value="reviews">Avis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="items">
              <ShopItemsList 
                shopId={shop.id} 
                isOwner={isCurrentUserShopOwner}
              />
            </TabsContent>
            
            {isCurrentUserShopOwner && (
              <>
                <TabsContent value="orders">
                  <ShopOrdersList shopId={shop.id} />
                </TabsContent>
                
                <TabsContent value="settings">
                  <ShopSettings shopId={shop.id} />
                </TabsContent>
              </>
            )}
            
            <TabsContent value="reviews">
              <ShopReviewsList shopId={shop.id} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
