
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Package, Send, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { fr } from "date-fns/locale";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-purple-100 text-purple-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "En attente",
  paid: "Payée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

interface ShippingAddress {
  street: string;
  city: string;
  postal_code: string;
  country: string;
}

interface OrderShipment {
  id: string;
  shipping_method: string;
  tracking_number: string | null;
  tracking_url: string | null;
  shipping_cost: number | null;
  status: string;
  shipping_address: ShippingAddress;
}

export default function AdminOrders() {
  const { toast } = useToast();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["sellerOrders"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          buyer:profiles!orders_buyer_id_fkey(username),
          order_items(
            quantity,
            shop_items(
              price,
              clothes!shop_items_clothes_id_fkey(name)
            )
          ),
          order_shipments(
            id,
            shipping_method,
            tracking_number,
            tracking_url,
            shipping_cost,
            status,
            shipping_address
          )
        `)
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été mis à jour avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la commande",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            Commandes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Acheteur</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Expédition</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {format(new Date(order.created_at), "PPP", { locale: fr })}
                    </TableCell>
                    <TableCell>{order.buyer?.username || "Utilisateur inconnu"}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.order_items.map((item, index) => (
                          <div key={index} className="text-sm">
                            {item.shop_items.clothes.name} x{item.quantity}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{order.total_amount}€</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          statusColors[order.status as keyof typeof statusColors]
                        }
                      >
                        {statusLabels[order.status as keyof typeof statusLabels]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.order_shipments?.[0] ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Truck className="h-4 w-4 mr-2" />
                              Détails
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Détails de l'expédition</DialogTitle>
                              <DialogDescription>
                                Informations sur l'expédition de la commande
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              {isValidShippingAddress(order.order_shipments[0].shipping_address) && (
                                <div>
                                  <h4 className="font-medium mb-2">Adresse de livraison</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {order.order_shipments[0].shipping_address.street}<br />
                                    {order.order_shipments[0].shipping_address.city}, {order.order_shipments[0].shipping_address.postal_code}<br />
                                    {order.order_shipments[0].shipping_address.country}
                                  </p>
                                </div>
                              )}
                              <div>
                                <h4 className="font-medium mb-2">Méthode d'expédition</h4>
                                <p className="text-sm text-muted-foreground">
                                  {order.order_shipments[0].shipping_method}
                                </p>
                              </div>
                              {order.order_shipments[0].tracking_number && (
                                <div>
                                  <h4 className="font-medium mb-2">Numéro de suivi</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {order.order_shipments[0].tracking_number}
                                  </p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Pas encore expédié
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-x-2">
                        {order.status === "paid" && !order.order_shipments?.length && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateOrderStatus(order.id, "shipped")}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Marquer comme expédié
                          </Button>
                        )}
                        {order.status === "shipped" && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateOrderStatus(order.id, "delivered")}
                          >
                            <Package className="h-4 w-4 mr-2" />
                            Marquer comme livré
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Type guard to check if a value is a valid ShippingAddress
function isValidShippingAddress(value: any): value is ShippingAddress {
  return (
    typeof value === 'object' &&
    value !== null &&
    'street' in value &&
    'city' in value &&
    'postal_code' in value &&
    'country' in value
  );
}
