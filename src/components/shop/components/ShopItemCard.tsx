
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { ShopItem } from "@/core/shop/domain/types";

export interface ShopItemCardProps {
  item: ShopItem;
  userId?: string;
}

export const ShopItemCard = ({ item, userId }: ShopItemCardProps) => {
  const { addToCart, cartItems, removeFromCart } = useCart();

  // Correction pour isAddingToCart
  const isAddingToCart = false; // Utiliser addToCart.isPending si disponible

  // Correction pour addToCart, ajouter le paramètre requis
  const handleAddToCart = () => {
    addToCart({ 
      itemId: item.id,
      quantity: 1
    });
  };

  const handleRemoveFromCart = () => {
    removeFromCart(item.id);
  };

  const isInCart = cartItems.some((cartItem) => cartItem.shop_item_id === item.id);

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
