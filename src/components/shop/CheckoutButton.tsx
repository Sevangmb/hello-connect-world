
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCheckout, CheckoutItem } from "@/hooks/useCheckout";

interface CheckoutButtonProps {
  cartItems: CheckoutItem[];
  isLoading?: boolean;
}

export function CheckoutButton({ cartItems, isLoading: externalLoading }: CheckoutButtonProps) {
  const { handleCheckout, isProcessing } = useCheckout();

  return (
    <Button
      className="w-full"
      onClick={() => handleCheckout(cartItems)}
      disabled={externalLoading || isProcessing || !cartItems.length}
    >
      <ShoppingBag className="mr-2 h-4 w-4" />
      {isProcessing ? "Traitement en cours..." : "Passer la commande"}
    </Button>
  );
}
