import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface CheckoutItem {
  id: string;
  quantity: number;
}

export function useCheckout() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async (cartItems: CheckoutItem[]) => {
    try {
      // Vérifier si un paiement est déjà en cours
      if (isProcessing) {
        throw new Error("Un paiement est déjà en cours");
      }

      setIsProcessing(true);
      
      // Vérifier l'authentification
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Vous devez être connecté pour effectuer un achat");
      }

      // Vérifier le panier
      if (!cartItems?.length) {
        throw new Error("Votre panier est vide");
      }

      // Vérifier la validité des articles
      const { data: validItems, error: itemsError } = await supabase
        .from('shop_items')
        .select('id, price, stock_quantity')
        .in('id', cartItems.map(item => item.id));

      if (itemsError) {
        throw new Error("Impossible de vérifier les articles");
      }

      // Vérifier la disponibilité du stock
      const outOfStockItems = validItems.filter(item => {
        const cartItem = cartItems.find(ci => ci.id === item.id);
        return item.stock_quantity < (cartItem?.quantity || 0);
      });

      if (outOfStockItems.length > 0) {
        throw new Error("Certains articles ne sont plus disponibles en stock");
      }

      // Créer la session de paiement
      console.log("Calling create-checkout with:", { cartItems, userId: user.id });
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { cartItems, userId: user.id }
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        throw error;
      }

      if (!data?.url) {
        throw new Error('Aucune URL de paiement générée');
      }

      // Rediriger vers Stripe
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

  return {
    handleCheckout,
    isProcessing
  };
}