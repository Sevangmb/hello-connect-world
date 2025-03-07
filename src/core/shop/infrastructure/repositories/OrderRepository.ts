
import { supabase } from '@/integrations/supabase/client';
import { Order, mapOrder, mapOrders } from '../../domain/types';
import { IOrderRepository } from '../../domain/interfaces/IOrderRepository';

export class OrderRepository implements IOrderRepository {
  async getShopOrders(shopId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('seller_id', shopId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shop orders:', error);
      return [];
    }

    return mapOrders(data || []);
  }

  async getCustomerOrders(customerId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('buyer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customer orders:', error);
      return [];
    }

    return mapOrders(data || []);
  }

  async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return mapOrder(data);
  }

  async createOrder(orderData: Omit<Order, "id" | "created_at" | "updated_at">): Promise<Order | null> {
    // Prepare order items if they exist
    const orderItems = orderData.items || [];
    
    // Remove items from order data for initial insert
    const { items, ...orderWithoutItems } = orderData;
    
    // First, create the order
    const orderToCreate = {
      seller_id: orderData.shop_id,
      buyer_id: orderData.customer_id,
      status: orderData.status,
      total_amount: orderData.total_amount,
      delivery_fee: orderData.delivery_fee || 0,
      payment_status: orderData.payment_status,
      payment_method: orderData.payment_method,
      delivery_address: orderData.delivery_address
    };
    
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert(orderToCreate)
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return null;
    }

    // Then, create order items if they exist
    if (orderItems.length > 0) {
      const itemsToCreate = orderItems.map(item => ({
        order_id: newOrder.id,
        shop_item_id: item.shop_item_id,
        price_at_time: item.price_at_time,
        quantity: item.quantity,
        name: item.name
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToCreate);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // Continue anyway, we'll return the order without items
      }
    }

    // Fetch the complete order with items
    return this.getOrderById(newOrder.id);
  }

  async updateOrderStatus(id: string, status: string): Promise<boolean> {
    const { error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating order status:', error);
      return false;
    }

    return true;
  }

  async updatePaymentStatus(id: string, status: string): Promise<boolean> {
    const { error } = await supabase
      .from('orders')
      .update({
        payment_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating payment status:', error);
      return false;
    }

    return true;
  }
}
