
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { RawShopItem } from '../hooks/useShopItems';

export interface ShopItemCardProps {
  item: RawShopItem;
  key: string;
}

export const ShopItemCard: React.FC<ShopItemCardProps> = ({ item }) => {
  const { addToCart, isAddingToCart } = useCart();
  const { toast } = useToast();
  
  const handleAddToCart = async () => {
    try {
      await addToCart(item.id, 1);
      toast({
        title: "Ajouté au panier",
        description: `${item.name} a été ajouté à votre panier.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter au panier. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="h-48 overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Pas d'image</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{item.name}</h3>
        <div className="flex justify-between items-center mt-1">
          <div className="text-lg font-bold">{item.price}€</div>
          {item.original_price && item.original_price > item.price && (
            <div className="text-sm line-through text-gray-400">
              {item.original_price}€
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {item.description || "Aucune description"}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart} 
          disabled={isAddingToCart || item.stock <= 0}
          className="w-full"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {item.stock > 0 ? "Ajouter au panier" : "Épuisé"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShopItemCard;
