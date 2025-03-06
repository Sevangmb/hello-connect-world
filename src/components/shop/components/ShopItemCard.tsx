
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { formatPrice } from '@/utils/format';
import { ShopItem } from '@/core/shop/domain/types';

interface ShopItemCardProps {
  item: ShopItem;
  onAddToCart?: (itemId: string) => void;
  onAddToFavorites?: (itemId: string) => void;
}

export const ShopItemCard: React.FC<ShopItemCardProps> = ({
  item,
  onAddToCart,
  onAddToFavorites,
}) => {
  const handleAddToCart = () => {
    if (onAddToCart && item.id) {
      onAddToCart(item.id);
    }
  };

  const handleAddToFavorites = () => {
    if (onAddToFavorites && item.id) {
      onAddToFavorites(item.id);
    }
  };

  const isDiscounted = item.original_price && item.original_price > item.price;
  const discountPercentage = isDiscounted
    ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
    : 0;

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-200">
            <span className="text-muted-foreground">Image non disponible</span>
          </div>
        )}
        {isDiscounted && (
          <Badge className="absolute right-2 top-2 bg-red-500">
            -{discountPercentage}%
          </Badge>
        )}
      </div>

      <CardHeader className="p-4 pb-0">
        <h3 className="line-clamp-1 text-lg font-medium">{item.name}</h3>
      </CardHeader>

      <CardContent className="p-4 pb-0">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {item.description || 'Pas de description disponible'}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold">{formatPrice(item.price)}</span>
          {isDiscounted && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(item.original_price)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-4">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 mr-2"
          onClick={handleAddToFavorites}
        >
          <Heart className="mr-1 h-4 w-4" />
          Favori
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={item.stock <= 0}
        >
          <ShoppingCart className="mr-1 h-4 w-4" />
          Panier
        </Button>
      </CardFooter>
    </Card>
  );
};
