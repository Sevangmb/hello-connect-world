
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useShop } from "@/hooks/useShop";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle, Truck, Clock, Ban, Package, ExternalLink } from "lucide-react";

export const ShopOrdersList = ({ shop }) => {
  const { 
    getShopOrders, 
    updateOrderStatus 
  } = useShop();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shop?.id) {
      fetchOrders();
    }
  }, [shop]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const shopOrders = await getShopOrders(shop.id);
      setOrders(shopOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" /> En attente</Badge>;
      case "confirmed":
        return <Badge><CheckCircle className="mr-1 h-3 w-3" /> Confirmé</Badge>;
      case "shipped":
        return <Badge variant="default"><Truck className="mr-1 h-3 w-3" /> Expédié</Badge>;
      case "delivered":
        return <Badge variant="outline"><Package className="mr-1 h-3 w-3" /> Livré</Badge>;
      case "cancelled":
        return <Badge variant="destructive"><Ban className="mr-1 h-3 w-3" /> Annulé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const renderOrderActions = (order) => {
    switch (order.status) {
      case "pending":
        return (
          <>
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => handleUpdateStatus(order.id, "confirmed")}
              className="mr-2"
            >
              <CheckCircle className="mr-1 h-3 w-3" /> Confirmer
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleUpdateStatus(order.id, "cancelled")}
            >
              <Ban className="mr-1 h-3 w-3" /> Annuler
            </Button>
          </>
        );
      case "confirmed":
        return (
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => handleUpdateStatus(order.id, "shipped")}
          >
            <Truck className="mr-1 h-3 w-3" /> Marquer comme expédié
          </Button>
        );
      case "shipped":
        return (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleUpdateStatus(order.id, "delivered")}
          >
            <Package className="mr-1 h-3 w-3" /> Marquer comme livré
          </Button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div>Chargement des commandes...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commandes</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p>Aucune commande pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium">Commande #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(order.created_at), 'PPp', { locale: fr })}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium">Articles:</p>
                  <ul className="text-sm">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex justify-between">
                        <span>{item.name} x{item.quantity}</span>
                        <span>{(item.price * item.quantity).toFixed(2)} €</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-between text-sm font-medium mb-3">
                  <span>Total:</span>
                  <span>{order.total_amount.toFixed(2)} €</span>
                </div>
                
                <div className="flex justify-end space-x-2 mt-4">
                  {renderOrderActions(order)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShopOrdersList;
