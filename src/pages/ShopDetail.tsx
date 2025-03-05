
import React from 'react';
import { useParams } from 'react-router-dom';
import { useShop } from '@/hooks/useShop';
import { ShopItems } from '@/components/shop/ShopItems';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Store } from 'lucide-react';

export default function ShopDetail() {
  const { shopId } = useParams<{ shopId: string }>();
  const { shop, isShopLoading } = useShop();
  
  // Mock implementation for the shop hooks
  const getShopById = async (id: string) => {
    // Mock implementation
    return null;
  };
  
  const favoriteShop = async (id: string) => {
    // Mock implementation
    return true;
  };
  
  const isFavorited = false;
  
  const checkIfFavorited = async (id: string) => {
    // Mock implementation
    return false;
  };
  
  React.useEffect(() => {
    if (shopId) {
      getShopById(shopId);
      checkIfFavorited(shopId);
    }
  }, [shopId]);

  const handleFavorite = async () => {
    if (shopId) {
      favoriteShop(shopId);
    }
  };

  if (isShopLoading) {
    return <div className="p-6">Loading shop details...</div>;
  }

  if (!shop) {
    return <div className="p-6">Shop not found</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Shop Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
        <Avatar className="h-24 w-24 md:h-32 md:w-32">
          {shop.image_url ? (
            <AvatarImage src={shop.image_url} alt={shop.name} />
          ) : (
            <AvatarFallback>
              <Store className="h-12 w-12" />
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <h1 className="text-3xl font-bold">{shop.name}</h1>
            <Button
              variant={isFavorited ? "default" : "outline"}
              size="sm"
              onClick={handleFavorite}
            >
              {isFavorited ? "Favorited" : "Add to Favorites"}
            </Button>
          </div>

          <div className="flex items-center mt-2 text-sm text-gray-500">
            <div className="flex items-center mr-4">
              <Star className="h-4 w-4 mr-1 text-yellow-400" />
              <span>
                {shop.average_rating.toFixed(1)} ({shop.rating_count || 0}{" "}
                reviews)
              </span>
            </div>
            {shop.address && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{shop.address}</span>
              </div>
            )}
          </div>

          <p className="mt-4 text-gray-600">{shop.description}</p>
        </div>
      </div>

      {/* Shop Items */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Shop Items</h2>
        <ShopItems shopId={shop.id} />
      </div>
    </div>
  );
}
