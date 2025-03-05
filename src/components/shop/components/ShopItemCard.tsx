
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/cart";
import { ShopItem } from "@/core/shop/domain/types";
import { useAuth } from '@/hooks/useAuth';

export interface ShopItemCardProps {
  item: ShopItem;
}

export function ShopItemCard({ item }: ShopItemCardProps) {
  const { user } = useAuth();
  const { 
    cartItems, 
    addToCart, 
    removeFromCart 
  } = useCart(user?.id || null);

  // Check if item is in cart
  const isInCart = cartItems?.some(cartItem => cartItem.shop_items.id === item.id);
  
  // Add to cart handler
  const handleAddToCart = () => {
    if (!user) {
      // Handle not logged in case
      console.log('Please log in to add items to cart');
      return;
    }
    
    addToCart.mutate({
      user_id: user.id,
      item_id: item.id,
      quantity: 1
    });
  };

  // Remove from cart handler
  const handleRemoveFromCart = () => {
    if (!user || !isInCart) return;
    
    const cartItem = cartItems?.find(cartItem => cartItem.shop_items.id === item.id);
    if (cartItem) {
      removeFromCart.mutate(cartItem.id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {item.image_url && (
          <div className="w-full aspect-square overflow-hidden rounded-md mb-4">
            <img 
              src={item.image_url} 
              alt={item.name} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}
        <p className="text-sm text-gray-500 mb-2">{item.description}</p>
        <div className="flex justify-between items-center">
          <Badge className="bg-green-500">{item.price}€</Badge>
          {item.original_price && (
            <span className="text-sm line-through text-gray-400">
              {item.original_price}€
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isInCart ? (
          <Button 
            onClick={handleRemoveFromCart} 
            variant="outline" 
            disabled={removeFromCart.isPending}
          >
            Remove from cart
          </Button>
        ) : (
          <Button 
            onClick={handleAddToCart} 
            disabled={addToCart.isPending || item.stock <= 0}
          >
            {item.stock <= 0 ? 'Out of stock' : 'Add to cart'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
