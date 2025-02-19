
import { useEffect } from "react";
import { ShoppingCart, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CartList } from "./CartList";
import { CartSummary } from "./CartSummary";
import { useCart } from "@/hooks/useCart";

export interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { cartItems, isLoading, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Mon Panier
          </SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              Chargement...
            </div>
          ) : !cartItems?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              Votre panier est vide
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-200px)]">
              <CartList
                items={cartItems}
                onUpdateQuantity={(itemId, quantity) => updateQuantity.mutate({ itemId, quantity })}
                onRemove={(itemId) => removeFromCart.mutate(itemId)}
              />
              <CartSummary items={cartItems} />
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
