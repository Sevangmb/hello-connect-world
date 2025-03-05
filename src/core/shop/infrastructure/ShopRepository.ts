
import { supabase } from '@/integrations/supabase/client';
import { 
  Shop, 
  ShopItem, 
  ShopReview, 
  Order,
  OrderItem,
  ShopSettings,
  DeliveryOption,
  PaymentMethod,
  ShopStatus,
  OrderStatus,
  PaymentStatus
} from '../domain/types';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

export class ShopRepository implements IShopRepository {
  /**
   * Récupère une boutique par son ID
   */
  async getShopById(id: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as Shop;
    } catch (error) {
      console.error('Error fetching shop:', error);
      return null;
    }
  }
  
  /**
   * Récupère la boutique d'un utilisateur par son ID
   */
  async getUserShop(userId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No results found
          return null;
        }
        throw error;
      }
      
      return data as Shop;
    } catch (error) {
      console.error('Error fetching user shop:', error);
      return null;
    }
  }

  /**
   * Crée une nouvelle boutique
   */
  async createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .insert(shopData)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Shop;
    } catch (error) {
      console.error('Error creating shop:', error);
      return null;
    }
  }

  /**
   * Met à jour les informations d'une boutique
   */
  async updateShop(shopData: Partial<Shop> & { id: string }): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .update(shopData)
        .eq('id', shopData.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Shop;
    } catch (error) {
      console.error('Error updating shop:', error);
      return null;
    }
  }

  /**
   * Met à jour le statut d'une boutique
   */
  async updateShopStatus(shopId: string, status: ShopStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shops')
        .update({ status })
        .eq('id', shopId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating shop status:', error);
      return false;
    }
  }

  /**
   * Récupère tous les articles d'une boutique
   */
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shops (
            name
          )
        `)
        .eq('shop_id', shopId);
      
      if (error) throw error;
      
      // Map the results to match the ShopItem interface
      return (data || []).map(item => {
        return {
          id: item.id,
          shop_id: item.shop_id,
          name: item.name || '',
          description: item.description || '',
          price: item.price,
          original_price: item.original_price,
          stock: item.stock || 0,
          status: item.status,
          created_at: item.created_at,
          updated_at: item.updated_at,
          image_url: item.image_url || '',
          shop: item.shops,
          clothes_id: item.clothes_id
        } as ShopItem;
      });
    } catch (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }
  }

  /**
   * Ajoute un nouvel article à une boutique
   */
  async addShopItem(item: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert({
          shop_id: item.shop_id,
          name: item.name,
          description: item.description,
          price: item.price,
          original_price: item.original_price,
          stock: item.stock,
          status: item.status,
          image_url: item.image_url,
          clothes_id: item.clothes_id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data as ShopItem;
    } catch (error) {
      console.error('Error adding shop item:', error);
      return null;
    }
  }

  /**
   * Met à jour un article de boutique
   */
  async updateShopItem(item: Partial<ShopItem> & { id: string }): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .update({
          name: item.name,
          description: item.description,
          price: item.price,
          original_price: item.original_price,
          stock: item.stock,
          status: item.status,
          image_url: item.image_url
        })
        .eq('id', item.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as ShopItem;
    } catch (error) {
      console.error('Error updating shop item:', error);
      return null;
    }
  }
  
  /**
   * Met à jour uniquement le statut d'un article
   */
  async updateShopItemStatus(itemId: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_items')
        .update({ status })
        .eq('id', itemId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating shop item status:', error);
      return false;
    }
  }

  /**
   * Supprime un article de boutique
   */
  async deleteShopItem(itemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_items')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting shop item:', error);
      return false;
    }
  }

  /**
   * Récupère les commandes d'une boutique
   */
  async getShopOrders(shopId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match the Order interface
      return (data || []).map(order => {
        // Transform order items
        const items = (order.items || []).map((item: any) => {
          return {
            id: item.id,
            order_id: item.order_id,
            item_id: item.shop_item_id, // Map shop_item_id to item_id
            name: '', // This field may need to be fetched separately
            price: item.price_at_time,
            quantity: item.quantity,
            created_at: item.created_at
          } as OrderItem;
        });
        
        return {
          id: order.id,
          shop_id: order.shop_id,
          customer_id: order.buyer_id, // Map buyer_id to customer_id
          status: order.status as OrderStatus,
          total_amount: order.total_amount,
          delivery_fee: order.shipping_cost || 0, // Map shipping_cost to delivery_fee
          payment_status: order.payment_status as PaymentStatus,
          payment_method: order.payment_method,
          delivery_address: order.shipping_address || {
            street: '',
            city: '',
            postal_code: '',
            country: ''
          },
          created_at: order.created_at,
          updated_at: order.updated_at || order.created_at,
          items
        } as Order;
      });
    } catch (error) {
      console.error('Error fetching shop orders:', error);
      return [];
    }
  }

  /**
   * Récupère une commande spécifique
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('id', orderId)
        .single();
      
      if (error) throw error;
      
      // Transform order items
      const items = (data.items || []).map((item: any) => {
        return {
          id: item.id,
          order_id: item.order_id,
          item_id: item.shop_item_id, // Map shop_item_id to item_id
          name: '', // This field may need to be fetched separately
          price: item.price_at_time,
          quantity: item.quantity,
          created_at: item.created_at
        } as OrderItem;
      });
      
      return {
        id: data.id,
        shop_id: data.shop_id,
        customer_id: data.buyer_id, // Map buyer_id to customer_id
        status: data.status as OrderStatus,
        total_amount: data.total_amount,
        delivery_fee: data.shipping_cost || 0, // Map shipping_cost to delivery_fee
        payment_status: data.payment_status as PaymentStatus,
        payment_method: data.payment_method,
        delivery_address: data.shipping_address || {
          street: '',
          city: '',
          postal_code: '',
          country: ''
        },
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at,
        items
      } as Order;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  }

  /**
   * Met à jour le statut d'une commande
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  /**
   * Crée une nouvelle commande
   */
  async createOrder(orderData: Omit<Order, 'id' | 'created_at'>): Promise<Order | null> {
    try {
      // Create the order first
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          shop_id: orderData.shop_id,
          buyer_id: orderData.customer_id,
          status: orderData.status,
          total_amount: orderData.total_amount,
          shipping_cost: orderData.delivery_fee,
          payment_status: orderData.payment_status,
          payment_method: orderData.payment_method,
          shipping_address: orderData.delivery_address,
          shipping_required: true
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Then create the order items
      const orderItems = orderData.items.map(item => ({
        order_id: orderData.id,
        shop_item_id: item.item_id,
        price_at_time: item.price,
        quantity: item.quantity
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Return the created order
      return await this.getOrderById(orderData.id);
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }

  /**
   * Récupère les avis d'une boutique
   */
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select(`
          *,
          profiles (
            username,
            full_name
          )
        `)
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data as ShopReview[];
    } catch (error) {
      console.error('Error fetching shop reviews:', error);
      return [];
    }
  }

  /**
   * Récupère les paramètres d'une boutique
   */
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();
      
      if (error) {
        // Si les paramètres n'existent pas, créer des paramètres par défaut
        if (error.code === 'PGRST116') {
          return await this.createDefaultShopSettings(shopId);
        }
        throw error;
      }
      
      // Cast string arrays to proper enum types
      return {
        id: data.id,
        shop_id: data.shop_id,
        delivery_options: data.delivery_options as DeliveryOption[],
        payment_methods: data.payment_methods as PaymentMethod[],
        auto_accept_orders: data.auto_accept_orders,
        notification_preferences: data.notification_preferences,
        created_at: data.created_at,
        updated_at: data.updated_at
      } as ShopSettings;
    } catch (error) {
      console.error('Error fetching shop settings:', error);
      return null;
    }
  }

  /**
   * Crée des paramètres de boutique par défaut
   */
  private async createDefaultShopSettings(shopId: string): Promise<ShopSettings | null> {
    try {
      const defaultSettings = {
        shop_id: shopId,
        delivery_options: ['pickup', 'delivery'],
        payment_methods: ['card', 'paypal'],
        auto_accept_orders: false,
        notification_preferences: {
          email: true,
          app: true
        }
      };
      
      const { data, error } = await supabase
        .from('shop_settings')
        .insert(defaultSettings)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        shop_id: data.shop_id,
        delivery_options: data.delivery_options as DeliveryOption[],
        payment_methods: data.payment_methods as PaymentMethod[],
        auto_accept_orders: data.auto_accept_orders,
        notification_preferences: data.notification_preferences,
        created_at: data.created_at,
        updated_at: data.updated_at
      } as ShopSettings;
    } catch (error) {
      console.error('Error creating default shop settings:', error);
      return null;
    }
  }

  /**
   * Met à jour les paramètres d'une boutique
   */
  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_settings')
        .update({
          delivery_options: settings.delivery_options,
          payment_methods: settings.payment_methods,
          auto_accept_orders: settings.auto_accept_orders,
          notification_preferences: settings.notification_preferences
        })
        .eq('shop_id', shopId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating shop settings:', error);
      return false;
    }
  }
}
