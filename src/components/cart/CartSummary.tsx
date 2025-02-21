
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/hooks/useCart";
import { CheckoutButton } from "./CheckoutButton";

interface CartSummaryProps {
  items: CartItem[];
  isLoading?: boolean;
}

export function CartSummary({ items, isLoading }: CartSummaryProps) {
  // Early return if items is undefined or null
  if (!items) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500 text-center">Chargement...</p>
      </div>
    );
  }

  // Early return for empty cart
  if (items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500 text-center">Votre panier est vide</p>
      </div>
    );
  }

  // Filter and validate items with more detailed validation
  const validItems = items.filter((item): item is CartItem => {
    if (!item?.shop_items?.price || typeof item.shop_items.price !== 'number') {
      console.warn('Invalid cart item detected:', item?.id);
      return false;
    }

    if (!item.quantity || item.quantity <= 0) {
      console.warn('Invalid quantity for cart item:', item.id);
      return false;
    }

    return true;
  });

  // Early return if no valid items
  if (validItems.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-yellow-600 text-sm">
          Attention: Aucun article valide dans le panier
        </p>
      </div>
    );
  }

  // Calculate total with safe access
  const total = validItems.reduce((sum, item) => {
    const price = item.shop_items?.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="font-semibold text-lg">Résumé de la commande</h2>
      
      <div className="space-y-2 py-4 border-t">
        {validItems.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.shop_items?.clothes?.name || 'Article inconnu'}</span>
            <span>{formatPrice((item.shop_items?.price || 0) * item.quantity)}</span>
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
          quantity: item.quantity
        }))}
        isLoading={isLoading}
      />
    </div>
  );
}
