
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderStatus, PaymentStatus, mapOrder, mapOrders } from '../../domain/types';
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

  async getOrdersByShopId(shopId: string): Promise<Order[]> {
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

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('buyer_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return mapOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders by user ID:', error);
      return [];
    }
  }

  async updateOrderStatus(id: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  async createOrder(orderData: Partial<Order>): Promise<Order | null> {
    try {
      const { toast } = useToast();
      
      // Map the order fields to match database schema
      const dbOrder = {
        buyer_id: orderData.customer_id,
        seller_id: orderData.shop_id,
        status: orderData.status,
        total_amount: orderData.total_amount,
        payment_status: orderData.payment_status,
        payment_method: orderData.payment_method,
        delivery_fee: orderData.delivery_fee || 0,
        delivery_address: orderData.delivery_address,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(dbOrder)
        .select()
        .single();

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de créer la commande.",
          variant: "destructive",
        });
        throw error;
      }
      
      return mapOrder(data);
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }
}
