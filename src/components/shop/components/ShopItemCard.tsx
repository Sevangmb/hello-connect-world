
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useShop } from '@/hooks/useShop';

export interface ShopItemCardProps {
  item: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    description?: string;
    shop_id: string;
  };
}

const ShopItemCard: React.FC<ShopItemCardProps> = ({ item }) => {
  const { toast } = useToast();
  const { addToCart } = useShop();

  const handleAddToCart = async () => {
    try {
      await addToCart(item.id);
      toast({
        title: "Ajouté au panier",
        description: `${item.name} a été ajouté à votre panier.`
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter ce produit au panier.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="aspect-square relative overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-cover transition-all hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
      </div>
      <CardContent className="p-4 flex-grow">
        <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
        <p className="text-muted-foreground line-clamp-2 text-sm mb-2">
          {item.description || "Pas de description"}
        </p>
        <p className="font-bold">{item.price.toFixed(2)} €</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full"
          variant="secondary"
        >
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShopItemCard;
