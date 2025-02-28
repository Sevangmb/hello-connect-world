
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItem } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, X } from "lucide-react";

interface CartItemsListProps {
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
}

export function CartItemsList({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem 
}: CartItemsListProps) {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow">
            {item.shop_items.image_url && (
              <img
                src={item.shop_items.image_url}
                alt={item.shop_items.name}
                className="h-24 w-24 rounded-md object-cover"
              />
            )}
            <div className="flex-1 space-y-2">
              <h3 className="font-medium">
                {item.shop_items.name}
              </h3>
              <p className="font-bold">
                {formatPrice(item.shop_items.price)}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    if (item.quantity > 1) {
                      onUpdateQuantity(item.id, item.quantity - 1);
                    }
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-sm">{item.quantity}</span>
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
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onRemoveItem(item.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
