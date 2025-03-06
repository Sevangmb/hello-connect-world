
import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '@/core/shop/domain/interfaces/IShopRepository';
import { Shop, ShopItem, ShopReview, ShopSettings, Order, DbOrder, ShopStatus, ShopItemStatus, OrderStatus, PaymentStatus, DeliveryOption, PaymentMethod } from '@/core/shop/domain/types';

export class ShopRepository implements IShopRepository {
  // Implementing the interface methods first
  
  async getShopById(id: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles (
            username,
            full_name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as unknown as Shop;
    } catch (error) {
      console.error(`Error fetching shop by ID ${id}:`, error);
      return null;
    }
  }

  async getShopsByUserId(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data as unknown as Shop[];
    } catch (error) {
      console.error(`Error fetching shops by user ID ${userId}:`, error);
      return [];
    }
  }

  async getAllShops(): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles (
            username,
            full_name
          )
        `);

      if (error) throw error;
      return data as unknown as Shop[];
    } catch (error) {
      console.error('Error fetching all shops:', error);
      return [];
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

  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop (
            name
          )
        `)
        .eq('shop_id', shopId);

      if (error) throw error;
      return data as unknown as ShopItem[];
    } catch (error) {
      console.error(`Error fetching shop items for shop ${shopId}:`, error);
      return [];
    }
  }

  async getShopItemById(itemId: string): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop (
            name
          )
        `)
        .eq('id', itemId)
        .single();

      if (error) throw error;
      return data as unknown as ShopItem;
    } catch (error) {
      console.error(`Error fetching shop item by ID ${itemId}:`, error);
      return null;
    }
  }

  async createShop(shop: Partial<Shop>): Promise<Shop> {
    try {
      // Ensure required fields are present
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

  async createShopItem(shopItem: Partial<ShopItem>): Promise<ShopItem> {
    try {
      // Ensure required fields are present
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
        .eq('shop_id', shopId);

      if (error) throw error;
      return data as unknown as ShopReview[];
    } catch (error) {
      console.error(`Error fetching reviews for shop ${shopId}:`, error);
      return [];
    }
  }

  async addShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview | null> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert([{
          shop_id: review.shop_id,
          user_id: review.user_id,
          rating: review.rating,
          comment: review.comment
        }])
        .select(`
          *,
          profiles (
            username,
            full_name
          )
        `)
        .single();

      if (error) throw error;
      return data as unknown as ShopReview;
    } catch (error) {
      console.error('Error adding shop review:', error);
      return null;
    }
  }

  async updateShopReview(reviewId: string, updates: Partial<ShopReview>): Promise<ShopReview | null> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .update(updates)
        .eq('id', reviewId)
        .select(`
          *,
          profiles (
            username,
            full_name
          )
        `)
        .single();

      if (error) throw error;
      return data as unknown as ShopReview;
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

  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      // Convert to the expected type
      const settings = {
        ...data,
        notification_preferences: typeof data.notification_preferences === 'string'
          ? JSON.parse(data.notification_preferences)
          : data.notification_preferences,
        delivery_options: data.delivery_options as unknown as DeliveryOption[],
        payment_methods: data.payment_methods as unknown as PaymentMethod[]
      } as unknown as ShopSettings;
      
      return settings;
    } catch (error) {
      console.error(`Error fetching shop settings for ${shopId}:`, error);
      return null;
    }
  }
  
  // Adding the missing methods
  
  async updateShopItemStatus(itemId: string, status: ShopItemStatus): Promise<boolean> {
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
      // Filter out items without required fields
      const validItems = items
        .filter(item => item.shop_id && item.price !== undefined)
        .map(item => ({
          shop_id: item.shop_id!,
          name: item.name || 'Unnamed item',
          description: item.description || '',
          image_url: item.image_url,
          price: item.price!,
          original_price: item.original_price,
          stock: item.stock !== undefined ? item.stock : 0,
          status: item.status || 'available' as ShopItemStatus,
          clothes_id: item.clothes_id
        }));

      if (validItems.length === 0) {
        throw new Error('No valid items to add');
      }

      const { data, error } = await supabase
        .from('shop_items')
        .insert(validItems)
        .select();

      if (error) throw error;
      
      return data as unknown as ShopItem[];
    } catch (error) {
      console.error('Error adding shop items:', error);
      throw error;
    }
  }

  async getShopReviewsByUserId(userId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      
      return data as unknown as ShopReview[];
    } catch (error) {
      console.error(`Error fetching reviews by user ${userId}:`, error);
      return [];
    }
  }

  async getUserOrders(userId: string, status?: OrderStatus): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .eq('buyer_id', userId);
        
      if (status) {
        query = query.eq('status', status as string);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      
      return data as unknown as Order[];
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
      
      return data as unknown as Order[];
    } catch (error) {
      console.error(`Error fetching seller orders for ${userId}:`, error);
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

  async getOrdersByShopId(shopId: string, status?: string): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .eq('shop_id', shopId);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as unknown as Order[];
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

  async getShopItemsByCategory(shopId: string, category: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('shop_id', shopId)
        .like('name', `%${category}%`); // Adjust the filter as needed

      if (error) throw error;
      return data as unknown as ShopItem[];
    } catch (error) {
      console.error(`Error fetching shop items by category for shop ${shopId}:`, error);
      return [];
    }
  }
  
  // Implementing additional methods from the interface
  
  async getShopByUserId(userId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data as unknown as Shop;
    } catch (error) {
      console.error(`Error fetching shop for user ${userId}:`, error);
      return null;
    }
  }

  async getUserShops(userId: string): Promise<Shop[]> {
    return this.getShopsByUserId(userId);
  }

  async getShopsByStatus(status: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('status', status);

      if (error) throw error;
      return data as unknown as Shop[];
    } catch (error) {
      console.error(`Error fetching shops with status ${status}:`, error);
      return [];
    }
  }

  async getAllShopItems(): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*');

      if (error) throw error;
      return data as unknown as ShopItem[];
    } catch (error) {
      console.error('Error fetching all shop items:', error);
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

  async getFeaturedShops(limit: number = 5): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('status', 'approved')
        .order('average_rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as unknown as Shop[];
    } catch (error) {
      console.error('Error fetching featured shops:', error);
      return [];
    }
  }

  async getRelatedShops(shopId: string, limit: number = 3): Promise<Shop[]> {
    try {
      const shop = await this.getShopById(shopId);
      if (!shop || !shop.categories || shop.categories.length === 0) {
        return [];
      }

      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .neq('id', shopId)
        .eq('status', 'approved')
        .limit(limit);

      if (error) throw error;
      
      // Simple related shops implementation - in a real app this would be more sophisticated
      return data as unknown as Shop[];
    } catch (error) {
      console.error(`Error fetching related shops for shop ${shopId}:`, error);
      return [];
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
      return data as unknown as ShopSettings;
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
      return data as unknown as ShopSettings;
    } catch (error) {
      console.error('Error creating shop settings:', error);
      return null;
    }
  }

  async toggleShopFavorite(shopId: string, userId: string): Promise<boolean> {
    try {
      // Check if already favorited
      const { data: existingFav, error: checkError } = await supabase
        .from('user_favorite_shops')
        .select('*')
        .eq('shop_id', shopId)
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existingFav) {
        // Remove favorite
        const { error: deleteError } = await supabase
          .from('user_favorite_shops')
          .delete()
          .eq('shop_id', shopId)
          .eq('user_id', userId);

        if (deleteError) throw deleteError;
        return false; // Indicates removed from favorites
      } else {
        // Add favorite
        const { error: insertError } = await supabase
          .from('user_favorite_shops')
          .insert([{ shop_id: shopId, user_id: userId }]);

        if (insertError) throw insertError;
        return true; // Indicates added to favorites
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
        .select(`
          shop_id,
          shops (*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      // Extract the shops from the join
      const shops = data.map(item => item.shops);
      return shops as unknown as Shop[];
    } catch (error) {
      console.error(`Error fetching favorite shops for user ${userId}:`, error);
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
}
