
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { ShopItem } from "@/core/shop/domain/types";

export interface ShopItemCardProps {
  item: ShopItem;
}

export const ShopItemCard = ({ item }: ShopItemCardProps) => {
  const { addToCart, cartItems, removeFromCart } = useCart();

  // Fix: Use isPending from the mutation result
  const isAddingToCart = addToCart.isPending || removeFromCart.isPending;

  // Fix: Use mutate method for mutations
  const handleAddToCart = () => {
    addToCart.mutate({ 
      itemId: item.id,
      quantity: 1
    });
  };

  const handleRemoveFromCart = () => {
    removeFromCart.mutate(item.id);
  };

  // Fix: Access the correct property name
  const isInCart = cartItems.some((cartItem) => cartItem.shop_items?.id === item.id);

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
