
import React from 'react';
import { Order, OrderStatus } from '@/core/shop/domain/types';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ShopOrdersListProps {
  shopId: string;
}

export const ShopOrdersList: React.FC<ShopOrdersListProps> = ({ shopId }) => {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const shopService = getShopService();
      const fetchedOrders = await shopService.getOrders(shopId);
      setOrders(fetchedOrders);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch orders'));
    } finally {
      setLoading(false);
    }
  };
  
  React.useEffect(() => {
    fetchOrders();
  }, [shopId]);
  
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const shopService = getShopService();
      await shopService.updateOrder(orderId, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };
  
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-200 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-200 text-blue-800';
      case 'shipped':
        return 'bg-purple-200 text-purple-800';
      case 'delivered':
        return 'bg-green-200 text-green-800';
      case 'cancelled':
        return 'bg-red-200 text-red-800';
      case 'returned':
        return 'bg-gray-200 text-gray-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };
  
  if (loading) {
    return <div>Chargement des commandes...</div>;
  }
  
  if (error) {
    return <div>Erreur: {error.message}</div>;
  }
  
  if (orders.length === 0) {
    return <div>Aucune commande trouvée.</div>;
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Commandes</h2>
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Commande #{order.id.substring(0, 8)}</CardTitle>
              <Badge className={getStatusColor(order.status)}>
                {order.status === 'pending' && 'En attente'}
                {order.status === 'confirmed' && 'Confirmée'}
                {order.status === 'shipped' && 'Expédiée'}
                {order.status === 'delivered' && 'Livrée'}
                {order.status === 'cancelled' && 'Annulée'}
                {order.status === 'returned' && 'Retournée'}
              </Badge>
            </div>
            <div className="text-sm text-gray-500">
              {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium">Détails de la commande</h3>
                <p>Montant total: {order.total_amount}€</p>
                <p>
                  Statut de paiement:{' '}
                  <Badge variant={order.payment_status === 'paid' ? 'default' : 'destructive'}>
                    {order.payment_status === 'paid' && 'Payé'}
                    {order.payment_status === 'pending' && 'En attente'}
                    {order.payment_status === 'failed' && 'Échoué'}
                    {order.payment_status === 'refunded' && 'Remboursé'}
                  </Badge>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Changer le statut</h3>
                <Select
                  value={order.status}
                  onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmée</SelectItem>
                    <SelectItem value="shipped">Expédiée</SelectItem>
                    <SelectItem value="delivered">Livrée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                    <SelectItem value="returned">Retournée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium">Articles</h3>
              <ul className="mt-2 space-y-2">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>{item.price * item.quantity}€</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ShopOrdersList;
