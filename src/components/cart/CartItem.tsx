
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItemProps } from "@/types";
import { formatPrice } from "@/lib/utils";

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-start gap-4 py-4">
      {item.shop_items.clothes.image_url && (
        <img
          src={item.shop_items.clothes.image_url}
          alt={item.shop_items.clothes.name}
          className="h-24 w-24 rounded-md object-cover"
        />
      )}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <h3 className="font-medium">{item.shop_items.clothes.name}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500"
            onClick={() => onRemove(item.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-1 text-sm font-medium">
          {formatPrice(item.shop_items.price)}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              if (item.quantity > 1) {
                onUpdateQuantity(item.id, item.quantity - 1);
              }
            }}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
