import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { Shop, ShopItem, ShopReview, ShopSettings, Order, CartItem, DbCartItem, DbOrder } from '../domain/types';

export class ShopRepository implements IShopRepository {
  async getShopById(id: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Shop;
    } catch (error) {
      console.error(`Error fetching shop by ID ${id}:`, error);
      return null;
    }
  }

  async getShopsByUserId(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('user_id', userId);

      if (error) throw error;
      return data as Shop[];
    } catch (error) {
      console.error(`Error fetching shops by user ID ${userId}:`, error);
      return [];
    }
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data as Shop;
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
      return data as Shop[];
    } catch (error) {
      console.error(`Error fetching shops for user ${userId}:`, error);
      return [];
    }
  }

  async getAllShops(): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Shop[];
    } catch (error) {
      console.error('Error fetching all shops:', error);
      return [];
    }
  }

  async createShop(shop: Partial<Shop>): Promise<Shop> {
    try {
      if (!shop.name || !shop.user_id) {
        throw new Error('Shop name and user_id are required');
      }

      const shopData = {
        name: shop.name,
        user_id: shop.user_id,
        description: shop.description || '',
        image_url: shop.image_url,
        address: shop.address,
        phone: shop.phone,
        website: shop.website,
        status: shop.status || 'pending' as ShopStatus,
        categories: shop.categories || [],
        average_rating: shop.average_rating || 0,
        total_ratings: shop.total_ratings || 0,
        latitude: shop.latitude,
        longitude: shop.longitude,
        opening_hours: shop.opening_hours
      };

      const { data, error } = await supabase
        .from('shops')
        .insert([shopData])
        .select()
        .single();

      if (error) throw error;
      
      return data as unknown as Shop;
    } catch (error) {
      console.error('Error creating shop:', error);
      throw error;
    }
  }

  async updateShop(shopId: string, updates: Partial<Shop>): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .update(updates)
        .eq('id', shopId)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as Shop;
    } catch (error) {
      console.error(`Error updating shop ${shopId}:`, error);
      return null;
    }
  }

  async deleteShop(shopId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shops')
        .delete()
        .eq('id', shopId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting shop ${shopId}:`, error);
      return false;
    }
  }

  async getShopsByStatus(status: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('status', status);

      if (error) throw error;
      return data as Shop[];
    } catch (error) {
      console.error(`Error fetching shops with status ${status}:`, error);
      return [];
    }
  }

  async updateShopStatus(shopId: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shops')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', shopId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating shop status for ${shopId}:`, error);
      return false;
    }
  }

  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop(name)')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as ShopItem[];
    } catch (error) {
      console.error(`Error fetching items for shop ${shopId}:`, error);
      return [];
    }
  }

  async getShopItemsByShopId(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop(name)')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as ShopItem[];
    } catch (error) {
      console.error(`Error fetching items for shop ${shopId}:`, error);
      return [];
    }
  }

  async getAllShopItems(): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as ShopItem[];
    } catch (error) {
      console.error('Error fetching all shop items:', error);
      return [];
    }
  }

  async getShopItemById(itemId: string): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop(name)')
        .eq('id', itemId)
        .single();

      if (error) throw error;
      return data as unknown as ShopItem;
    } catch (error) {
      console.error(`Error fetching shop item by ID ${itemId}:`, error);
      return null;
    }
  }

  async createShopItem(shopItem: Partial<ShopItem>): Promise<ShopItem> {
    try {
      if (!shopItem.shop_id || shopItem.price === undefined) {
        throw new Error('Shop ID and price are required');
      }

      const shopItemData = {
        shop_id: shopItem.shop_id,
        name: shopItem.name || 'Unnamed item',
        description: shopItem.description || '',
        image_url: shopItem.image_url,
        price: shopItem.price,
        original_price: shopItem.original_price,
        stock: shopItem.stock !== undefined ? shopItem.stock : 0,
        status: shopItem.status || 'available' as ShopItemStatus,
        clothes_id: shopItem.clothes_id
      };

      const { data, error } = await supabase
        .from('shop_items')
        .insert([shopItemData])
        .select()
        .single();

      if (error) throw error;
      
      return data as unknown as ShopItem;
    } catch (error) {
      console.error('Error creating shop item:', error);
      throw error;
    }
  }

  async updateShopItem(itemId: string, updates: Partial<ShopItem>): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .update(updates)
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as ShopItem;
    } catch (error) {
      console.error(`Error updating shop item ${itemId}:`, error);
      return null;
    }
  }

  async deleteShopItem(itemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting shop item ${itemId}:`, error);
      return false;
    }
  }

  async updateShopItemStatus(itemId: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_items')
        .update({ 
          status, 
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating shop item status for ${itemId}:`, error);
      return false;
    }
  }

  async addShopItems(items: Partial<ShopItem>[]): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert(items)
        .select();

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error adding shop items:', error);
      return [];
    }
  }

  async getShopItemsByCategory(shopId: string, category: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('shop_id', shopId)
        .like('name', `%${category}%`);

      if (error) throw error;
      return data as unknown as ShopItem[];
    } catch (error) {
      console.error(`Error fetching shop items by category for shop ${shopId}:`, error);
      return [];
    }
  }

  async searchShopItems(query: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .or(`name.ilike.%${query}%, description.ilike.%${query}%`);

      if (error) throw error;
      return data as unknown as ShopItem[];
    } catch (error) {
      console.error(`Error searching shop items with query "${query}":`, error);
      return [];
    }
  }

  async getShopItemsByStatus(shopId: string, status: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('shop_id', shopId)
        .eq('status', status);

      if (error) throw error;
      return data as unknown as ShopItem[];
    } catch (error) {
      console.error(`Error fetching shop items with status ${status}:`, error);
      return [];
    }
  }

  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select('*, profiles(username, full_name)')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ShopReview[];
    } catch (error) {
      console.error(`Error fetching reviews for shop ${shopId}:`, error);
      return [];
    }
  }

  async getShopReviewsByShopId(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select('*, profiles(username, full_name)')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ShopReview[];
    } catch (error) {
      console.error(`Error fetching reviews for shop ${shopId}:`, error);
      return [];
    }
  }

  async addShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview | null> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert({
          shop_id: review.shop_id,
          user_id: review.user_id,
          rating: review.rating,
          comment: review.comment,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('*, profiles(username, full_name)')
        .single();

      if (error) throw error;
      return data as ShopReview;
    } catch (error) {
      console.error('Error creating shop review:', error);
      return null;
    }
  }

  async createShopReview(review: Partial<ShopReview>): Promise<ShopReview> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert({
          shop_id: review.shop_id,
          user_id: review.user_id,
          rating: review.rating,
          comment: review.comment,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('*, profiles(username, full_name)')
        .single();

      if (error) throw error;
      return data as ShopReview;
    } catch (error) {
      console.error('Error creating shop review:', error);
      throw error;
    }
  }

  async updateShopReview(reviewId: string, updates: Partial<ShopReview>): Promise<ShopReview | null> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .update(updates)
        .eq('id', reviewId)
        .select('*, profiles(username, full_name)')
        .single();

      if (error) throw error;
      return data as ShopReview;
    } catch (error) {
      console.error(`Error updating shop review ${reviewId}:`, error);
      return null;
    }
  }

  async deleteShopReview(reviewId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting shop review ${reviewId}:`, error);
      return false;
    }
  }

  async getShopReviewsByUserId(userId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data as ShopReview[];
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

      if (error) throw error;
      return data as ShopSettings;
    } catch (error) {
      console.error(`Error fetching shop settings for ${shopId}:`, error);
      return null;
    }
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .update({
          delivery_options: settings.delivery_options,
          payment_methods: settings.payment_methods,
          auto_accept_orders: settings.auto_accept_orders,
          notification_preferences: settings.notification_preferences,
          updated_at: new Date().toISOString()
        })
        .eq('shop_id', shopId)
        .select()
        .single();

      if (error) throw error;
      return data as ShopSettings;
    } catch (error) {
      console.error(`Error updating shop settings for ${shopId}:`, error);
      return null;
    }
  }

  async createShopSettings(settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    try {
      if (!settings.shop_id) {
        throw new Error('Shop ID is required for shop settings');
      }

      const { data, error } = await supabase
        .from('shop_settings')
        .insert([{
          shop_id: settings.shop_id,
          delivery_options: settings.delivery_options || ['pickup'],
          payment_methods: settings.payment_methods || ['card'],
          auto_accept_orders: settings.auto_accept_orders || false,
          notification_preferences: settings.notification_preferences || { email: true, app: true }
        }])
        .select()
        .single();

      if (error) throw error;
      return data as ShopSettings;
    } catch (error) {
      console.error('Error creating shop settings:', error);
      return null;
    }
  }

  async toggleShopFavorite(shopId: string, userId: string): Promise<boolean> {
    try {
      const { data: existingFav, error: checkError } = await supabase
        .from('user_favorite_shops')
        .select('*')
        .eq('shop_id', shopId)
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existingFav) {
        const { error: deleteError } = await supabase
          .from('user_favorite_shops')
          .delete()
          .eq('shop_id', shopId)
          .eq('user_id', userId);

        if (deleteError) throw deleteError;
        return false;
      } else {
        const { error: insertError } = await supabase
          .from('user_favorite_shops')
          .insert([{ shop_id: shopId, user_id: userId }]);

        if (insertError) throw insertError;
        return true;
      }
    } catch (error) {
      console.error(`Error toggling favorite for shop ${shopId}:`, error);
      return false;
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

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error(`Error checking if shop ${shopId} is favorited:`, error);
      return false;
    }
  }

  async getUserFavoriteShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select('shop_id')
        .eq('user_id', userId);

      if (error) throw error;

      if (data.length === 0) return [];

      const shopIds = data.map(item => item.shop_id);
      
      const { data: shops, error: shopsError } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .in('id', shopIds);

      if (shopsError) throw shopsError;
      
      return shops as Shop[];
    } catch (error) {
      console.error(`Error fetching favorite shops for user ${userId}:`, error);
      return [];
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
      
      const { data: shops, error: shopsError } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .in('id', shopIds);

      if (shopsError) throw shopsError;
      
      return shops as Shop[];
    } catch (error) {
      console.error(`Error fetching favorite shops for user ${userId}:`, error);
      return [];
    }
  }

  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_favorite_shops')
        .insert({
          user_id: userId,
          shop_id: shopId,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
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

  async getFeaturedShops(limit?: number): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('status', 'approved')
        .order('average_rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Shop[];
    } catch (error) {
      console.error('Error fetching featured shops:', error);
      return [];
    }
  }

  async getRelatedShops(shopId: string, limit?: number): Promise<Shop[]> {
    try {
      const shop = await this.getShopById(shopId);
      if (!shop || !shop.categories || shop.categories.length === 0) {
        return [];
      }

      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .neq('id', shopId)
        .eq('status', 'approved')
        .limit(limit);

      if (error) throw error;
      
      return data as Shop[];
    } catch (error) {
      console.error(`Error fetching related shops for shop ${shopId}:`, error);
      return [];
    }
  }

  async getUserOrders(userId: string, status?: string): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .eq('buyer_id', userId);
        
      if (status) {
        query = query.eq('status', status as string);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      return data as Order[];
    } catch (error) {
      console.error(`Error fetching orders for user ${userId}:`, error);
      return [];
    }
  }

  async getSellerOrders(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', userId);

      if (error) throw error;
      
      return data as Order[];
    } catch (error) {
      console.error(`Error fetching seller orders for ${userId}:`, error);
      return [];
    }
  }

  async getOrdersByShopId(shopId: string, status?: string): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .eq('shop_id', shopId);
        
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      return data as Order[];
    } catch (error) {
      console.error(`Error fetching orders for shop ${shopId}:`, error);
      return [];
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
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
      console.error(`Error updating order status for ${orderId}:`, error);
      return false;
    }
  }

  async updatePaymentStatus(orderId: string, paymentStatus: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: paymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating payment status for ${orderId}:`, error);
      return false;
    }
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          shop_id: orderData.shop_id,
          customer_id: orderData.customer_id,
          status: orderData.status || 'pending',
          total_amount: orderData.total_amount,
          delivery_fee: orderData.delivery_fee || 0,
          payment_status: orderData.payment_status || 'pending',
          payment_method: orderData.payment_method,
          delivery_address: orderData.delivery_address,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      return data as unknown as Order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async addToCart(userId: string, shopItemId: string, quantity: number): Promise<boolean> {
    try {
      const { data: existingItem, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('shop_item_id', shopItemId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingItem) {
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItem.quantity + quantity,
            updated_at: new Date().toISOString() 
          })
          .eq('id', existingItem.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            shop_item_id: shopItemId,
            quantity,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      return true;
    } catch (error) {
      console.error(`Error adding item ${shopItemId} to cart for user ${userId}:`, error);
      return false;
    }
  }
}
