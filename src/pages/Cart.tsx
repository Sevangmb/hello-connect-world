
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartItemsList } from "@/components/cart/CartItemsList";
import { CartSummary } from "@/components/cart/CartSummary";
import { useAuth } from "@/hooks/useAuth";

export default function Cart() {
  const { user } = useAuth();
  const { 
    cartItems, 
    isCartLoading, 
    updateQuantity, 
    removeFromCart 
  } = useCart(user?.id || null);

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
                <CartItemsList 
                  items={cartItems}
                  onUpdateQuantity={(itemId, quantity) => {
                    updateQuantity({ cartItemId: itemId, quantity });
                  }}
                  onRemoveItem={(itemId) => removeFromCart.mutate(itemId)}
                />
              </div>

              <div className="lg:col-span-4">
                <CartSummary 
                  items={cartItems}
                  isLoading={isCartLoading}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
