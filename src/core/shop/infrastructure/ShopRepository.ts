
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopItem, ShopReview, ShopSettings, CartItem, DbCartItem, Order, OrderStatus, PaymentStatus, 
  mapShopItems, mapShopItem, mapOrder, mapOrders, isShopStatus, mapSettings, mapCartItem } from '../domain/types';

// ShopRepository now implements partial interface until properly refactored
export class ShopRepository {

  // Implement bare minimum for the repository to work
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();

      if (error) {
        console.error("Error fetching shop settings:", error);
        return null;
      }

      return mapSettings(data);
    } catch (error) {
      console.error("Error in getShopSettings:", error);
      return null;
    }
  }

  async createShopSettings(settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    if (!settings.shop_id) {
      console.error("Shop ID is required for creating settings");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .insert({
          shop_id: settings.shop_id,
          delivery_options: settings.delivery_options || [],
          payment_methods: settings.payment_methods || [],
          auto_accept_orders: settings.auto_accept_orders || false,
          notification_preferences: settings.notification_preferences || { email: true, app: true }
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating shop settings:", error);
        return null;
      }

      return mapSettings(data);
    } catch (error) {
      console.error("Error in createShopSettings:", error);
      return null;
    }
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    try {
      // First check if settings exist
      const existing = await this.getShopSettings(shopId);
      
      if (!existing) {
        // Create settings if they don't exist
        return this.createShopSettings({ ...settings, shop_id: shopId });
      }
      
      // Update existing settings
      const updateData: any = {};
      
      if (settings.delivery_options) {
        updateData.delivery_options = settings.delivery_options;
      }
      
      if (settings.payment_methods) {
        updateData.payment_methods = settings.payment_methods;
      }
      
      if (settings.auto_accept_orders !== undefined) {
        updateData.auto_accept_orders = settings.auto_accept_orders;
      }
      
      if (settings.notification_preferences) {
        updateData.notification_preferences = settings.notification_preferences;
      }
      
      const { data, error } = await supabase
        .from('shop_settings')
        .update(updateData)
        .eq('shop_id', shopId)
        .select()
        .single();

      if (error) {
        console.error("Error updating shop settings:", error);
        return null;
      }

      return mapSettings(data);
    } catch (error) {
      console.error("Error in updateShopSettings:", error);
      return null;
    }
  }

  // Bare minimum implementation of other required methods
  async getShopByUserId(userId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles:user_id(username, full_name)')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error("Error fetching shop by user ID:", error);
        return null;
      }

      if (!data) return null;

      // Fetch shop settings
      const settings = await this.getShopSettings(data.id);

      // Ensure status is a valid ShopStatus
      return {
        ...data,
        status: isShopStatus(data.status) ? data.status : 'pending',
        settings
      };
    } catch (error) {
      console.error("Error in getShopByUserId:", error);
      return null;
    }
  }

  async getShopById(id: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles:user_id(username, full_name)')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching shop by ID:", error);
        return null;
      }

      if (!data) return null;

      // Fetch shop settings
      const settings = await this.getShopSettings(data.id);

      // Ensure status is a valid ShopStatus
      return {
        ...data,
        status: isShopStatus(data.status) ? data.status : 'pending',
        settings
      };
    } catch (error) {
      console.error("Error in getShopById:", error);
      return null;
    }
  }

  async createShop(shopData: Partial<Shop>): Promise<Shop> {
    try {
      if (!shopData.name || !shopData.user_id) {
        throw new Error("Shop name and user_id are required");
      }

      const { data: shopResult, error: shopError } = await supabase
        .from('shops')
        .insert({
          name: shopData.name,
          description: shopData.description || '',
          user_id: shopData.user_id,
          status: shopData.status || 'pending',
          image_url: shopData.image_url,
          address: shopData.address,
          phone: shopData.phone,
          website: shopData.website,
          categories: shopData.categories || [],
          latitude: shopData.latitude,
          longitude: shopData.longitude,
          opening_hours: shopData.opening_hours,
          average_rating: 0
        })
        .select()
        .single();

      if (shopError) throw shopError;

      // Create default shop settings
      const defaultSettings: Partial<ShopSettings> = {
        shop_id: shopResult.id,
        delivery_options: ['both'],
        payment_methods: ['card', 'paypal'],
        auto_accept_orders: false,
        notification_preferences: {
          email: true,
          app: true
        }
      };

      await this.createShopSettings(defaultSettings);

      // Fetch the complete shop with settings
      return this.getShopById(shopResult.id);
    } catch (error) {
      console.error("Error creating shop:", error);
      throw error;
    }
  }

  async updateShop(shopId: string, updates: Partial<Shop>): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .update({
          name: updates.name,
          description: updates.description,
          image_url: updates.image_url,
          address: updates.address,
          phone: updates.phone,
          website: updates.website,
          status: updates.status,
          categories: updates.categories,
          latitude: updates.latitude,
          longitude: updates.longitude,
          opening_hours: updates.opening_hours,
          updated_at: new Date().toISOString()
        })
        .eq('id', shopId)
        .select()
        .single();

      if (error) {
        console.error("Error updating shop:", error);
        return null;
      }

      return this.getShopById(shopId);
    } catch (error) {
      console.error("Error in updateShop:", error);
      return null;
    }
  }

  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('shop_id', shopId);

      if (error) {
        console.error("Error fetching shop items:", error);
        return [];
      }

      return mapShopItems(data);
    } catch (error) {
      console.error("Error in getShopItems:", error);
      return [];
    }
  }

  async createShopItem(item: Partial<ShopItem>): Promise<ShopItem> {
    try {
      if (!item.shop_id || !item.name || item.price === undefined) {
        throw new Error("Shop ID, name, and price are required");
      }

      const { data, error } = await supabase
        .from('shop_items')
        .insert({
          shop_id: item.shop_id,
          name: item.name,
          description: item.description || '',
          image_url: item.image_url,
          price: item.price,
          original_price: item.original_price,
          stock: item.stock || 0,
          status: item.status || 'available',
          clothes_id: item.clothes_id
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating shop item:", error);
        throw error;
      }

      return mapShopItem(data);
    } catch (error) {
      console.error("Error in createShopItem:", error);
      throw error;
    }
  }

  async addToCart(userId: string, shopItemId: string, quantity: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          shop_item_id: shopItemId,
          quantity: quantity
        });

      if (error) {
        console.error("Error adding to cart:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in addToCart:", error);
      return false;
    }
  }

  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select('*, profiles:user_id(username, full_name)')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching shop reviews:", error);
        return [];
      }

      return data;
    } catch (error) {
      console.error("Error in getShopReviews:", error);
      return [];
    }
  }

  async createShopReview(review: Partial<ShopReview>): Promise<ShopReview> {
    try {
      if (!review.shop_id || !review.user_id || review.rating === undefined) {
        throw new Error("Shop ID, user ID, and rating are required");
      }

      const { data, error } = await supabase
        .from('shop_reviews')
        .insert({
          shop_id: review.shop_id,
          user_id: review.user_id,
          rating: review.rating,
          comment: review.comment
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating shop review:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error in createShopReview:", error);
      throw error;
    }
  }

  async getUserOrders(userId: string, status?: OrderStatus): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('customer_id', userId);
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching user orders:", error);
        return [];
      }

      return mapOrders(data);
    } catch (error) {
      console.error("Error in getUserOrders:", error);
      return [];
    }
  }

  async getOrdersByShopId(shopId: string, status?: OrderStatus): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('shop_id', shopId);
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching shop orders:", error);
        return [];
      }

      return mapOrders(data);
    } catch (error) {
      console.error("Error in getOrdersByShopId:", error);
      return [];
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) {
        console.error("Error updating order status:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in updateOrderStatus:", error);
      return false;
    }
  }

  // Minimal implementation of required methods
  async getShopsByUserId(userId: string): Promise<Shop[]> { return []; }
  async getUserShops(userId: string): Promise<Shop[]> { return []; }
  async getAllShops(): Promise<Shop[]> { return []; }
  async deleteShop(shopId: string): Promise<boolean> { return false; }
  async getShopsByStatus(status: string): Promise<Shop[]> { return []; }
  async updateShopStatus(shopId: string, status: string): Promise<boolean> { return false; }
  async getShopItemsByShopId(shopId: string): Promise<ShopItem[]> { return []; }
  async getAllShopItems(): Promise<ShopItem[]> { return []; }
  async getShopItemById(itemId: string): Promise<ShopItem | null> { return null; }
  async updateShopItem(itemId: string, updates: Partial<ShopItem>): Promise<ShopItem | null> { return null; }
  async deleteShopItem(itemId: string): Promise<boolean> { return false; }
  async updateShopItemStatus(itemId: string, status: string): Promise<boolean> { return false; }
  async addShopItems(items: Partial<ShopItem>[]): Promise<ShopItem[]> { return []; }
  async getShopItemsByCategory(shopId: string, category: string): Promise<ShopItem[]> { return []; }
  async searchShopItems(query: string): Promise<ShopItem[]> { return []; }
  async getShopItemsByStatus(shopId: string, status: string): Promise<ShopItem[]> { return []; }
  async getShopReviewsByShopId(shopId: string): Promise<ShopReview[]> { return []; }
  async addShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview | null> { return null; }
  async updateShopReview(reviewId: string, updates: Partial<ShopReview>): Promise<ShopReview | null> { return null; }
  async deleteShopReview(reviewId: string): Promise<boolean> { return false; }
  async getShopReviewsByUserId(userId: string): Promise<ShopReview[]> { return []; }
  async toggleShopFavorite(shopId: string, userId: string): Promise<boolean> { return false; }
  async isShopFavorited(shopId: string, userId: string): Promise<boolean> { return false; }
  async getUserFavoriteShops(userId: string): Promise<Shop[]> { return []; }
  async getFavoriteShops(userId: string): Promise<Shop[]> { return []; }
  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> { return false; }
  async removeShopFromFavorites(userId: string, shopId: string): Promise<boolean> { return false; }
  async getFeaturedShops(limit?: number): Promise<Shop[]> { return []; }
  async getRelatedShops(shopId: string, limit?: number): Promise<Shop[]> { return []; }
  async getSellerOrders(userId: string): Promise<Order[]> { return []; }
  async getShopOrders(shopId: string): Promise<Order[]> { return []; }
  async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus): Promise<boolean> { return false; }
  async createOrder(orderData: Partial<Order>): Promise<Order> { throw new Error("Not implemented"); }
}
