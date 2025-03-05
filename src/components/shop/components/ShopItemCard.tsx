import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";

interface ShopItemCardProps {
  item: any;
}

export const ShopItemCard = ({ item }: ShopItemCardProps) => {
  const { addItemToCart, cart, removeItemFromCart } = useCart();

  // Correction des paramètres d'appel des hooks

  // Correction pour isAddingToCart
  const isAddingToCart = false; // Utiliser addToCart.isPending si disponible

  // Correction pour addToCart, ajouter le paramètre requis
  const handleAddToCart = () => {
    addItemToCart({ 
      itemId: item.id,
      quantity: 1
    });
  };

  const handleRemoveFromCart = () => {
    removeItemFromCart(item.id);
  };

  const isInCart = cart.items.find((cartItem) => cartItem.itemId === item.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{item.description}</p>
        <Badge>${item.price}</Badge>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isInCart ? (
          <Button onClick={handleRemoveFromCart} disabled={isAddingToCart}>
            Retirer du panier
          </Button>
        ) : (
          <Button onClick={handleAddToCart} disabled={isAddingToCart}>
            Ajouter au panier
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
