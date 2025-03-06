
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShop } from '@/hooks/useShop';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Heart, ShoppingCart } from 'lucide-react';

const ShopDetail = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const { useShopById, useIsShopFavorited } = useShop();
  const { data: shop, isLoading: isShopLoading } = useShopById(shopId);
  const { data: isFavorited } = useIsShopFavorited(shopId);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to favorite shops.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAddingToFavorites(true);
    
    try {
      // This would need to be implemented with actual mutation hooks
      if (isFavorited) {
        // Logic to remove from favorites
        toast({
          title: "Removed from favorites",
          description: "Shop has been removed from your favorites."
        });
      } else {
        // Logic to add to favorites
        toast({
          title: "Added to favorites",
          description: "Shop has been added to your favorites."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites.",
        variant: "destructive"
      });
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  if (isShopLoading) {
    return <div>Loading shop details...</div>;
  }

  if (!shop) {
    return <div>Shop not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Shop Image */}
        <div className="w-full md:w-1/3">
          <div className="rounded-lg bg-gray-100 overflow-hidden h-64">
            {shop.image_url ? (
              <img 
                src={shop.image_url} 
                alt={shop.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Shop Details */}
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{shop.name}</h1>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleFavoriteToggle}
              disabled={isAddingToFavorites}
            >
              <Heart className={isFavorited ? "fill-red-500 text-red-500" : ""} />
            </Button>
          </div>
          
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="ml-1">{shop.average_rating || 0}</span>
            </div>
            <span className="mx-2">•</span>
            <span className="text-gray-500">
              {shop.rating_count || 0} {shop.rating_count === 1 ? 'review' : 'reviews'}
            </span>
          </div>
          
          <p className="mt-4">{shop.description}</p>
          
          {shop.address && (
            <div className="mt-4">
              <h3 className="font-semibold">Address</h3>
              <p>{shop.address}</p>
            </div>
          )}
          
          <div className="mt-6 flex flex-wrap gap-3">
            <Button>
              <ShoppingCart className="mr-2 h-4 w-4" />
              View Products
            </Button>
            <Button variant="outline">Contact Seller</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
