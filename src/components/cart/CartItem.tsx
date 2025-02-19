
import { Minus, Plus, Trash } from "lucide-react";
import { CartItemType } from "@/types";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b">
      <div className="w-24 h-24 rounded-lg overflow-hidden">
        <img
          src={item.shop_items.clothes.image_url}
          alt={item.shop_items.clothes.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1">
        <h3 className="font-medium">{item.shop_items.clothes.name}</h3>
        <p className="text-sm text-muted-foreground">
          Prix: {item.shop_items.price}€
        </p>

        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button variant="outline" size="icon" onClick={handleIncrement}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="ml-4 text-red-500 hover:text-red-600"
            onClick={() => onRemove(item.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
