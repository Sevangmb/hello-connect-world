
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useShop } from '@/hooks/useShop';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'confirmed':
      return 'default';
    case 'shipped':
      return 'outline';
    case 'delivered':
      return 'default'; // Use default instead of success
    case 'cancelled':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const ShopOrdersList = ({ shopId }: { shopId: string }) => {
  const { getShopOrders, updateOrderStatus } = useShop();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getShopOrders(shopId);
        setOrders(ordersData || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les commandes',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [shopId, getShopOrders, toast]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const success = await updateOrderStatus({
        id: orderId,
        status: newStatus
      });

      if (success) {
        setOrders(prev => 
          prev.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );

        toast({
          title: 'Statut mis à jour',
          description: `La commande a été mise à jour avec le statut : ${newStatus}`,
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut de la commande',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Chargement des commandes...</div>;
  }

  if (!orders.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commandes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Aucune commande pour le moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commandes ({orders.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">Commande #{order.id.substring(0, 8)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()} - {order.total_amount}€
                  </p>
                </div>
                <Badge variant={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">Articles</h4>
                <ul className="text-sm">
                  {order.items?.map((item: any) => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.name || 'Article'}</span>
                      <span>{item.quantity} x {item.price}€</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between items-center">
                <Select
                  defaultValue={order.status}
                  onValueChange={(value) => handleStatusChange(order.id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Mettre à jour le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmée</SelectItem>
                    <SelectItem value="shipped">Expédiée</SelectItem>
                    <SelectItem value="delivered">Livrée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm">Détails</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopOrdersList;
