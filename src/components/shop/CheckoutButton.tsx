
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag } from "lucide-react";

interface CheckoutButtonProps {
  cartItems: {
    id: string;
    quantity: number;
  }[];
  isLoading?: boolean;
}

export function CheckoutButton({ cartItems, isLoading }: CheckoutButtonProps) {
  const { toast } = useToast();

  const handleCheckout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer un achat",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { cartItems, userId: user.id }
      });

      if (error) throw error;

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Erreur",
        description: "Impossible de procéder au paiement",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      className="w-full"
      onClick={handleCheckout}
      disabled={isLoading || !cartItems.length}
    >
      <ShoppingBag className="mr-2 h-4 w-4" />
      Passer la commande
    </Button>
  );
}
