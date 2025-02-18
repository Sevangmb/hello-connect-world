
import { CartItemType } from "@/types";
import { CartItem } from "@/components/cart/CartItem";
import { useCart } from "@/hooks/useCart";

interface CartListProps {
  items: CartItemType[];
}

export function CartList({ items }: CartListProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onUpdateQuantity={(itemId, quantity) => updateQuantity.mutate({ itemId, quantity })}
          onRemove={(itemId) => removeFromCart.mutate(itemId)}
        />
      ))}
    </div>
  );
}
