import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { CartItemProps } from "@/types";

const CartItem: React.FC<CartItemProps> = ({ item, updateQuantity, removeFromCart }) => {
  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow">
      {item.shop_items.clothes.image_url && (
        <img
          src={item.shop_items.clothes.image_url}
          alt={item.shop_items.clothes.name}
          className="h-24 w-24 rounded-md object-cover"
        />
      )}
      <div className="flex-1 space-y-2">
        <h3 className="font-medium">
          {item.shop_items.clothes.name}
        </h3>
        <p className="font-bold">
          {formatPrice(item.shop_items.price)}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
            -
          </Button>
          <span>{item.quantity}</span>
          <Button variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
            +
          </Button>
          <Button variant="outline" onClick={() => removeFromCart(item.id)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;