
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Heart } from "lucide-react";
import { ShopItem } from "../types/shop-items";

interface ShopItemCardProps {
  item: ShopItem;
  onAddToCart: (item: ShopItem) => void;
  isAddingToCart?: boolean;
}

export function ShopItemCard({ item, onAddToCart, isAddingToCart }: ShopItemCardProps) {
  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
      {item.image && (
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-medium text-sm mb-1 line-clamp-1">{item.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">{formatPrice(item.price)}</span>
            {item.original_price && item.original_price > item.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(item.original_price)}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {item.size && (
            <Badge variant="secondary" className="text-xs font-normal">
              {item.size}
            </Badge>
          )}
          {item.brand && (
            <Badge variant="outline" className="text-xs font-normal">
              {item.brand}
            </Badge>
          )}
        </div>
        <Button 
          className="w-full bg-black hover:bg-gray-900 text-white"
          size="sm"
          onClick={() => onAddToCart(item)}
          disabled={isAddingToCart}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isAddingToCart ? 'Ajout en cours...' : 'Ajouter au panier'}
        </Button>
      </div>
    </Card>
  );
}
