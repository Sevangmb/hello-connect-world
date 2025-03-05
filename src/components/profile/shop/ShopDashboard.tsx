
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import ShopItemsList from './ShopItemsList';
import ShopOrdersList from './ShopOrdersList';
import ShopReviewsList from './ShopReviewsList';
import AddItemForm from './AddItemForm';

const ShopDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const { data: shop, isLoading: isShopLoading, error: shopError } = useQuery({
    queryKey: ['userShop', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not logged in');
      const shopService = getShopService();
      return shopService.getShopByUserId(user.id);
    },
    enabled: !!user?.id
  });

  if (isShopLoading) {
    return <div>Chargement de votre boutique...</div>;
  }

  if (shopError) {
    return <div>Erreur: {(shopError as Error).message}</div>;
  }

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Vous n'avez pas encore de boutique</h1>
        <p className="text-gray-500 mb-6">
          Créez votre boutique pour commencer à vendre vos articles.
        </p>
        <a
          href="/create-shop"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Créer une boutique
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Ma Boutique</CardTitle>
        </CardHeader>
        <CardContent>
          <h1 className="text-2xl font-bold">{shop.name}</h1>
          <p className="text-gray-500">{shop.description}</p>
          <div className="mt-2">
            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
              {shop.status}
            </span>
            <span className="text-sm ml-2">
              Note: {shop.average_rating} ({shop.rating_count || 0} avis)
            </span>
          </div>
          <div className="mt-4">
            <a
              href={`/shops/${shop.id}`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir ma boutique
            </a>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="items">
        <TabsList className="mb-4">
          <TabsTrigger value="items">Articles</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
          <TabsTrigger value="add-item">Ajouter un article</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <ShopItemsList shopId={shop.id} />
        </TabsContent>

        <TabsContent value="orders">
          <ShopOrdersList shopId={shop.id} />
        </TabsContent>

        <TabsContent value="reviews">
          <ShopReviewsList shopId={shop.id} />
        </TabsContent>

        <TabsContent value="add-item">
          <AddItemForm shopId={shop.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShopDashboard;
