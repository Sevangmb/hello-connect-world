
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/utils";
import { CheckoutButton } from "@/components/shop/CheckoutButton";
import { Separator } from "@/components/ui/separator";

export default function Cart() {
  const { user } = useAuth();
  const { cartItems, isCartLoading, updateQuantity, removeFromCart, clearCart } = useCart(user?.id || null);
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCart = async () => {
    setIsClearing(true);
    try {
      await clearCart.mutateAsync();
    } finally {
      setIsClearing(false);
    }
  };

  const total = cartItems?.reduce((sum, item) => 
    sum + (item.shop_items.price * item.quantity), 0
  ) ?? 0;

  return (
    <div className="container max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mon panier</h1>

      {isCartLoading ? (
        <div className="text-center py-12">Chargement de votre panier...</div>
      ) : !cartItems?.length ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Votre panier est vide</h2>
          <p className="text-muted-foreground mb-4">Ajoutez des articles à votre panier pour les voir ici.</p>
          <Button asChild>
            <a href="/shops">Découvrir les boutiques</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow p-4 flex items-center">
                  <div className="h-20 w-20 bg-gray-100 rounded overflow-hidden mr-4">
                    {item.shop_items.image_url ? (
                      <img
                        src={item.shop_items.image_url}
                        alt={item.shop_items.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-200">
                        <span className="text-sm text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.shop_items.name}</h3>
                    <div className="text-sm text-muted-foreground mb-2">
                      Boutique: {item.shop.name}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity.mutate({
                                cartItemId: item.id,
                                quantity: item.quantity - 1
                              });
                            }
                          }}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => 
                            updateQuantity.mutate({
                              cartItemId: item.id,
                              quantity: item.quantity + 1
                            })
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="font-medium">
                        {formatPrice(item.shop_items.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={() => removeFromCart.mutate(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                onClick={handleClearCart}
                disabled={isClearing}
              >
                Vider le panier
              </Button>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Résumé</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Frais de livraison</span>
                  <span>Calculé à la prochaine étape</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-semibold text-lg mb-6">
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
              
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Les taxes éventuelles seront calculées lors du paiement
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
