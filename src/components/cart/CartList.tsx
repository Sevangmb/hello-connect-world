
import { CartItemType } from "@/types";
import { CartItem } from "@/components/cart/CartItem";

interface CartListProps {
  items: CartItemType[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export function CartList({ items, onUpdateQuantity, onRemove }: CartListProps) {
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    onUpdateQuantity(itemId, quantity);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
