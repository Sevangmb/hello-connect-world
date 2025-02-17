import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

export default function CartSummary() {
  const { cartItems } = useCart();

  const total = cartItems?.reduce((sum, item) => 
    sum + (item.shop_items.price * item.quantity), 0
  ) ?? 0;

  const itemCount = cartItems?.reduce((count, item) => 
    count + item.quantity, 0
  ) ?? 0;

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-semibold">Résumé de la commande</h2>
      <p className="mt-2">Nombre d'articles: {itemCount}</p>
      <p className="mt-2 font-bold">Total: {formatPrice(total)}</p>
    </div>
  );
}