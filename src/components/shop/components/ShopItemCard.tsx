
import React from 'react';
import { ShopItem } from '@/core/shop/domain/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/cart';

interface ShopItemCardProps {
  item: ShopItem;
  userId: string | null;
}

export const ShopItemCard: React.FC<ShopItemCardProps> = ({ item, userId }) => {
  const { addToCart } = useCart(userId);

  const handleAddToCart = () => {
    if (!userId) return;
    
    addToCart.mutate({
      shopItemId: item.id,
      userId: userId,
      quantity: 1
    });
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
            No image
          </div>
        )}
      </div>
      <CardContent className="flex flex-col flex-grow p-4">
        <div className="flex-grow">
          <h3 className="font-medium mb-1 line-clamp-1">{item.name}</h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-2">
            {item.description || "No description available"}
          </p>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <div>
            <p className="font-bold">{formatPrice(item.price)}</p>
            {item.original_price && item.original_price > item.price && (
              <p className="text-xs text-gray-500 line-through">
                {formatPrice(item.original_price)}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddToCart}
            disabled={addToCart.isPending || !userId || item.status !== 'available'}
            className="rounded-full h-9 w-9 p-0"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
