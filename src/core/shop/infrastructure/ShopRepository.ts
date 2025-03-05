
import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/repository/IShopRepository';
import { 
  Shop, ShopItem, ShopReview, Order, ShopStatus, 
  OrderItem, ShopSettings, PaymentMethod, DeliveryOption,
  ShopItemStatus, OrderStatus, PaymentStatus
} from '../domain/types';

export class ShopRepository implements IShopRepository {
  // Shop operations
  async getShopById(id: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Shop;
    } catch (error) {
      console.error('Error fetching shop by ID:', error);
      return null;
    }
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data as Shop;
    } catch (error) {
      console.error('Error fetching shop by user ID:', error);
      return null;
    }
  }

  async getShops(): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Shop[];
    } catch (error) {
      console.error('Error fetching shops:', error);
      return [];
    }
  }

  async getShopsByStatus(status: ShopStatus): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name
          )
        `)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Shop[];
    } catch (error) {
      console.error(`Error fetching shops by status ${status}:`, error);
      return [];
    }
  }

  async createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop> {
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
      throw error;
    }
  }

  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .update(shopData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Shop;
    } catch (error) {
      console.error('Error updating shop:', error);
      throw error;
    }
  }

  async deleteShop(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shops')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting shop:', error);
      return false;
    }
  }

  // Shop items operations
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop:shop_id (
            id,
            name
          )
        `)
        .eq('shop_id', shopId);

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop:shop_id (
            id,
            name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as ShopItem;
    } catch (error) {
      console.error('Error fetching shop item by ID:', error);
      return null;
    }
  }

  async getShopItemsByIds(ids: string[]): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop:shop_id (
            id,
            name
          )
        `)
        .in('id', ids);

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error fetching shop items by IDs:', error);
      return [];
    }
  }

  async createShopItem(itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert(itemData)
        .select()
        .single();

      if (error) throw error;
      return data as ShopItem;
    } catch (error) {
      console.error('Error creating shop item:', error);
      throw error;
    }
  }

  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .update(itemData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ShopItem;
    } catch (error) {
      console.error('Error updating shop item:', error);
      throw error;
    }
  }

  async updateShopItemStatus(id: string, status: ShopItemStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_items')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating shop item status:', error);
      return false;
    }
  }

  async deleteShopItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting shop item:', error);
      return false;
    }
  }

  // Shop review operations
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select(`
          *,
          profiles:user_id (
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

  async addShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert(review)
        .select()
        .single();

      if (error) throw error;
      return data as ShopReview;
    } catch (error) {
      console.error('Error adding shop review:', error);
      throw error;
    }
  }

  async createShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview> {
    // Alias for addShopReview to match interface
    return this.addShopReview(review);
  }

  async updateShopReview(id: string, reviewData: Partial<ShopReview>): Promise<ShopReview> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .update(reviewData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ShopReview;
    } catch (error) {
      console.error('Error updating shop review:', error);
      throw error;
    }
  }

  async deleteShopReview(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting shop review:', error);
      return false;
    }
  }

  // Helper function to map order items
  private mapOrderItems(items: any[]): OrderItem[] {
    return items.map(item => ({
      id: item.id,
      order_id: item.order_id,
      item_id: item.item_id,
      name: "Item Name", // Default name if not available
      price: item.price_at_time,
      quantity: item.quantity,
      created_at: item.created_at,
      price_at_time: item.price_at_time,
      shop_item_id: item.item_id
    }));
  }

  // Order operations
  async getOrders(shopId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('shop_orders')
        .select(`
          *,
          items:shop_order_items(*)
        `)
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map the data to match the Order interface
      return (data || []).map(order => ({
        id: order.id,
        shop_id: order.shop_id,
        customer_id: order.customer_id,
        status: order.status as OrderStatus,
        total_amount: order.total_amount,
        delivery_fee: order.delivery_fee,
        payment_status: order.payment_status as PaymentStatus,
        payment_method: order.payment_method || 'unknown', // Add default value
        delivery_address: order.delivery_address,
        created_at: order.created_at,
        updated_at: order.updated_at,
        items: this.mapOrderItems(order.items || [])
      }));
    } catch (error) {
      console.error('Error fetching shop orders:', error);
      return [];
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('shop_orders')
        .select(`
          *,
          items:shop_order_items(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        shop_id: data.shop_id,
        customer_id: data.customer_id,
        status: data.status as OrderStatus,
        total_amount: data.total_amount,
        delivery_fee: data.delivery_fee,
        payment_status: data.payment_status as PaymentStatus,
        payment_method: data.payment_method || 'unknown', // Add default value
        delivery_address: data.delivery_address,
        created_at: data.created_at,
        updated_at: data.updated_at,
        items: this.mapOrderItems(data.items || [])
      };
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      return null;
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('shop_orders')
        .select(`
          *,
          items:shop_order_items(*)
        `)
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(order => ({
        id: order.id,
        shop_id: order.shop_id,
        customer_id: order.customer_id,
        status: order.status as OrderStatus,
        total_amount: order.total_amount,
        delivery_fee: order.delivery_fee,
        payment_status: order.payment_status as PaymentStatus,
        payment_method: order.payment_method || 'unknown', // Add default value
        delivery_address: order.delivery_address,
        created_at: order.created_at,
        updated_at: order.updated_at,
        items: this.mapOrderItems(order.items || [])
      }));
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  }

  async createOrder(orderData: any): Promise<Order> {
    try {
      const { items, ...orderDetails } = orderData;
      
      // First, insert the order
      const { data: orderData_, error: orderError } = await supabase
        .from('shop_orders')
        .insert(orderDetails)
        .select()
        .single();

      if (orderError) throw orderError;

      // Then, insert all order items
      if (items && items.length > 0) {
        const orderItems = items.map((item: any) => ({
          order_id: orderData_.id,
          item_id: item.item_id,
          quantity: item.quantity,
          price_at_time: item.price
        }));

        const { error: itemsError } = await supabase
          .from('shop_order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      // Return the created order with items
      return {
        ...orderData_,
        status: orderData_.status as OrderStatus,
        payment_status: orderData_.payment_status as PaymentStatus,
        payment_method: orderData_.payment_method || 'unknown',
        items: items.map((item: any) => ({
          id: '', // This will be filled by the database
          order_id: orderData_.id,
          item_id: item.item_id,
          name: item.name || 'Item',
          price: item.price,
          quantity: item.quantity,
          created_at: new Date().toISOString()
        }))
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async updateOrder(id: string, orderData: any): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('shop_orders')
        .update(orderData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Get the order items
      const { data: items, error: itemsError } = await supabase
        .from('shop_order_items')
        .select('*')
        .eq('order_id', id);

      if (itemsError) throw itemsError;

      return {
        ...data,
        status: data.status as OrderStatus,
        payment_status: data.payment_status as PaymentStatus,
        payment_method: data.payment_method || 'unknown',
        items: this.mapOrderItems(items || [])
      };
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  // Settings operations
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();

      if (error) throw error;
      return data as ShopSettings;
    } catch (error) {
      console.error('Error fetching shop settings:', error);
      return null;
    }
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .update(settings)
        .eq('shop_id', shopId)
        .select()
        .single();

      if (error) throw error;
      return data as ShopSettings;
    } catch (error) {
      console.error('Error updating shop settings:', error);
      return null;
    }
  }

  // Favorites
  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_favorite_shops')
        .insert({
          user_id: userId,
          shop_id: shopId
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding shop to favorites:', error);
      return false;
    }
  }

  async removeShopFromFavorites(userId: string, shopId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_favorite_shops')
        .delete()
        .eq('user_id', userId)
        .eq('shop_id', shopId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing shop from favorites:', error);
      return false;
    }
  }

  async checkIfFavorited(userId: string, shopId: string): Promise<boolean> {
    try {
      const { data, error, count } = await supabase
        .from('user_favorite_shops')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('shop_id', shopId);

      if (error) throw error;
      return count !== null && count > 0;
    } catch (error) {
      console.error('Error checking if shop is favorited:', error);
      return false;
    }
  }

  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    // Alias for checkIfFavorited to match interface
    return this.checkIfFavorited(userId, shopId);
  }

  async addFavoriteShop(userId: string, shopId: string): Promise<boolean> {
    // Alias for addShopToFavorites to match interface
    return this.addShopToFavorites(userId, shopId);
  }

  async removeFavoriteShop(userId: string, shopId: string): Promise<boolean> {
    // Alias for removeShopFromFavorites to match interface
    return this.removeShopFromFavorites(userId, shopId);
  }

  async getUserFavoriteShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select(`
          shop_id,
          shops:shop_id (
            *,
            profiles:user_id (
              username,
              full_name
            )
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data.map(item => item.shops) as Shop[];
    } catch (error) {
      console.error('Error getting user favorite shops:', error);
      return [];
    }
  }

  async getFavoriteShops(userId: string): Promise<Shop[]> {
    // Alias for getUserFavoriteShops to match interface
    return this.getUserFavoriteShops(userId);
  }
}
