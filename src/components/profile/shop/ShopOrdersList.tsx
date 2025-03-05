import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shopApiGateway } from '@/services/api-gateway/ShopApiGateway';
import { Order, OrderStatus } from '@/core/shop/domain/types';
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button';

const ShopOrdersList = ({ shopId }: { shopId: string }) => {
  const queryClient = useQueryClient();
  
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['shopOrders', shopId],
    queryFn: () => shopApiGateway.getShopOrders(shopId),
  });
  
  const updateOrderStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => {
      return shopApiGateway.updateOrderStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['shopOrders', shopId]);
    },
  });
  
  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus.mutate({ id: orderId, status: newStatus });
  };
  
  if (isLoading) {
    return <div>Loading orders...</div>;
  }
  
  if (isError) {
    return <div>Error loading orders.</div>;
  }
  
  if (!orders || orders.length === 0) {
    return <div>No orders found.</div>;
  }
  
  return (
    <div>
      {orders.map((order) => (
        <div key={order.id} className="mb-4 p-4 border rounded-md">
          <h3 className="text-lg font-semibold">Order ID: {order.id}</h3>
          <p>Customer ID: {order.customer_id}</p>
          <p>Total Amount: ${order.total_amount}</p>
          <p>Payment Status: {order.payment_status}</p>
          <p>
            Status: 
            <Badge variant="outline" className="capitalize">
              {order.status}
            </Badge>
          </p>
          <div className="flex gap-2 mt-2">
            {order.status !== 'delivered' && (
              <Button 
                variant="outline"
                onClick={() => handleUpdateStatus(order.id, 'delivered')}
              >
                Mark as Delivered
              </Button>
            )}
            
            {order.status !== 'cancelled' && (
              <Button 
                variant="destructive"
                onClick={() => handleUpdateStatus(order.id, 'cancelled')}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopOrdersList;
