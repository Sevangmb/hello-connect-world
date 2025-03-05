
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useShop } from '@/hooks/useShop';
import { Loader2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/core/shop/domain/types';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ShopOrdersListProps {
  shopId: string;
}

export function ShopOrdersList({ shopId }: ShopOrdersListProps) {
  const { getShopOrders, updateOrderStatus } = useShop(shopId);
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const items = await getShopOrders(shopId);
        setOrders(items);
      } catch (error) {
        console.error('Error loading shop orders:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les commandes. Veuillez réessayer.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [shopId, getShopOrders, toast]);

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status });
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      
      toast({
        title: 'Statut mis à jour',
        description: `Le statut de la commande a été changé à ${status}`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      case 'confirmed':
        return <Badge variant="secondary">Confirmée</Badge>;
      case 'shipped':
        return <Badge>Expédiée</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Livrée</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulée</Badge>;
      case 'returned':
        return <Badge variant="destructive">Retournée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: Order['payment_status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      case 'paid':
        return <Badge className="bg-green-500">Payée</Badge>;
      case 'refunded':
        return <Badge variant="secondary">Remboursée</Badge>;
      case 'failed':
        return <Badge variant="destructive">Échouée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Aucune commande</h3>
        <p className="text-muted-foreground">
          Vous n'avez reçu aucune commande pour le moment.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Commande</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Paiement</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {order.total_amount.toFixed(2)} €
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(order.payment_status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                      
                      {order.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(order.id, 'confirmed')}
                        >
                          Accepter
                        </Button>
                      )}
                      
                      {order.status === 'confirmed' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(order.id, 'shipped')}
                        >
                          Expédier
                        </Button>
                      )}
                      
                      {(order.status === 'shipped' || order.status === 'confirmed') && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(order.id, 'delivered')}
                        >
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
  );
}
