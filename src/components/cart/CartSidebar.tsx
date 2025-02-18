
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "./CartItem";
import { CartItemType } from "@/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag, X } from "lucide-react";

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function CartSidebar({ open, onClose }: CartSidebarProps) {
  const navigate = useNavigate();
  const { cartItems, isLoading, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const calculateTotal = (items: CartItemType[]) => {
    return items.reduce((total, item) => {
      return total + (item.shop_items.price * item.quantity);
    }, 0);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-y-0 right-0 w-full border-l bg-background p-6 shadow-lg sm:max-w-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Mon Panier</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex h-[400px] flex-col items-center justify-center space-y-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">Votre panier est vide</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[400px] py-4">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity.mutate}
                    onRemove={removeFromCart.mutate}
                  />
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{calculateTotal(cartItems).toFixed(2)} €</span>
              </div>
              <Button 
                className="w-full" 
                onClick={() => {
                  navigate("/cart");
                  onClose();
                }}
              >
                Voir le panier
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
