
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useShop } from '@/hooks/useShop';
import ShopSettings from './ShopSettings';
import ShopReviewsList from './ShopReviewsList';
import { ShopItemsList } from './ShopItemsList';
import { ShopOrdersList } from './ShopOrdersList';
import { Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ShopDashboard = () => {
  const { shop, loading, fetchShopByUserId } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    fetchShopByUserId();
  }, [fetchShopByUserId]);

  if (loading) {
    return <div className="flex justify-center items-center p-12">Chargement...</div>;
  }

  if (!shop) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="text-center p-8">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Store className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Vous n'avez pas de boutique</CardTitle>
            <CardDescription>
              Créez votre propre boutique pour vendre vos vêtements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate('/create-shop')}
              className="mt-4"
            >
              Créer une boutique
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{shop.name}</h1>
        <p className="text-muted-foreground">{shop.description}</p>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <ShopItemsList shopId={shop.id} />
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <ShopOrdersList shopId={shop.id} />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <ShopReviewsList shopId={shop.id} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <ShopSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShopDashboard;
