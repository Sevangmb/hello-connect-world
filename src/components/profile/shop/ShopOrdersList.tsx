
import { useState, useEffect } from 'react';
import { useShop } from '@/hooks/useShop';
import { Order } from '@/core/shop/domain/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

interface ShopOrdersListProps {
  shopId: string;
}

export function ShopOrdersList({ shopId }: ShopOrdersListProps) {
  const { getShopOrders, updateOrderStatus } = useShop();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const shopOrders = await getShopOrders(shopId);
        setOrders(shopOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchOrders();
    }
  }, [shopId, getShopOrders]);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus.mutateAsync({ id: orderId, status });
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Aucune commande pour cette boutique</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Paiement</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
            <TableCell>{format(new Date(order.created_at), 'dd/MM/yyyy')}</TableCell>
            <TableCell>{order.total_amount.toFixed(2)} €</TableCell>
            <TableCell>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                order.status === 'delivered' ? 'bg-primary/20 text-primary-foreground' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status}
              </span>
            </TableCell>
            <TableCell>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.payment_status === 'refunded' ? 'bg-blue-100 text-blue-800' :
                order.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.payment_status}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                {order.status === 'pending' && (
                  <Button 
                    size="sm" 
                    variant="success"
                    onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                    disabled={updateOrderStatus.isPending}
                  >
                    Confirmer
                  </Button>
                )}
                {order.status === 'confirmed' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusUpdate(order.id, 'shipped')}
                    disabled={updateOrderStatus.isPending}
                  >
                    Expédier
                  </Button>
                )}
                {order.status === 'shipped' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusUpdate(order.id, 'delivered')}
                    disabled={updateOrderStatus.isPending}
                  >
                    Livré
                  </Button>
                )}
                {(order.status === 'pending' || order.status === 'confirmed') && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                    disabled={updateOrderStatus.isPending}
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
  );
}
