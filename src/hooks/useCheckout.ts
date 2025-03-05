
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useInvoiceGenerator } from "@/hooks/useInvoiceGenerator";

export interface CheckoutItem {
  id: string;
  quantity: number;
}

export function useCheckout() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { generateInvoice } = useInvoiceGenerator();

  const handleCheckout = async (cartItems: CheckoutItem[]) => {
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

      // Si des orderId sont retournés, nous pouvons générer des factures ici ou après le retour du paiement
      if (data.orderIds && data.orderIds.length > 0) {
        // Stocker les orderIds dans le localStorage pour les récupérer après le paiement
        localStorage.setItem('pendingOrderIds', JSON.stringify(data.orderIds));
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

  const handlePaymentSuccess = async () => {
    // Vérifier si nous avons des commandes en attente
    const pendingOrderIds = localStorage.getItem('pendingOrderIds');
    
    if (pendingOrderIds) {
      try {
        const orderIds = JSON.parse(pendingOrderIds);
        
        // Génération de factures pour chaque commande
        for (const orderId of orderIds) {
          await generateInvoice(orderId);
        }
        
        // Supprimer les IDs des commandes en attente
        localStorage.removeItem('pendingOrderIds');
        
        toast({
          title: "Achat réussi",
          description: "Votre achat a été effectué avec succès et vos factures sont disponibles.",
          variant: "default",
        });
      } catch (error) {
        console.error('Erreur lors de la génération des factures après paiement:', error);
      }
    }
  };

  return {
    handleCheckout,
    handlePaymentSuccess,
    isProcessing
  };
}
