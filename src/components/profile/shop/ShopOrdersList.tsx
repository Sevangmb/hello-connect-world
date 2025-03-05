
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Order, OrderStatus } from '@/core/shop/domain/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';

interface ShopOrdersListProps {
  shopId: string;
}

const ShopOrdersList: React.FC<ShopOrdersListProps> = ({ shopId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load shop orders
  const loadOrders = async () => {
    try {
      setLoading(true);
      // Get shop orders (this would be implemented in a real hook)
      // const data = await getShopOrders(shopId);
      const data: Order[] = []; // Placeholder for real data
      setOrders(data);
    } catch (error) {
      console.error('Error loading shop orders:', error);
      toast({
        variant: "destructive",
        title: "Error loading orders",
        description: "There was a problem loading the shop orders."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [shopId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle order status change
  const handleStatusChange = async (id: string, status: OrderStatus) => {
    try {
      // This would be implemented in a real hook
      // await updateOrderStatus.mutateAsync({ id, status });
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === id ? { ...order, status } : order
        ) as Order[]
      );
      
      toast({
        title: "Status updated",
        description: `Order status has been updated to ${status}.`
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: "There was a problem updating the order status."
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <ShoppingCart className="h-10 w-10 text-gray-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="text-sm text-gray-500 mt-1">
              Your shop hasn't received any orders yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={
                    order.status === 'delivered' ? 'success' :
                    order.status === 'shipped' ? 'secondary' :
                    order.status === 'cancelled' ? 'destructive' :
                    'default'
                  }>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* View order details */}}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ShopOrdersList;
