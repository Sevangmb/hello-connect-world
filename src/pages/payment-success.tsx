
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { toast } = useToast();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            shop_items (
              *,
              clothes (*)
            )
          ),
          profiles!seller_id (username)
        `)
        .eq("id", orderId)
        .eq("buyer_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!orderId
  });

  useEffect(() => {
    if (!orderId) {
      toast({
        title: "Erreur",
        description: "Identifiant de commande manquant",
        variant: "destructive",
      });
    }
  }, [orderId, toast]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!order) {
    return (
      <Card className="p-6 max-w-2xl mx-auto mt-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Commande introuvable</h1>
          <p className="text-muted-foreground">
            Nous n'avons pas pu trouver les détails de votre commande.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto mt-8">
      <div className="text-center mb-6">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Paiement réussi !</h1>
        <p className="text-muted-foreground">
          Votre commande a été confirmée et sera bientôt traitée.
        </p>
      </div>

      <div className="space-y-4">
        <div className="border-b pb-4">
          <h2 className="font-semibold mb-2">Détails de la commande</h2>
          <p className="text-sm text-muted-foreground">
            Commande #{order.id.slice(0, 8)}
          </p>
          <p className="text-sm text-muted-foreground">
            Vendeur: {order.profiles?.username || "Vendeur inconnu"}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Articles</h3>
          {order.order_items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p>{item.shop_items.clothes.name}</p>
                <p className="text-sm text-muted-foreground">
                  Quantité: {item.quantity}
                </p>
              </div>
              <p className="font-medium">{item.price_at_time}€</p>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Total</p>
            <p className="font-semibold">{order.total_amount}€</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
