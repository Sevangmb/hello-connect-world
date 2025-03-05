
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { useQuery } from '@tanstack/react-query';
import { Order, OrderStatus } from '@/core/shop/domain/types';

interface ShopOrdersListProps {
  shopId: string;
}

const ShopOrdersList: React.FC<ShopOrdersListProps> = ({ shopId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const shopService = getShopService();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['shop-orders', shopId],
    queryFn: () => shopService.getShopOrders(shopId)
  });
  
  useEffect(() => {
    if (data) {
      setOrders(data);
    }
  }, [data]);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await shopService.updateOrderStatus(orderId, status);
      // Refresh orders
      const updatedOrders = await shopService.getShopOrders(shopId);
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (isLoading) {
    return <div>Chargement des commandes...</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement des commandes</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center py-10">Aucune commande pour l'instant</div>;
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Commandes</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Commande</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
              <TableCell>{order.customer_id.substring(0, 8)}</TableCell>
              <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{order.total_amount}€</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeVariant(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {order.status === 'pending' && (
                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(order.id, 'confirmed' as OrderStatus)}>
                      Confirmer
                    </Button>
                  )}
                  {order.status === 'confirmed' && (
                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(order.id, 'shipped' as OrderStatus)}>
                      Expédier
                    </Button>
                  )}
                  {order.status === 'shipped' && (
                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(order.id, 'delivered' as OrderStatus)}>
                      Livré
                    </Button>
                  )}
                  {(order.status === 'pending' || order.status === 'confirmed') && (
                    <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(order.id, 'cancelled' as OrderStatus)}>
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

export default ShopOrdersList;
