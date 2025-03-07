
import { supabase } from '@/integrations/supabase/client';
import { IOrderRepository } from '../../domain/interfaces/IOrderRepository';
import { 
  Order, 
  OrderStatus, 
  PaymentStatus,
  mapOrder,
  mapOrders,
  isOrderStatus,
  isPaymentStatus
} from '../../domain/types';

/**
 * Implémentation du repository pour les commandes
 */
export class OrderRepository implements IOrderRepository {
  /**
   * Récupère les commandes d'une boutique
   */
  async getShopOrders(shopId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error(`Error fetching orders for shop ${shopId}:`, error);
        return [];
      }
      
      // Récupérer les éléments de commande pour chaque commande
      const ordersWithItems = await this.attachOrderItems(data || []);
      
      return mapOrders(ordersWithItems);
    } catch (error) {
      console.error(`Error in getShopOrders for ${shopId}:`, error);
      return [];
    }
  }
  
  /**
   * Récupère les commandes d'un client
   */
  async getCustomerOrders(customerId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error(`Error fetching orders for customer ${customerId}:`, error);
        return [];
      }
      
      // Récupérer les éléments de commande pour chaque commande
      const ordersWithItems = await this.attachOrderItems(data || []);
      
      return mapOrders(ordersWithItems);
    } catch (error) {
      console.error(`Error in getCustomerOrders for ${customerId}:`, error);
      return [];
    }
  }
  
  /**
   * Récupère une commande par son ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (error) {
        console.error(`Error fetching order ${orderId}:`, error);
        return null;
      }
      
      // Récupérer les éléments de la commande
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);
      
      if (itemsError) {
        console.error(`Error fetching items for order ${orderId}:`, itemsError);
      }
      
      // Attacher les éléments à la commande
      const orderWithItems = {
        ...data,
        items: orderItems || []
      };
      
      return mapOrder(orderWithItems);
    } catch (error) {
      console.error(`Error in getOrderById for ${orderId}:`, error);
      return null;
    }
  }
  
  /**
   * Crée une commande
   */
  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | null> {
    try {
      // Validation - s'assurer que les champs requis sont présents
      if (!order.shop_id || !order.customer_id) {
        console.error('Required fields missing for order creation');
        return null;
      }
      
      const insertData = {
        shop_id: order.shop_id,
        customer_id: order.customer_id,
        status: isOrderStatus(order.status) ? order.status : 'pending',
        total_amount: order.total_amount,
        delivery_fee: order.delivery_fee || 0,
        payment_status: isPaymentStatus(order.payment_status) ? order.payment_status : 'pending',
        payment_method: order.payment_method || 'card',
        delivery_address: order.delivery_address,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Créer la commande
      const { data, error } = await supabase
        .from('orders')
        .insert(insertData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating order:', error);
        return null;
      }
      
      // Créer les éléments de commande si fournis
      if (order.items && order.items.length > 0) {
        const orderItems = order.items.map(item => ({
          order_id: data.id,
          shop_item_id: item.shop_item_id,
          price_at_time: item.price_at_time,
          quantity: item.quantity,
          created_at: new Date().toISOString()
        }));
        
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);
        
        if (itemsError) {
          console.error('Error creating order items:', itemsError);
        }
        
        // Récupérer les éléments créés
        const { data: createdItems } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', data.id);
        
        // Attacher les éléments à la commande
        const orderWithItems = {
          ...data,
          items: createdItems || []
        };
        
        return mapOrder(orderWithItems);
      }
      
      return mapOrder({ ...data, items: [] });
    } catch (error) {
      console.error('Error in createOrder:', error);
      return null;
    }
  }
  
  /**
   * Met à jour le statut d'une commande
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    try {
      if (!isOrderStatus(status)) {
        console.error(`Invalid order status: ${status}`);
        return false;
      }
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (error) {
        console.error(`Error updating order status for ${orderId}:`, error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Error in updateOrderStatus for ${orderId}:`, error);
      return false;
    }
  }
  
  /**
   * Met à jour le statut de paiement d'une commande
   */
  async updatePaymentStatus(orderId: string, status: PaymentStatus): Promise<boolean> {
    try {
      if (!isPaymentStatus(status)) {
        console.error(`Invalid payment status: ${status}`);
        return false;
      }
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (error) {
        console.error(`Error updating payment status for ${orderId}:`, error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Error in updatePaymentStatus for ${orderId}:`, error);
      return false;
    }
  }
  
  /**
   * Méthode utilitaire pour attacher les éléments de commande aux commandes
   */
  private async attachOrderItems(orders: any[]): Promise<any[]> {
    if (!orders.length) return [];
    
    try {
      const orderIds = orders.map(order => order.id);
      
      const { data: allItems, error } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);
      
      if (error) {
        console.error('Error fetching order items:', error);
        return orders.map(order => ({ ...order, items: [] }));
      }
      
      // Mapper les éléments à leurs commandes respectives
      return orders.map(order => ({
        ...order,
        items: allItems.filter(item => item.order_id === order.id) || []
      }));
    } catch (error) {
      console.error('Error in attachOrderItems:', error);
      return orders.map(order => ({ ...order, items: [] }));
    }
  }
}
