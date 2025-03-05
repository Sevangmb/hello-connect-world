
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getShopServiceInstance } from '@/core/shop/infrastructure/ShopServiceProvider';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-indigo-100 text-indigo-800',
  cancelled: 'bg-red-100 text-red-800',
  returned: 'bg-gray-100 text-gray-800',
};

interface ShopOrdersListProps {
  shopId: string;
}

export const ShopOrdersList: React.FC<ShopOrdersListProps> = ({ shopId }) => {
  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ['shop-orders', shopId],
    queryFn: async () => {
      const shopService = getShopServiceInstance();
      return shopService.getOrders(shopId);
    },
  });

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const shopService = getShopServiceInstance();
      await shopService.updateOrder(orderId, { status: newStatus });
      refetch();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error loading orders</div>;
  }

  if (!orders || orders.length === 0) {
    return <div>No orders found</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>ID commande</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                {format(new Date(order.created_at), 'PP', { locale: fr })}
              </TableCell>
              <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
              <TableCell>{order.customer_id.slice(0, 8)}</TableCell>
              <TableCell>{order.total_amount}€</TableCell>
              <TableCell>
                <Badge className={(STATUS_COLORS as any)[order.status] || 'bg-gray-100'}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                {order.status === 'paid' && (
                  <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'shipped')}>
                    Marquer comme expédié
                  </Button>
                )}
                {order.status === 'shipped' && (
                  <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'delivered')}>
                    Marquer comme livré
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
