import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { CheckoutButton } from "@/components/shop/CheckoutButton";
import { useAuth } from "@/hooks/useAuth";

interface CartSidebarProps {
  onClose: () => void;
}

export function CartSidebar({ onClose }: CartSidebarProps) {
  const { user } = useAuth();
  const { cartItems, isCartLoading, updateQuantity, removeFromCart } = useCart(user?.id || null);

  const total = cartItems?.reduce((sum, item) => 
    sum + (item.shop_items.price * item.quantity), 0
  ) ?? 0;

  if (isCartLoading) {
    return (
      <div className="fixed right-0 top-0 bottom-0 w-80 border-l bg-white pt-16 flex items-center justify-center z-50">
        Chargement du panier...
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 border-l bg-white pt-16 z-50">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="font-medium">Mon panier</h2>
            {cartItems && cartItems.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {cartItems.length}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {!cartItems?.length ? (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
            Votre panier est vide
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 py-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    {item.shop_items.image_url && (
                      <img
                        src={item.shop_items.image_url}
                        alt={item.shop_items.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    )}
                    <div className="flex-1 space-y-1">
                      <h3 className="text-sm font-medium">
                        {item.shop_items.name}
                      </h3>
                      <p className="text-sm font-bold">
                        {formatPrice(item.shop_items.price)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity({
                                cartItemId: item.id,
                                quantity: item.quantity - 1
                              });
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
                          onClick={() => 
                            updateQuantity({
                              cartItemId: item.id,
                              quantity: item.quantity + 1
                            })
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeFromCart.mutate(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t p-4">
              <div className="flex items-center justify-between text-sm font-medium mb-4">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <CheckoutButton 
                cartItems={cartItems.map(item => ({ 
                  id: item.id, 
                  quantity: item.quantity 
                }))}
                isLoading={isCartLoading}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
