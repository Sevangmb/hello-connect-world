
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CheckoutButtonProps {
  items: Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    quantity?: number;
    shop_id?: string;
    seller_id?: string;
  }>;
}

export function CheckoutButton({ items }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vous devez être connecté pour effectuer un achat");

      // Créer la commande
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          buyer_id: user.id,
          seller_id: items[0].seller_id, // Pour l'instant, on suppose que tous les articles viennent du même vendeur
          total_amount: items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0),
          status: "pending"
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Créer les éléments de la commande
      const orderItems = items.map(item => ({
        order_id: order.id,
        shop_item_id: item.id,
        quantity: item.quantity || 1,
        price_at_time: item.price
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Initialiser la session de paiement Stripe
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          items,
          order_id: order.id
        }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error initiating checkout:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'initialisation du paiement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCheckout} 
      disabled={loading || items.length === 0}
      className="w-full"
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {loading ? "Chargement..." : "Payer"}
    </Button>
  );
}
