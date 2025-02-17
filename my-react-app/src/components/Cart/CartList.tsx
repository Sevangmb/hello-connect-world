import { CartItem } from "./CartItem";

interface CartListProps {
  cartItems: Array<{
    id: string;
    shop_items: {
      price: number;
      clothes: {
        image_url: string;
        name: string;
      };
    };
    quantity: number;
  }>;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
}

export function CartList({ cartItems, updateQuantity, removeFromCart }: CartListProps) {
  return (
    <div className="space-y-6">
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />
      ))}
    </div>
  );
}