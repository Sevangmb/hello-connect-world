
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { useShop } from '@/hooks/useShop';

interface ShopOrdersListProps {
  shopId: string;
}

export function ShopOrdersList({ shopId }: ShopOrdersListProps) {
  const { getShopOrders, updateOrderStatus } = useShop(null);
  const { data: orders, isLoading, error } = getShopOrders(shopId);
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Erreur lors du chargement des commandes: {error.message}
      </div>
    );
  }
  
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Vous n'avez pas encore reçu de commandes.
      </div>
    );
  }
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'shipped': return 'outline';
      case 'delivered': return 'success';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      case 'returned': return 'Retournée';
      default: return status;
    }
  };
  
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status: newStatus });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };
  
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="bg-muted/50 py-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Commande #{order.id.substring(0, 8)}</CardTitle>
              <Badge variant={getStatusBadgeVariant(order.status)}>
                {getStatusLabel(order.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Date:</span>
              <span>{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">{formatPrice(order.total_amount)}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-foreground">Paiement:</span>
              <span>{order.payment_status === 'paid' ? 'Payé' : 'En attente'}</span>
            </div>
            
            <h4 className="font-medium mb-2">Articles</h4>
            <ul className="space-y-2 mb-4">
              {order.items.map((item) => (
                <li key={item.id} className="text-sm flex justify-between">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            
            {order.status === 'pending' && (
              <div className="flex gap-2 mt-4">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                >
                  Confirmer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                >
                  Annuler
                </Button>
              </div>
            )}
            
            {order.status === 'confirmed' && (
              <Button
                variant="default"
                size="sm"
                className="w-full"
                onClick={() => handleUpdateStatus(order.id, 'shipped')}
              >
                Marquer comme expédié
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
