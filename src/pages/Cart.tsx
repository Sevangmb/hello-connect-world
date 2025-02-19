
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartList } from "@/components/cart/CartList";
import { CartSummary } from "@/components/cart/CartSummary";
import MainSidebar from "@/components/MainSidebar";

export default function Cart() {
  const { cartItems, isLoading, updateQuantity, removeFromCart } = useCart();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        Chargement du panier...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MainSidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />
      <div className="flex items-center gap-2 mb-8">
        <ShoppingCart className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Mon panier</h1>
      </div>

      {!cartItems?.length ? (
        <div className="text-center py-12 text-gray-500">
          Votre panier est vide
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CartList 
              items={cartItems} 
              onUpdateQuantity={updateQuantity.mutate}
              onRemove={removeFromCart.mutate}
            />
          </div>
          <div>
            <CartSummary items={cartItems} />
          </div>
        </div>
      )}
    </div>
  );
}
