
import React from 'react';
import { useShop } from '@/hooks/useShop';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order, OrderStatus } from '@/core/shop/domain/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const ShopOrdersList: React.FC = () => {
  const { useShopOrders, useUpdateOrderStatus } = useShop();
  const { data: orders, isLoading, error } = useShopOrders();
  const updateOrderStatus = useUpdateOrderStatus();

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error loading orders: {error.message}</div>;
  }

  if (!orders || orders.length === 0) {
    return <div>No orders yet.</div>;
  }

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus.mutate({ orderId, status });
  };

  const getStatusBadgeColor = (status: OrderStatus) => {
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
      <h2 className="text-2xl font-bold">Your Orders</h2>
      {orders.map((order: Order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Order #{order.id.substring(0, 8)}</span>
              <Badge className={getStatusBadgeColor(order.status)}>
                {order.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Customer ID:</strong> {order.customer_id}</p>
              <p><strong>Total:</strong> €{order.total_amount}</p>
              <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
              
              <div className="mt-3">
                <h4 className="font-medium">Items:</h4>
                <ul className="list-disc list-inside">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} (x{item.quantity}) - €{item.price}
                    </li>
                  ))}
                </ul>
              </div>
              
              {order.status === 'pending' && (
                <div className="flex space-x-2 mt-3">
                  <Button 
                    size="sm" 
                    onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                    disabled={updateOrderStatus.isPending}
                  >
                    Confirm
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                    disabled={updateOrderStatus.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              
              {order.status === 'confirmed' && (
                <Button 
                  size="sm" 
                  onClick={() => handleUpdateStatus(order.id, 'shipped')}
                  disabled={updateOrderStatus.isPending}
                >
                  Mark as Shipped
                </Button>
              )}
              
              {order.status === 'shipped' && (
                <Button 
                  size="sm" 
                  onClick={() => handleUpdateStatus(order.id, 'delivered')}
                  disabled={updateOrderStatus.isPending}
                >
                  Mark as Delivered
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
