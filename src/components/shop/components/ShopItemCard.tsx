
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export interface ShopItemCardProps {
  item: any;
  onAddToCart: (itemId: string) => void;
}

const ShopItemCard: React.FC<ShopItemCardProps> = ({ item, onAddToCart }) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 bg-muted">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-muted-foreground">Pas d'image</span>
          </div>
        )}
        {item.original_price && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-sm text-xs font-medium">
            -{Math.round((1 - item.price / item.original_price) * 100)}%
          </div>
        )}
      </div>
      <CardContent className="p-4 flex-1">
        <h3 className="font-medium text-lg truncate">{item.name}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 h-10">
          {item.description || "Aucune description"}
        </p>
        
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-bold text-lg">{item.price}€</span>
          {item.original_price && (
            <span className="text-muted-foreground line-through text-sm">
              {item.original_price}€
            </span>
          )}
        </div>
        
        {item.stock > 0 ? (
          <div className="text-xs text-green-600 mt-1">
            En stock ({item.stock})
          </div>
        ) : (
          <div className="text-xs text-red-500 mt-1">
            Épuisé
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onAddToCart(item.id)}
          className="w-full"
          disabled={item.stock <= 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShopItemCard;
