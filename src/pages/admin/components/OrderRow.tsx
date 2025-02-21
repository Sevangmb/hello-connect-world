
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Send, Truck } from "lucide-react";
import { Order, statusColors, statusLabels } from "../types/orders";
import { ShippingDetails } from "./ShippingDetails";

interface OrderRowProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: string) => void;
}

export function OrderRow({ order, onUpdateStatus }: OrderRowProps) {
  return (
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
            statusColors[order.status]
          }
        >
          {statusLabels[order.status]}
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
            <ShippingDetails shipment={order.order_shipments[0]} />
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
              onClick={() => onUpdateStatus(order.id, "shipped")}
            >
              <Send className="h-4 w-4 mr-2" />
              Marquer comme expédié
            </Button>
          )}
          {order.status === "shipped" && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus(order.id, "delivered")}
            >
              <Package className="h-4 w-4 mr-2" />
              Marquer comme livré
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
