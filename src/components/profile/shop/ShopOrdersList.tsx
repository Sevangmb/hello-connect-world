
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Package, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatPrice } from '@/lib/utils';
import { useShop } from '@/hooks/useShop';
import { OrderStatus } from '@/core/shop/domain/types';

export function ShopOrdersList() {
  const { orders, loading } = useShop();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg bg-gray-50">
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Package className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium">Aucune commande</h3>
        <p className="text-muted-foreground mt-1">
          Vous n'avez pas encore reçu de commandes.
        </p>
      </div>
    );
  }
  
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'confirmed':
        return <Badge variant="default">Confirmée</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-500">Expédiée</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Livrée</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulée</Badge>;
      case 'returned':
        return <Badge variant="outline">Retournée</Badge>;
      default:
        return <Badge>Inconnue</Badge>;
    }
  };
  
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Commande</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Paiement</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  #{order.id.slice(0, 8)}
                </TableCell>
                <TableCell>
                  {format(new Date(order.created_at), 'dd MMM yyyy', { locale: fr })}
                </TableCell>
                <TableCell>
                  {formatPrice(order.total_amount)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(order.status)}
                </TableCell>
                <TableCell>
                  <Badge variant={
                    order.payment_status === 'paid' ? 'default' :
                    order.payment_status === 'pending' ? 'secondary' :
                    order.payment_status === 'refunded' ? 'outline' : 'destructive'
                  }>
                    {order.payment_status === 'paid' ? 'Payée' :
                     order.payment_status === 'pending' ? 'En attente' :
                     order.payment_status === 'refunded' ? 'Remboursée' : 'Échouée'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Détails
                  </Button>
                  
                  {order.status === 'confirmed' && (
                    <Button variant="default" size="sm">
                      <Truck className="h-4 w-4 mr-1" />
                      Expédier
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
