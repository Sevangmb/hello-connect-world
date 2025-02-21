
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/hooks/useCart";
import { CheckoutButton } from "./CheckoutButton";

interface CartSummaryProps {
  items: CartItem[];
  isLoading?: boolean;
}

export function CartSummary({ items, isLoading }: CartSummaryProps) {
  const total = items.reduce((sum, item) => {
    // Add null checks and default values
    if (!item?.shop_items?.price) {
      console.warn('Invalid cart item detected:', item);
      return sum;
    }
    return sum + (item.shop_items.price * (item.quantity || 1));
  }, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="font-semibold text-lg">Résumé de la commande</h2>
      
      {/* Show item details */}
      <div className="space-y-2 py-4 border-t">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{item.shop_items?.clothes?.name || 'Article inconnu'}</span>
            <span>
              {item.shop_items?.price 
                ? formatPrice(item.shop_items.price * (item.quantity || 1))
                : '-'
              }
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between py-4 border-t">
        <span className="font-medium">Total</span>
        <span className="font-bold">{formatPrice(total)}</span>
      </div>

      <CheckoutButton 
        cartItems={items.map(item => ({ 
          id: item.id, 
          quantity: item.quantity 
        }))}
        isLoading={isLoading}
      />
    </div>
  );
}
