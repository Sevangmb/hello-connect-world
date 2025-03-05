
import React from 'react';
import { useParams } from 'react-router-dom';
import { useShop } from '@/hooks/useShop';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ShopItems from '@/components/shop/ShopItems';

const ShopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { useShopById, useFavoriteToggle } = useShop();
  const { data: shop, isLoading, error } = useShopById(id);
  const { mutate: toggleFavorite, isLoading: isFavoriteLoading } = useFavoriteToggle();

  if (isLoading) {
    return <div>Loading shop details...</div>;
  }

  if (error || !shop) {
    return <div>Error loading shop: {error?.message || 'Shop not found'}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{shop.name}</CardTitle>
          <div className="text-sm text-muted-foreground">{shop.description}</div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Address: {shop.address || 'No address provided'}</p>
              <p>Rating: {shop.average_rating.toFixed(1)} ({shop.rating_count} reviews)</p>
            </div>
            <button 
              onClick={() => toggleFavorite(shop.id)}
              disabled={isFavoriteLoading}
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              {isFavoriteLoading ? 'Processing...' : 'Toggle Favorite'}
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Shop Items</h2>
        <ShopItems />
      </div>
    </div>
  );
};

export default ShopDetail;
