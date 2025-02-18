
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "./CartItem";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPrice } from "@/lib/utils";

export function CartSidebar() {
  const [open, setOpen] = useState(false);
  const { cartItems, isLoading, updateQuantity, removeFromCart } = useCart();

  const total = cartItems.reduce((acc, item) => {
    return acc + item.quantity * item.shop_items.price;
  }, 0);

  if (isLoading) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Mon Panier ({cartItems.length})</SheetTitle>
        </SheetHeader>
        
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-muted-foreground">Votre panier est vide</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={(quantity) => updateQuantity.mutate({ itemId: item.id, quantity })}
                    onRemove={() => removeFromCart.mutate(item.id)}
                  />
                ))}
              </div>
            </ScrollArea>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold">{formatPrice(total)}</span>
              </div>
              <Button className="w-full">
                Passer commande
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
