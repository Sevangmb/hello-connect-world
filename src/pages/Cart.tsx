
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckoutButton } from "@/components/shop/CheckoutButton";

export default function Cart() {
  const { cartItems, isCartLoading, updateQuantity, removeFromCart } = useCart();

  const total = cartItems?.reduce((sum, item) => 
    sum + (item.shop_items.price * item.quantity), 0
  ) ?? 0;

  if (isCartLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
        <Header />
        <MainSidebar />
        <main className="pt-24 px-4 md:pl-72">
          <div className="container mx-auto flex items-center justify-center">
            Chargement du panier...
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <ShoppingCart className="h-6 w-6" />
            <h1 className="text-2xl font-semibold">Mon panier</h1>
          </div>

          {!cartItems?.length ? (
            <div className="text-center py-12 text-gray-500">
              Votre panier est vide
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow">
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
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity.mutate({
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
                                updateQuantity.mutate({
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
              </div>

              <div className="lg:col-span-4">
                <div className="bg-white p-6 rounded-lg shadow space-y-4">
                  <h2 className="font-semibold text-lg">Résumé de la commande</h2>
                  <div className="flex justify-between py-4 border-t">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">{formatPrice(total)}</span>
                  </div>
                  <CheckoutButton 
                    cartItems={cartItems?.map(item => ({ 
                      id: item.id, 
                      quantity: item.quantity 
                    })) ?? []}
                    isLoading={isCartLoading}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
