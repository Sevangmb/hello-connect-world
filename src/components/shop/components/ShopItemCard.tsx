
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { ShopItem } from '@/core/shop/domain/types';
import { useCart } from '@/hooks/useCart';

export interface ShopItemCardProps {
  item: ShopItem;
  userId: string;
}

export const ShopItemCard: React.FC<ShopItemCardProps> = ({ item, userId }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    if (item && userId) {
      addToCart.mutate({ 
        shopItemId: item.id,
        quantity: 1
      });
    }
  };
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative pt-[100%]">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
            No image
          </div>
        )}
      </div>
      
      <CardContent className="flex-grow p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium truncate">{item.name}</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
        
        <p className="text-gray-500 text-sm mb-2 line-clamp-2">
          {item.description || 'No description available'}
        </p>
        
        <div className="flex items-baseline mt-2">
          <span className="text-lg font-bold">{item.price}€</span>
          {item.original_price && item.original_price > item.price && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              {item.original_price}€
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart} 
          className="w-full"
          disabled={addToCart.isPending || item.stock <= 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {item.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
        </Button>
      </CardFooter>
    </Card>
  );
};
