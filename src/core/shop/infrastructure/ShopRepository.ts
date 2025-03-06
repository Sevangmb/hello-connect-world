import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopItem, Order, ShopReview, ShopSettings, ShopItemStatus, OrderStatus, DbOrder } from '../domain/types';
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { Json } from '@supabase/supabase-js';

export class ShopRepository implements IShopRepository {
  async getShopById(id: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? this.mapShopDataToModel(data) : null;
    } catch (error) {
      console.error(`Error fetching shop ${id}:`, error);
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
      return data ? this.mapShopDataToModel(data) : null;
    } catch (error) {
      console.error(`Error fetching shop for user ${userId}:`, error);
      return null;
    }
  }

  async getUserShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data ? data.map(this.mapShopDataToModel) : [];
    } catch (error) {
      console.error(`Error fetching shops for user ${userId}:`, error);
      return [];
    }
  }

  async getShopsByStatus(status: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('status', status);

      if (error) throw error;
      return data ? data.map(this.mapShopDataToModel) : [];
    } catch (error) {
      console.error(`Error fetching shops with status ${status}:`, error);
      return [];
    }
  }

  async getAllShops(): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*');

      if (error) throw error;
      return data ? data.map(this.mapShopDataToModel) : [];
    } catch (error) {
      console.error('Error fetching all shops:', error);
      return [];
    }
  }

  async createShop(shopData: Partial<Shop>): Promise<Shop> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .insert([shopData])
        .select()
        .single();

      if (error) throw error;
      return this.mapShopDataToModel(data);
    } catch (error) {
      console.error('Error creating shop:', error);
      throw error;
    }
  }

  // Fix updateShop to match interface
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
      return this.mapShopDataToModel(data);
    } catch (error) {
      console.error(`Error updating shop ${id}:`, error);
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
      console.error(`Error deleting shop ${id}:`, error);
      return false;
    }
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shop_id(name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? this.mapShopItemDataToModel(data) : null;
    } catch (error) {
      console.error(`Error fetching shop item ${id}:`, error);
      return null;
    }
  }

  async getShopItems(filters: any = {}): Promise<ShopItem[]> {
    try {
      let query = supabase
        .from('shop_items')
        .select('*, shop:shop_id(name)');

      if (filters.shop_id) {
        query = query.eq('shop_id', filters.shop_id);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data ? data.map(this.mapShopItemDataToModel) : [];
    } catch (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }
  }

  async getShopItemsByShopId(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shop_id(name)')
        .eq('shop_id', shopId);

      if (error) throw error;
      return data ? data.map(this.mapShopItemDataToModel) : [];
    } catch (error) {
      console.error(`Error fetching shop items for shop ${shopId}:`, error);
      return [];
    }
  }

  async getAllShopItems(): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shop_id(name)');

      if (error) throw error;
      return data ? data.map(this.mapShopItemDataToModel) : [];
    } catch (error) {
      console.error('Error fetching all shop items:', error);
      return [];
    }
  }

  async createShopItem(itemData: Partial<ShopItem>): Promise<ShopItem> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert([itemData])
        .select('*, shop:shop_id(name)')
        .single();

      if (error) throw error;
      return this.mapShopItemDataToModel(data);
    } catch (error) {
      console.error('Error creating shop item:', error);
      throw error;
    }
  }

  // Fix updateShopItem to match interface
  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .update({
          ...itemData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*, shop:shop_id(name)')
        .single();

      if (error) throw error;
      return this.mapShopItemDataToModel(data);
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

  async getShopReviewById(id: string): Promise<ShopReview | null> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select('*, profiles(username, full_name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? this.mapShopReviewDataToModel(data) : null;
    } catch (error) {
      console.error(`Error fetching shop review ${id}:`, error);
      return null;
    }
  }

  async getShopReviewsByShopId(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select('*, profiles(username, full_name)')
        .eq('shop_id', shopId);

      if (error) throw error;
      return data ? data.map(this.mapShopReviewDataToModel) : [];
    } catch (error) {
      console.error(`Error fetching shop reviews for shop ${shopId}:`, error);
      return [];
    }
  }

  async getShopReviews(filters: any = {}): Promise<ShopReview[]> {
    try {
      let query = supabase
        .from('shop_reviews')
        .select('*, profiles(username, full_name)');

      if (filters.shop_id) {
        query = query.eq('shop_id', filters.shop_id);
      }

      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data ? data.map(this.mapShopReviewDataToModel) : [];
    } catch (error) {
      console.error('Error fetching shop reviews:', error);
      return [];
    }
  }

  async createShopReview(reviewData: Partial<ShopReview>): Promise<ShopReview> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert([reviewData])
        .select('*, profiles(username, full_name)')
        .single();

      if (error) throw error;
      return this.mapShopReviewDataToModel(data);
    } catch (error) {
      console.error('Error creating shop review:', error);
      throw error;
    }
  }

  async updateShopReview(id: string, reviewData: Partial<ShopReview>): Promise<ShopReview> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .update(reviewData)
        .eq('id', id)
        .select('*, profiles(username, full_name)')
        .single();

      if (error) throw error;
      return this.mapShopReviewDataToModel(data);
    } catch (error) {
      console.error(`Error updating shop review ${id}:`, error);
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
      console.error(`Error deleting shop review ${id}:`, error);
      return false;
    }
  }

  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();

      if (error) throw error;
      return data ? this.mapShopSettingsDataToModel(data) : null;
    } catch (error) {
      console.error(`Error fetching shop settings for shop ${shopId}:`, error);
      return null;
    }
  }

  async updateShopSettings(shopId: string, settingsData: Partial<ShopSettings>): Promise<ShopSettings> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .upsert({
          shop_id: shopId,
          ...settingsData,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'shop_id' })
        .select('*')
        .single();

      if (error) throw error;
      return this.mapShopSettingsDataToModel(data);
    } catch (error) {
      console.error(`Error updating shop settings for shop ${shopId}:`, error);
      throw error;
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? this.mapOrderDataToModel(data) : null;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      return null;
    }
  }

  async getOrdersByShopId(shopId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('shop_id', shopId);

      if (error) throw error;
      return data ? data.map(this.mapOrderDataToModel) : [];
    } catch (error) {
      console.error(`Error fetching orders for shop ${shopId}:`, error);
      return [];
    }
  }

  async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', customerId);

      if (error) throw error;
      return data ? data.map(this.mapOrderDataToModel) : [];
    } catch (error) {
      console.error(`Error fetching orders for customer ${customerId}:`, error);
      return [];
    }
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select('*')
        .single();

      if (error) throw error;
      return this.mapOrderDataToModel(data);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Fix updateOrderStatus to match interface
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating order status for ${orderId}:`, error);
      return false;
    }
  }

  async deleteOrder(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting order ${id}:`, error);
      return false;
    }
  }

  async getFavoriteShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select('shop:shop_id(*)')
        .eq('user_id', userId);
  
      if (error) {
        console.error('Error fetching favorite shops:', error);
        return [];
      }
  
      if (!data) {
        return [];
      }
  
      // Extract shop data from the nested structure
      const shops = data.map(item => (item.shop ? this.mapShopDataToModel(item.shop) : null)).filter(shop => shop !== null);
      
      return shops as Shop[];
    } catch (error) {
      console.error('Error fetching favorite shops:', error);
      return [];
    }
  }
  
  async isShopFavorited(shopId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select('*')
        .eq('shop_id', shopId)
        .eq('user_id', userId)
        .single();
  
      if (error) {
        // If no record is found, it's not an error, just not favorited
        if (error.code === 'PGRST116') {
          return false;
        }
        console.error('Error checking if shop is favorited:', error);
        return false;
      }
  
      return !!data;
    } catch (error) {
      console.error('Error checking if shop is favorited:', error);
      return false;
    }
  }
  
  async addShopToFavorites(shopId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .insert([{ shop_id: shopId, user_id: userId }]);
  
      if (error) {
        console.error('Error adding shop to favorites:', error);
        return false;
      }
  
      return true;
    } catch (error) {
      console.error('Error adding shop to favorites:', error);
      return false;
    }
  }
  
  async removeShopFromFavorites(shopId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_favorite_shops')
        .delete()
        .eq('shop_id', shopId)
        .eq('user_id', userId);
  
      if (error) {
        console.error('Error removing shop from favorites:', error);
        return false;
      }
  
      return true;
    } catch (error) {
      console.error('Error removing shop from favorites:', error);
      return false;
    }
  }

  private mapShopDataToModel(data: any): Shop {
    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description,
      image_url: data.image_url,
      address: data.address,
      phone: data.phone,
      website: data.website,
      status: data.status,
      categories: data.categories,
      average_rating: data.average_rating,
      total_ratings: data.total_ratings,
      rating_count: data.rating_count,
      latitude: data.latitude,
      longitude: data.longitude,
      opening_hours: data.opening_hours,
      created_at: data.created_at,
      updated_at: data.updated_at,
      profiles: data.profiles,
      settings: data.settings,
    };
  }

  private mapShopItemDataToModel(data: any): ShopItem {
    return {
      id: data.id,
      shop_id: data.shop_id,
      name: data.name,
      description: data.description,
      image_url: data.image_url,
      price: data.price,
      original_price: data.original_price,
      stock: data.stock,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
      clothes_id: data.clothes_id,
      shop: data.shop,
    };
  }

  private mapShopReviewDataToModel(data: any): ShopReview {
    return {
      id: data.id,
      shop_id: data.shop_id,
      user_id: data.user_id,
      rating: data.rating,
      comment: data.comment,
      created_at: data.created_at,
      updated_at: data.updated_at,
      profiles: data.profiles,
    };
  }

  private mapShopSettingsDataToModel(data: any): ShopSettings {
    return {
      id: data.id,
      shop_id: data.shop_id,
      delivery_options: data.delivery_options,
      payment_methods: data.payment_methods,
      auto_accept_orders: data.auto_accept_orders,
      notification_preferences: data.notification_preferences,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  private mapOrderDataToModel(data: any): Order {
    return {
      id: data.id,
      shop_id: data.shop_id,
      customer_id: data.customer_id,
      status: data.status,
      total_amount: data.total_amount,
      delivery_fee: data.delivery_fee,
      payment_status: data.payment_status,
      payment_method: data.payment_method,
      delivery_address: data.delivery_address,
      created_at: data.created_at,
      updated_at: data.updated_at,
      items: data.items,
      buyer_id: data.buyer_id,
      seller_id: data.seller_id,
    };
  }
}
