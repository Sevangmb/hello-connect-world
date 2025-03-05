
import React, { useState, useEffect } from 'react';
import { useShop } from '@/hooks/useShop';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Order, OrderStatus } from '@/core/shop/domain/types';

interface ShopOrdersListProps {
  shopId: string;
}

export const ShopOrdersList: React.FC<ShopOrdersListProps> = ({ shopId }) => {
  const { getShopOrders, updateOrderStatus } = useShop();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const fetchedOrders = await getShopOrders(shopId);
        setOrders(fetchedOrders);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les commandes.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [getShopOrders, shopId, toast]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus } 
            : order
        ) as Order[]
      );
      
      toast({
        title: "Statut mis à jour",
        description: `Le statut de la commande a été mis à jour avec succès en "${newStatus}".`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la commande.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex h-48 w-full flex-col items-center justify-center">
        <h3 className="text-lg font-medium">Aucune commande</h3>
        <p className="text-muted-foreground">Vous n'avez pas encore reçu de commandes.</p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
              <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{order.customer_id.slice(0, 8)}</TableCell>
              <TableCell>{order.total_amount.toFixed(2)} €</TableCell>
              <TableCell>
                <span className={
                  order.status === 'pending' ? "rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800" :
                  order.status === 'confirmed' ? "rounded bg-blue-100 px-2 py-1 text-xs text-blue-800" :
                  order.status === 'shipped' ? "rounded bg-indigo-100 px-2 py-1 text-xs text-indigo-800" :
                  order.status === 'delivered' ? "rounded bg-green-100 px-2 py-1 text-xs text-green-800" :
                  order.status === 'cancelled' ? "rounded bg-red-100 px-2 py-1 text-xs text-red-800" :
                  "rounded bg-gray-100 px-2 py-1 text-xs text-gray-800"
                }>
                  {order.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <Button 
                      onClick={() => handleUpdateStatus(order.id, 'confirmed')} 
                      variant="outline" 
                      size="sm"
                    >
                      Confirmer
                    </Button>
                  )}
                  {order.status === 'confirmed' && (
                    <Button 
                      onClick={() => handleUpdateStatus(order.id, 'shipped')} 
                      variant="outline" 
                      size="sm"
                    >
                      Expédier
                    </Button>
                  )}
                  {order.status === 'shipped' && (
                    <Button 
                      onClick={() => handleUpdateStatus(order.id, 'delivered')} 
                      variant="success" 
                      size="sm"
                    >
                      Livré
                    </Button>
                  )}
                  {(order.status === 'pending' || order.status === 'confirmed') && (
                    <Button 
                      onClick={() => handleUpdateStatus(order.id, 'cancelled')} 
                      variant="destructive" 
                      size="sm"
                    >
                      Annuler
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
