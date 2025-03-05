
import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { Shop, ShopItem, ShopReview, ShopSettings, Order, OrderStatus, ShopItemStatus, ShopStatus } from '../domain/types';

export class ShopRepository implements IShopRepository {
  // Shop operations
  async getShopById(id: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching shop:', error);
        return null;
      }

      return data as Shop;
    } catch (error) {
      console.error('Exception in getShopById:', error);
      return null;
    }
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching shop by user id:', error);
        return null;
      }

      return data as Shop;
    } catch (error) {
      console.error('Exception in getShopByUserId:', error);
      return null;
    }
  }

  async getShops(): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('status', 'approved');

      if (error) {
        console.error('Error fetching shops:', error);
        return [];
      }

      return data as Shop[];
    } catch (error) {
      console.error('Exception in getShops:', error);
      return [];
    }
  }

  async createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'average_rating'>): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .insert({
          ...shopData,
          average_rating: 0,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating shop:', error);
        return null;
      }

      return data as Shop;
    } catch (error) {
      console.error('Exception in createShop:', error);
      return null;
    }
  }

  async updateShop(shopData: Partial<Shop> & { id: string }): Promise<Shop> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .update({
          ...shopData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', shopData.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating shop:', error);
        throw new Error(`Failed to update shop: ${error.message}`);
      }

      return data as Shop;
    } catch (error) {
      console.error('Exception in updateShop:', error);
      throw new Error('Failed to update shop');
    }
  }

  // Method overload to match interface
  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop> {
    return this.updateShop({ ...shopData, id });
  }

  // Additional methods required by IShopRepository
  async deleteShop(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shops')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting shop:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception in deleteShop:', error);
      return false;
    }
  }

  async updateShopStatus(id: string, status: ShopStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shops')
        .update({ 
          status,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating shop status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception in updateShopStatus:', error);
      return false;
    }
  }

  // Shop items operations
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop(name)')
        .eq('shop_id', shopId);

      if (error) {
        console.error('Error fetching shop items:', error);
        return [];
      }

      return data as ShopItem[];
    } catch (error) {
      console.error('Exception in getShopItems:', error);
      return [];
    }
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop(name)')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching shop item:', error);
        return null;
      }

      return data as ShopItem;
    } catch (error) {
      console.error('Exception in getShopItemById:', error);
      return null;
    }
  }

  async createShopItem(itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert(itemData)
        .select()
        .single();

      if (error) {
        console.error('Error creating shop item:', error);
        return null;
      }

      return data as ShopItem;
    } catch (error) {
      console.error('Exception in createShopItem:', error);
      return null;
    }
  }

  async updateShopItem(item: Partial<ShopItem> & { id: string }): Promise<ShopItem> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .update({
          ...item,
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating shop item:', error);
        throw new Error(`Failed to update shop item: ${error.message}`);
      }

      return data as ShopItem;
    } catch (error) {
      console.error('Exception in updateShopItem:', error);
      throw new Error('Failed to update shop item');
    }
  }

  // Method overload to match interface
  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem> {
    return this.updateShopItem({ ...itemData, id });
  }

  async deleteShopItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting shop item:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception in deleteShopItem:', error);
      return false;
    }
  }

  async updateShopItemStatus(id: string, status: ShopItemStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_items')
        .update({ 
          status,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating shop item status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception in updateShopItemStatus:', error);
      return false;
    }
  }

  // Shop review operations
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select('*, profiles(username, full_name)')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching shop reviews:', error);
        return [];
      }

      return data as ShopReview[];
    } catch (error) {
      console.error('Exception in getShopReviews:', error);
      return [];
    }
  }

  async addShopReview(reviewData: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview | null> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert(reviewData)
        .select('*, profiles(username, full_name)')
        .single();

      if (error) {
        console.error('Error adding shop review:', error);
        return null;
      }

      // Update shop rating
      await this.updateShopAverageRating(reviewData.shop_id);

      return data as ShopReview;
    } catch (error) {
      console.error('Exception in addShopReview:', error);
      return null;
    }
  }

  private async updateShopAverageRating(shopId: string): Promise<void> {
    try {
      // Calculate average rating
      const { data, error } = await supabase
        .from('shop_reviews')
        .select('rating')
        .eq('shop_id', shopId);

      if (error || !data || data.length === 0) {
        console.error('Error fetching ratings:', error);
        return;
      }

      const average = data.reduce((sum, review) => sum + review.rating, 0) / data.length;

      // Update shop with new average
      await supabase
        .from('shops')
        .update({ 
          average_rating: parseFloat(average.toFixed(1)),
          rating_count: data.length,
          updated_at: new Date().toISOString()
        })
        .eq('id', shopId);
    } catch (error) {
      console.error('Exception in updateShopAverageRating:', error);
    }
  }

  // Shop settings operations
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();

      if (error) {
        console.error('Error fetching shop settings:', error);
        return null;
      }

      return data as ShopSettings;
    } catch (error) {
      console.error('Exception in getShopSettings:', error);
      return null;
    }
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .eq('shop_id', shopId)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating shop settings:', error);
        throw new Error(`Failed to update shop settings: ${error.message}`);
      }

      return data as ShopSettings;
    } catch (error) {
      console.error('Exception in updateShopSettings:', error);
      throw new Error('Failed to update shop settings');
    }
  }

  // Order operations
  async getShopOrders(shopId: string): Promise<Order[]> {
    try {
      // First get orders
      const { data: orders, error: ordersError } = await supabase
        .from('shop_orders')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching shop orders:', ordersError);
        return [];
      }

      // Get order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const { data: items, error: itemsError } = await supabase
            .from('shop_order_items')
            .select('*')
            .eq('order_id', order.id);

          if (itemsError) {
            console.error(`Error fetching order items for order ${order.id}:`, itemsError);
            return { ...order, items: [] };
          }

          return { ...order, items } as Order;
        })
      );

      return ordersWithItems;
    } catch (error) {
      console.error('Exception in getShopOrders:', error);
      return [];
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      // First get orders
      const { data: orders, error: ordersError } = await supabase
        .from('shop_orders')
        .select('*')
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching user orders:', ordersError);
        return [];
      }

      // Get order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const { data: items, error: itemsError } = await supabase
            .from('shop_order_items')
            .select('*')
            .eq('order_id', order.id);

          if (itemsError) {
            console.error(`Error fetching order items for order ${order.id}:`, itemsError);
            return { ...order, items: [] };
          }

          return { ...order, items } as Order;
        })
      );

      return ordersWithItems;
    } catch (error) {
      console.error('Exception in getUserOrders:', error);
      return [];
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      // Get order
      const { data: order, error: orderError } = await supabase
        .from('shop_orders')
        .select('*')
        .eq('id', id)
        .single();

      if (orderError) {
        console.error('Error fetching order:', orderError);
        return null;
      }

      // Get order items
      const { data: items, error: itemsError } = await supabase
        .from('shop_order_items')
        .select('*')
        .eq('order_id', id);

      if (itemsError) {
        console.error(`Error fetching order items for order ${id}:`, itemsError);
        return { ...order, items: [] } as Order;
      }

      return { ...order, items } as Order;
    } catch (error) {
      console.error('Exception in getOrderById:', error);
      return null;
    }
  }

  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | null> {
    try {
      // Extract items to insert separately
      const { items, ...orderInfo } = orderData;

      // First create the order in the orders table
      const { data: order, error: orderError } = await supabase
        .from('shop_orders')
        .insert({
          shop_id: orderInfo.shop_id,
          customer_id: orderInfo.customer_id,
          status: orderInfo.status,
          total_amount: orderInfo.total_amount,
          delivery_fee: orderInfo.delivery_fee,
          payment_status: orderInfo.payment_status,
          payment_method: orderInfo.payment_method,
          delivery_address: orderInfo.delivery_address,
        })
        .select('*')
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        return null;
      }

      // Then create the order items
      if (items && items.length > 0) {
        const orderItems = items.map(item => ({
          order_id: order.id,
          item_id: item.item_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        }));

        const { error: itemsError } = await supabase
          .from('shop_order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error('Error creating order items:', itemsError);
          // Try to delete the order if items creation failed
          await supabase.from('shop_orders').delete().eq('id', order.id);
          return null;
        }
      }

      // Get complete order with items
      return this.getOrderById(order.id);
    } catch (error) {
      console.error('Exception in createOrder:', error);
      return null;
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_orders')
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
    } catch (error) {
      console.error('Exception in updateOrderStatus:', error);
      return false;
    }
  }

  // Favorite operations
  async addFavoriteShop(userId: string, shopId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_favorite_shops')
        .insert({ user_id: userId, shop_id: shopId });

      if (error) {
        console.error('Error adding favorite shop:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception in addFavoriteShop:', error);
      return false;
    }
  }

  async removeFavoriteShop(userId: string, shopId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_favorite_shops')
        .delete()
        .eq('user_id', userId)
        .eq('shop_id', shopId);

      if (error) {
        console.error('Error removing favorite shop:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception in removeFavoriteShop:', error);
      return false;
    }
  }

  async getUserFavoriteShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select('shop_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user favorite shops:', error);
        return [];
      }

      if (data.length === 0) {
        return [];
      }

      const shopIds = data.map(item => item.shop_id);
      
      const { data: shops, error: shopsError } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .in('id', shopIds);

      if (shopsError) {
        console.error('Error fetching shops from ids:', shopsError);
        return [];
      }

      return shops as Shop[];
    } catch (error) {
      console.error('Exception in getUserFavoriteShops:', error);
      return [];
    }
  }

  async checkIfShopFavorited(userId: string, shopId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select('*')
        .eq('user_id', userId)
        .eq('shop_id', shopId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return false;
        }
        console.error('Error checking if shop is favorited:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Exception in checkIfShopFavorited:', error);
      return false;
    }
  }
}
