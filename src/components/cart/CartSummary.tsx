
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/hooks/useCart";
import { CheckoutButton } from "./CheckoutButton";

interface CartSummaryProps {
  items: CartItem[];
  isLoading?: boolean;
}

export function CartSummary({ items, isLoading }: CartSummaryProps) {
  // Filter out invalid items first
  const validItems = items.filter(item => item && item.shop_items && typeof item.shop_items.price === 'number');

  const total = validItems.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    return sum + (item.shop_items.price * quantity);
  }, 0);

  if (!items.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500 text-center">Votre panier est vide</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="font-semibold text-lg">Résumé de la commande</h2>
      
      <div className="space-y-2 py-4 border-t">
        {validItems.map((item, index) => (
          <div key={item.id || index} className="flex justify-between text-sm">
            <span>{item.shop_items?.clothes?.name || 'Article inconnu'}</span>
            <span>{formatPrice(item.shop_items.price * (item.quantity || 1))}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between py-4 border-t">
        <span className="font-medium">Total</span>
        <span className="font-bold">{formatPrice(total)}</span>
      </div>

      <CheckoutButton 
        cartItems={validItems.map(item => ({ 
          id: item.id, 
          quantity: item.quantity || 1
        }))}
        isLoading={isLoading}
      />
    </div>
  );
}
