
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderStatus, PaymentStatus, DbOrder, mapOrder, mapOrders } from '../../domain/types';
import { IOrderRepository } from '../../domain/interfaces/IOrderRepository';
import { useToast } from '@/hooks/use-toast';

export class OrderRepository implements IOrderRepository {
  async getOrderById(id: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return mapOrder(data);
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      return null;
    }
  }

  async getShopOrders(shopId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return mapOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders by shop ID:', error);
      return [];
    }
  }

  async getCustomerOrders(customerId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('buyer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return mapOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders by user ID:', error);
      return [];
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  async updatePaymentStatus(orderId: string, status: PaymentStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating payment status:', error);
      return false;
    }
  }

  async createOrder(orderData: Partial<Order>): Promise<Order | null> {
    try {
      // Map the order fields to match database schema
      const dbOrder: DbOrder = {
        id: orderData.id || crypto.randomUUID(),
        buyer_id: orderData.customer_id || orderData.buyer_id || '',
        seller_id: orderData.shop_id || orderData.seller_id || '',
        shop_id: orderData.shop_id || orderData.seller_id || '',
        customer_id: orderData.customer_id || orderData.buyer_id || '',
        status: orderData.status || 'pending',
        total_amount: orderData.total_amount || 0,
        payment_status: orderData.payment_status || 'pending',
        payment_method: orderData.payment_method || 'card',
        delivery_fee: orderData.delivery_fee || 0,
        delivery_address: orderData.delivery_address || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('orders')
        .insert({
          buyer_id: dbOrder.buyer_id,
          seller_id: dbOrder.seller_id,
          status: dbOrder.status,
          total_amount: dbOrder.total_amount,
          payment_status: dbOrder.payment_status,
          payment_method: dbOrder.payment_method,
          delivery_fee: dbOrder.delivery_fee,
          delivery_address: dbOrder.delivery_address,
          created_at: dbOrder.created_at,
          updated_at: dbOrder.updated_at
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        throw error;
      }
      
      return mapOrder(data);
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }
}
