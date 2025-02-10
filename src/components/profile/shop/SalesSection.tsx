
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

export function SalesSection() {
  const { data: sales, isLoading } = useQuery({
    queryKey: ['mySales'],
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
              clothes (*)
            )
          ),
          profiles:buyer_id (username)
        `)
        .eq("seller_id", user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!sales?.length) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">Aucune vente</h3>
          <p className="text-muted-foreground">
            Vous n'avez pas encore effectué de vente
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sales.map((sale) => (
        <Card key={sale.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">
                Commande de {sale.profiles?.username || "Utilisateur inconnu"}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(sale.created_at).toLocaleDateString()}
              </p>
              <div className="mt-2">
                {sale.order_items.map((item) => (
                  <div key={item.id} className="text-sm">
                    {item.shop_items.clothes.name} x{item.quantity}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{sale.total_amount}€</p>
              <p className="text-sm capitalize text-muted-foreground">
                {sale.status}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
