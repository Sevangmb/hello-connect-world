
import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { Shop, ShopItem, ShopReview, ShopSettings, Order, OrderStatus, ShopStatus, ShopItemStatus, PaymentStatus } from '../domain/types';

type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];
type Json = { [key: string]: JsonValue };

export class ShopRepository implements IShopRepository {
  async createShop(shop: Partial<Shop>): Promise<Shop> {
    try {
      const newShop: Partial<Shop> = {
        user_id: shop.user_id,
        name: shop.name || '',
        description: shop.description || '',
        status: shop.status || 'pending',
        average_rating: shop.average_rating || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...shop
      };
      
      const { data, error } = await supabase
        .from('shops')
        .insert([newShop])
        .select()
        .single();
      
      if (error) throw error;
      
      return this.mapDbShopToShop(data);
    } catch (error) {
      console.error('Error creating shop:', error);
      throw error;
    }
  }

  async getShopById(id: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      return this.mapDbShopToShop(data);
    } catch (error) {
      console.error(`Error fetching shop with id ${id}:`, error);
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
      
      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;
      
      return this.mapDbShopToShop(data);
    } catch (error) {
      console.error(`Error fetching shop for user ${userId}:`, error);
      return null;
    }
  }

  async getUserShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return (data || []).map(shop => this.mapDbShopToShop(shop));
    } catch (error) {
      console.error(`Error fetching shops for user ${userId}:`, error);
      return [];
    }
  }

  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .update({
          ...shopData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return this.mapDbShopToShop(data);
    } catch (error) {
      console.error(`Error updating shop ${id}:`, error);
      throw error;
    }
  }

  async getAllShops(): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(shop => this.mapDbShopToShop(shop));
    } catch (error) {
      console.error('Error fetching all shops:', error);
      return [];
    }
  }

  async getShopsByStatus(status: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('status', status)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(shop => this.mapDbShopToShop(shop));
    } catch (error) {
      console.error(`Error fetching shops with status ${status}:`, error);
      return [];
    }
  }

  async createShopItem(item: Partial<ShopItem>): Promise<ShopItem> {
    try {
      const newItem = {
        shop_id: item.shop_id,
        name: item.name || '',
        description: item.description || '',
        price: item.price || 0,
        stock: item.stock || 0,
        status: item.status || 'available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...item
      };
      
      const { data, error } = await supabase
        .from('shop_items')
        .insert([newItem])
        .select()
        .single();
      
      if (error) throw error;
      
      return this.mapDbShopItemToShopItem(data);
    } catch (error) {
      console.error('Error creating shop item:', error);
      throw error;
    }
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shops(name)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      return this.mapDbShopItemToShopItem(data);
    } catch (error) {
      console.error(`Error fetching shop item with id ${id}:`, error);
      return null;
    }
  }

  async getShopItems(shopId: string): Promise<ShopItem[]> {
    return this.getShopItemsByShopId(shopId);
  }

  async getShopItemsByShopId(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shops(name)')
        .eq('shop_id', shopId)
        .eq('status', 'available');
      
      if (error) throw error;
      
      return (data || []).map(item => this.mapDbShopItemToShopItem(item));
    } catch (error) {
      console.error(`Error fetching items for shop ${shopId}:`, error);
      return [];
    }
  }

  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .update({
          ...itemData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return this.mapDbShopItemToShopItem(data);
    } catch (error) {
      console.error(`Error updating shop item ${id}:`, error);
      throw error;
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
      console.error(`Error deleting shop item ${id}:`, error);
      return false;
    }
  }

  async createShopReview(review: Partial<ShopReview>): Promise<ShopReview> {
    try {
      const newReview = {
        shop_id: review.shop_id,
        user_id: review.user_id,
        rating: review.rating || 5,
        comment: review.comment || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...review
      };
      
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert([newReview])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update shop average rating
      await supabase.rpc('update_shop_average_rating', {
        shop_id: review.shop_id
      });
      
      return data;
    } catch (error) {
      console.error('Error creating shop review:', error);
      throw error;
    }
  }

  async getShopReviewById(id: string): Promise<ShopReview | null> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select('*, profiles(username, full_name, avatar_url)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Error fetching shop review with id ${id}:`, error);
      return null;
    }
  }

  async getShopReviewsByShopId(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select('*, profiles(username, full_name, avatar_url)')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error(`Error fetching reviews for shop ${shopId}:`, error);
      return [];
    }
  }

  async getShopReviewsByUserId(userId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select('*, profiles(username, full_name, avatar_url)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error(`Error fetching reviews by user ${userId}:`, error);
      return [];
    }
  }

  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return data || null;
    } catch (error) {
      console.error(`Error fetching settings for shop ${shopId}:`, error);
      return null;
    }
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings> {
    try {
      // Check if settings exist
      const { data: existingSettings, error: checkError } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      
      let data;
      if (existingSettings) {
        // Update existing settings
        const { data: updatedData, error: updateError } = await supabase
          .from('shop_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString()
          })
          .eq('shop_id', shopId)
          .select()
          .single();
        
        if (updateError) throw updateError;
        data = updatedData;
      } else {
        // Create new settings
        const newSettings = {
          shop_id: shopId,
          delivery_options: settings.delivery_options || ['pickup'],
          payment_methods: settings.payment_methods || ['card'],
          auto_accept_orders: settings.auto_accept_orders || false,
          notification_preferences: settings.notification_preferences || { email: true, app: true },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...settings
        };
        
        const { data: insertedData, error: insertError } = await supabase
          .from('shop_settings')
          .insert([newSettings])
          .select()
          .single();
        
        if (insertError) throw insertError;
        data = insertedData;
      }
      
      return data;
    } catch (error) {
      console.error(`Error updating settings for shop ${shopId}:`, error);
      throw error;
    }
  }

  async createOrder(order: Partial<Order>): Promise<Order> {
    try {
      const newOrder = {
        shop_id: order.shop_id,
        customer_id: order.customer_id,
        buyer_id: order.customer_id, // For database compatibility
        seller_id: order.shop_id, // For database compatibility
        status: order.status || 'pending',
        total_amount: order.total_amount || 0,
        delivery_fee: order.delivery_fee || 0,
        payment_status: order.payment_status || 'pending',
        payment_method: order.payment_method || 'card',
        delivery_address: order.delivery_address || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('orders')
        .insert([newOrder])
        .select()
        .single();
      
      if (error) throw error;
      
      // Add order items if provided
      if (order.items && order.items.length > 0) {
        const orderItems = order.items.map(item => ({
          order_id: data.id,
          shop_item_id: item.shop_item_id,
          price_at_time: item.price_at_time,
          quantity: item.quantity || 1,
          created_at: new Date().toISOString()
        }));
        
        await supabase
          .from('order_items')
          .insert(orderItems);
      }
      
      return this.mapDbOrderToOrder(data);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          shop:shops(name),
          order_items(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      return this.mapDbOrderToOrder(data);
    } catch (error) {
      console.error(`Error fetching order with id ${id}:`, error);
      return null;
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          shop:shops(name),
          order_items(*)
        `)
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(order => this.mapDbOrderToOrder(order));
    } catch (error) {
      console.error(`Error fetching orders for user ${userId}:`, error);
      return [];
    }
  }

  async getShopOrders(shopId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          shop:shops(name),
          order_items(*)
        `)
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(order => this.mapDbOrderToOrder(order));
    } catch (error) {
      console.error(`Error fetching orders for shop ${shopId}:`, error);
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
      console.error(`Error updating status for order ${orderId}:`, error);
      return false;
    }
  }

  async getFavoriteShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select('shop_id')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      if (data.length === 0) return [];
      
      const shopIds = data.map(item => item.shop_id);
      
      const { data: shopsData, error: shopsError } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .in('id', shopIds);
      
      if (shopsError) throw shopsError;
      
      return (shopsData || []).map(shop => this.mapDbShopToShop(shop));
    } catch (error) {
      console.error(`Error fetching favorite shops for user ${userId}:`, error);
      return [];
    }
  }

  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select('*')
        .eq('user_id', userId)
        .eq('shop_id', shopId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return !!data;
    } catch (error) {
      console.error(`Error checking if shop ${shopId} is favorited by user ${userId}:`, error);
      return false;
    }
  }

  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_favorite_shops')
        .insert([
          {
            user_id: userId,
            shop_id: shopId,
            created_at: new Date().toISOString()
          }
        ]);
      
      if (error && error.code !== '23505') throw error; // Ignore unique constraint violation
      
      return true;
    } catch (error) {
      console.error(`Error adding shop ${shopId} to favorites for user ${userId}:`, error);
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
      console.error(`Error removing shop ${shopId} from favorites for user ${userId}:`, error);
      return false;
    }
  }

  async addToCart(userId: string, shopItemId: string, quantity: number): Promise<boolean> {
    try {
      // Check if the item already exists in the cart
      const { data: existingItem, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('shop_item_id', shopItemId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      
      if (existingItem) {
        // Update quantity
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({
            quantity: existingItem.quantity + quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItem.id);
        
        if (updateError) throw updateError;
      } else {
        // Add new item
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert([
            {
              user_id: userId,
              shop_item_id: shopItemId,
              quantity,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);
        
        if (insertError) throw insertError;
      }
      
      return true;
    } catch (error) {
      console.error(`Error adding item ${shopItemId} to cart for user ${userId}:`, error);
      return false;
    }
  }

  async getAllShopItems(): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shops(name)')
        .eq('status', 'available');
      
      if (error) throw error;
      
      return (data || []).map(item => this.mapDbShopItemToShopItem(item));
    } catch (error) {
      console.error('Error fetching all shop items:', error);
      return [];
    }
  }

  async updateShopItemStatus(id: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_items')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating status for shop item ${id}:`, error);
      return false;
    }
  }

  async addShopItems(items: Partial<ShopItem>[]): Promise<ShopItem[]> {
    try {
      const newItems = items.map(item => ({
        shop_id: item.shop_id,
        name: item.name || '',
        description: item.description || '',
        price: item.price || 0,
        stock: item.stock || 0,
        status: item.status || 'available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...item
      }));
      
      const { data, error } = await supabase
        .from('shop_items')
        .insert(newItems)
        .select();
      
      if (error) throw error;
      
      return (data || []).map(item => this.mapDbShopItemToShopItem(item));
    } catch (error) {
      console.error('Error adding multiple shop items:', error);
      throw error;
    }
  }

  // Helper methods for mapping database objects to domain objects
  private mapDbShopToShop(data: any): Shop {
    return {
      ...data,
      status: data.status as ShopStatus
    };
  }

  private mapDbShopItemToShopItem(data: any): ShopItem {
    return {
      ...data,
      status: data.status as ShopItemStatus
    };
  }

  private mapDbOrderToOrder(data: any): Order {
    return {
      ...data,
      status: data.status as OrderStatus,
      payment_status: data.payment_status as PaymentStatus,
      customer_id: data.customer_id || data.buyer_id, // Handle database compatibility
      shop_id: data.shop_id || data.seller_id // Handle database compatibility
    };
  }
}
