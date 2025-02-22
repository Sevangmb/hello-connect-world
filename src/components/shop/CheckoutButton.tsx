import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCheckout, CheckoutItem } from "@/hooks/useCheckout";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CheckoutButtonProps {
  cartItems: CheckoutItem[];
  isLoading?: boolean;
}

export function CheckoutButton({ cartItems, isLoading: externalLoading }: CheckoutButtonProps) {
  const { handleCheckout, isProcessing } = useCheckout();
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);

  const handleClick = async () => {
    try {
      if (retryCount >= 3) {
        toast({
          title: "Erreur",
          description: "Trop de tentatives. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
        return;
      }

      await handleCheckout(cartItems);
    } catch (error) {
      setRetryCount(prev => prev + 1);
      console.error('Checkout error:', error);
    }
  };

  return (
    <Button
      className="w-full"
      onClick={handleClick}
      disabled={externalLoading || isProcessing || !cartItems.length || retryCount >= 3}
    >
      <ShoppingBag className="mr-2 h-4 w-4" />
      {isProcessing ? "Traitement en cours..." : 
       retryCount >= 3 ? "Réessayez plus tard" : 
       "Passer la commande"}
    </Button>
  );
}