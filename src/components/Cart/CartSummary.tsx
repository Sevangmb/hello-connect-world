
import { CartItemType } from "@/types";
import { formatPrice } from "@/lib/utils";

interface CartSummaryProps {
  items: CartItemType[];
}

export function CartSummary({ items }: CartSummaryProps) {
  const total = items.reduce(
    (sum, item) => sum + item.shop_items.price * item.quantity,
    0
  );

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Résumé de la commande</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Sous-total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between">
          <span>Frais de livraison</span>
          <span>Calculés à l'étape suivante</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
