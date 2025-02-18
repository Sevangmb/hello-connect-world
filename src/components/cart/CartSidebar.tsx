
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItemType } from "@/types";
import { Button } from "@/components/ui/button";
import { CartItem } from "./CartItem";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag } from "lucide-react";

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.shop_items.price * item.quantity,
    0
  );

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between py-4 border-b">
            <h2 className="text-lg font-semibold">Mon panier</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Votre panier est vide
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-4 py-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={(itemId, quantity) => 
                        updateQuantity.mutate({ itemId, quantity })
                      }
                      onRemove={(itemId) => removeFromCart.mutate(itemId)}
                    />
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t p-4">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Total</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                  <Button className="w-full">
                    Procéder au paiement
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
