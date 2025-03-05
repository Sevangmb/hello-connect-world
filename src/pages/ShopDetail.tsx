
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Phone, Globe } from 'lucide-react';
import { ShopItems } from '@/components/shop/ShopItems';
import { useShop } from '@/hooks/useShop';
import { Skeleton } from '@/components/ui/skeleton';

export default function ShopDetail() {
  const { shopId } = useParams<{ shopId: string }>();
  const { useShopById, useIsFavorited, addFavoriteShop, removeFavoriteShop } = useShop();
  const { data: shop, isLoading } = useShopById(shopId);
  const { data: isFavorited, refetch: refetchFavorited } = useIsFavorited(shopId);

  useEffect(() => {
    if (shopId) {
      refetchFavorited();
    }
  }, [shopId, refetchFavorited]);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorited) {
        await removeFavoriteShop.mutateAsync(shopId!);
      } else {
        await addFavoriteShop.mutateAsync(shopId!);
      }
      refetchFavorited();
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <Skeleton className="w-full md:w-1/3 h-64" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h3 className="text-lg font-medium">Shop not found</h3>
          <p>The shop you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-1/3">
          {shop.image_url ? (
            <img 
              src={shop.image_url} 
              alt={shop.name} 
              className="w-full h-64 object-cover rounded-lg" 
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{shop.name}</h1>
            <Button
              variant={isFavorited ? "default" : "outline"}
              size="icon"
              onClick={handleToggleFavorite}
            >
              <Heart className={isFavorited ? "fill-current" : ""} />
            </Button>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
            <span className="flex items-center">
              ★★★★★
            </span>
            <span>{shop.average_rating} ({shop.rating_count || 0} reviews)</span>
          </div>
          
          <p className="my-4">{shop.description}</p>
          
          <div className="space-y-2">
            {shop.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{shop.address}</span>
              </div>
            )}
            
            {shop.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{shop.phone}</span>
              </div>
            )}
            
            {shop.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <a href={shop.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {shop.website}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <ShopItems />
    </div>
  );
}
