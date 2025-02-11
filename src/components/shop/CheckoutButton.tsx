
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      // Vérifier si l'utilisateur est connecté
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour continuer vos achats",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // Créer la commande
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          buyer_id: user.id,
          seller_id: items[0].seller_id,
          total_amount: items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0),
          status: "pending"
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        throw new Error("Erreur lors de la création de la commande");
      }

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

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        throw new Error("Erreur lors de la création des éléments de la commande");
      }

      // Initialiser la session de paiement Stripe
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          items,
          order_id: order.id
        }
      });

      if (error) {
        console.error('Error invoking create-checkout:', error);
        throw error;
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Aucune URL de paiement reçue');
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
