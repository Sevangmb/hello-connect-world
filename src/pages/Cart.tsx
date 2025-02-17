import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartList } from "@/components/Cart/CartList";
import { CartSummary } from "@/components/Cart/CartSummary";

export default function Cart() {
  const { cartItems, isCartLoading } = useCart();

  if (isCartLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        Chargement du panier...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <ShoppingCart className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Mon panier</h1>
      </div>

      {!cartItems?.length ? (
        <div className="text-center py-12 text-gray-500">
          Votre panier est vide
        </div>
      ) : (
        <>
          <CartList items={cartItems} />
          <CartSummary items={cartItems} />
        </>
      )}
    </div>
  );
}