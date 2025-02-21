
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface CheckoutItem {
  id: string;
  quantity: number;
}

interface CheckoutButtonProps {
  cartItems: CheckoutItem[];
  isLoading?: boolean;
}

export function CheckoutButton({ cartItems, isLoading: externalLoading }: CheckoutButtonProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Vous devez être connecté pour effectuer un achat",
          variant: "destructive",
        });
        return;
      }

      if (!cartItems.length) {
        toast({
          title: "Panier vide",
          description: "Votre panier est vide",
          variant: "destructive",
        });
        return;
      }

      console.log("Calling create-checkout with:", { cartItems, userId: user.id });
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { cartItems, userId: user.id }
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        throw error;
      }

      if (!data?.url) {
        throw new Error('No checkout URL returned from server');
      }

      console.log("Redirecting to:", data.url);
      window.location.href = data.url;
      
    } catch (error) {
      console.error('Error in checkout process:', error);
      toast({
        title: "Erreur de paiement",
        description: "Impossible de procéder au paiement. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      className="w-full"
      onClick={handleCheckout}
      disabled={externalLoading || isProcessing || !cartItems.length}
    >
      <ShoppingBag className="mr-2 h-4 w-4" />
      {isProcessing ? "Traitement en cours..." : "Passer la commande"}
    </Button>
  );
}
