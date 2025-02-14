
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

export function PurchasesSection() {
  const { data: purchases, isLoading } = useQuery({
    queryKey: ['myPurchases'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            shop_items (
              *,
              clothes!clothes_id (*)
            )
          ),
          profiles!seller_id (username)
        `)
        .eq("buyer_id", user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!purchases?.length) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">Aucun achat</h3>
          <p className="text-muted-foreground">
            Vous n'avez pas encore effectué d'achat
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {purchases.map((purchase) => (
        <Card key={purchase.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">
                Achat chez {purchase.profiles?.username || "Boutique inconnue"}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(purchase.created_at).toLocaleDateString()}
              </p>
              <div className="mt-2">
                {purchase.order_items.map((item) => (
                  <div key={item.id} className="text-sm">
                    {item.shop_items.clothes.name} x{item.quantity}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{purchase.total_amount}€</p>
              <p className="text-sm capitalize text-muted-foreground">
                {purchase.status}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
