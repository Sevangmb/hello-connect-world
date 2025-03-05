
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShopItem } from "@/core/shop/domain/types";

interface ShopItemCardProps {
  item: ShopItem;
  onAddToCart?: (item: ShopItem) => void;
}

export default function ShopItemCard({ item, onAddToCart }: ShopItemCardProps) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(item);
    }
  };

  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <div className="relative h-48 bg-gray-100">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No image
          </div>
        )}
        
        {item.original_price && item.original_price > item.price && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            Sale
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{item.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <div>
            {item.original_price && item.original_price > item.price ? (
              <div className="flex items-center gap-2">
                <span className="font-bold">{item.price.toFixed(2)} €</span>
                <span className="text-sm text-gray-500 line-through">
                  {item.original_price.toFixed(2)} €
                </span>
              </div>
            ) : (
              <span className="font-bold">{item.price.toFixed(2)} €</span>
            )}
          </div>
          
          <Badge variant={item.stock > 0 ? "outline" : "destructive"}>
            {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          disabled={item.stock <= 0}
          onClick={handleAddToCart}
        >
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
}

// Fix for correct imports in parent files
export { default as ShopItemCard } from './ShopItemCard';
