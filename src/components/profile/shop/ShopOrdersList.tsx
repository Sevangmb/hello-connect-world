
import React from 'react';
import { useShop } from '@/hooks/useShop';
import { Order, OrderStatus } from '@/core/shop/domain/types';
import { Badge } from '@/components/ui/badge';

export interface ShopOrdersListProps {
  shopId: string;
}

export default function ShopOrdersList({ shopId }: ShopOrdersListProps) {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Mock implementation for the shop hooks
  const getShopOrders = async (shopId: string) => {
    // Mock implementation
    return [] as Order[];
  };
  
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    // Mock implementation
    return true;
  };

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getShopOrders(shopId);
        setOrders(data);
      } catch (err) {
        setError('Failed to load shop orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [shopId]);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      // Use the mutation directly with object
      const success = await updateOrderStatus(orderId, status);
      
      if (success) {
        // Refresh orders after status change
        const data = await getShopOrders(shopId);
        setOrders(data);
      }
    } catch (err) {
      setError('Failed to update order status');
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading shop orders...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found for this shop.</div>;
  }

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return 'outline';
      case 'shipped':
        return 'secondary';
      case 'delivered':
        return 'default'; // changed from 'success' to 'default'
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Shop Orders</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {order.id.substring(0, 8)}...
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {order.customer_id.substring(0, 8)}...
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="text-sm font-medium">
                    ${order.total_amount.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status}
                  </Badge>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(order.id, "confirmed")}
                          className="px-2 py-1 text-xs bg-green-500 text-white rounded"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order.id, "cancelled")}
                          className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {order.status === "confirmed" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "shipped")}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
                      >
                        Mark as Shipped
                      </button>
                    )}
                    {order.status === "shipped" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "delivered")}
                        className="px-2 py-1 text-xs bg-purple-500 text-white rounded"
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Fix for correct imports in parent files
export { default as ShopOrdersList } from './ShopOrdersList';
