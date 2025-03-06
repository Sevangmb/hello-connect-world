
import { supabase } from '@/integrations/supabase/client';
import { 
  Shop, 
  ShopItem, 
  ShopItemStatus, 
  ShopReview, 
  Order, 
  OrderStatus, 
  PaymentStatus,
  ShopSettings, 
  DeliveryOption, 
  PaymentMethod, 
  CartItem, 
  DbOrder
} from '@/core/shop/domain/types';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

export class ShopRepository implements IShopRepository {
  
  // Shop methods
  async getShops(): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Shop[];
    } catch (error) {
      console.error('Error fetching shops:', error);
      return [];
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
      return data as Shop;
    } catch (error) {
      console.error(`Error fetching shop ${id}:`, error);
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
        if (error.code === 'PGRST116') {
          // No shop found for this user
          return null;
        }
        throw error;
      }
      return data as Shop;
    } catch (error) {
      console.error(`Error fetching shop for user ${userId}:`, error);
      return null;
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
      return data as Shop[];
    } catch (error) {
      console.error(`Error fetching shops with status ${status}:`, error);
      return [];
    }
  }

  async createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .insert([shopData])
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
      console.error(`Error updating shop ${id}:`, error);
      throw error;
    }
  }

  // Shop items methods
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shops(name)')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error(`Error fetching items for shop ${shopId}:`, error);
      return [];
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
      return data as ShopItem;
    } catch (error) {
      console.error(`Error fetching shop item ${id}:`, error);
      return null;
    }
  }

  async createShopItem(itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert([itemData])
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
      console.error(`Error updating shop item ${id}:`, error);
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
      console.error(`Error updating shop item status ${id}:`, error);
      return false;
    }
  }

  // Reviews
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

  async createShopReview(reviewData: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert([reviewData])
        .select()
        .single();
      
      if (error) throw error;
      return data as ShopReview;
    } catch (error) {
      console.error('Error creating shop review:', error);
      throw error;
    }
  }

  // Orders
  async getOrdersByShop(shopId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('shop_orders')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get items for each order
      const ordersWithItems = await Promise.all(data.map(async (order: DbOrder) => {
        const { data: items, error: itemsError } = await supabase
          .from('shop_order_items')
          .select('*')
          .eq('order_id', order.id);
          
        if (itemsError) {
          console.error(`Error fetching items for order ${order.id}:`, itemsError);
          return { ...order, items: [] };
        }
        
        return { ...order, items: items || [] };
      }));
      
      return ordersWithItems as Order[];
    } catch (error) {
      console.error(`Error fetching orders for shop ${shopId}:`, error);
      return [];
    }
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('shop_orders')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get items for each order
      const ordersWithItems = await Promise.all(data.map(async (order: DbOrder) => {
        const { data: items, error: itemsError } = await supabase
          .from('shop_order_items')
          .select('*')
          .eq('order_id', order.id);
          
        if (itemsError) {
          console.error(`Error fetching items for order ${order.id}:`, itemsError);
          return { ...order, items: [] };
        }
        
        return { ...order, items: items || [] };
      }));
      
      return ordersWithItems as Order[];
    } catch (error) {
      console.error(`Error fetching orders for customer ${customerId}:`, error);
      return [];
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('shop_orders')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Get items for the order
      const { data: items, error: itemsError } = await supabase
        .from('shop_order_items')
        .select('*')
        .eq('order_id', id);
        
      if (itemsError) {
        console.error(`Error fetching items for order ${id}:`, itemsError);
        return { ...data, items: [] } as Order;
      }
      
      return { ...data, items: items || [] } as Order;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      return null;
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating order status ${orderId}:`, error);
      return false;
    }
  }

  // Favorites - Fixed to match interface
  async isShopFavorited(shopId: string): Promise<boolean> {
    try {
      // For this method, we'll get the current user ID from the session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select('*')
        .eq('user_id', user.id)
        .eq('shop_id', shopId);
      
      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      console.error(`Error checking if shop ${shopId} is favorited:`, error);
      return false;
    }
  }

  async addShopToFavorites(shopId: string): Promise<boolean> {
    try {
      // Get current user ID from session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { error } = await supabase
        .from('user_favorite_shops')
        .insert([{ user_id: user.id, shop_id: shopId }]);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error adding shop ${shopId} to favorites:`, error);
      return false;
    }
  }

  async removeShopFromFavorites(shopId: string): Promise<boolean> {
    try {
      // Get current user ID from session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { error } = await supabase
        .from('user_favorite_shops')
        .delete()
        .eq('user_id', user.id)
        .eq('shop_id', shopId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error removing shop ${shopId} from favorites:`, error);
      return false;
    }
  }

  async getFavoriteShops(): Promise<Shop[]> {
    try {
      // Get current user ID from session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      // Get favorite shop IDs
      const { data: favoriteData, error: favoriteError } = await supabase
        .from('user_favorite_shops')
        .select('shop_id')
        .eq('user_id', user.id);
      
      if (favoriteError) throw favoriteError;
      
      if (!favoriteData || favoriteData.length === 0) {
        return [];
      }
      
      // Get shop details for each favorite
      const shopIds = favoriteData.map(fav => fav.shop_id);
      
      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .in('id', shopIds);
      
      if (shopError) throw shopError;
      
      return shopData as Shop[];
    } catch (error) {
      console.error('Error fetching favorite shops:', error);
      return [];
    }
  }

  // Shop settings
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No settings found, create default
          return this.createDefaultSettings(shopId);
        }
        throw error;
      }
      
      return data as ShopSettings;
    } catch (error) {
      console.error(`Error fetching settings for shop ${shopId}:`, error);
      return null;
    }
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings> {
    try {
      // Check if settings exist
      const existingSettings = await this.getShopSettings(shopId);
      
      if (!existingSettings) {
        // Create with defaults and then update
        await this.createDefaultSettings(shopId);
      }
      
      const { data, error } = await supabase
        .from('shop_settings')
        .update(settings)
        .eq('shop_id', shopId)
        .select()
        .single();
      
      if (error) throw error;
      return data as ShopSettings;
    } catch (error) {
      console.error(`Error updating settings for shop ${shopId}:`, error);
      throw error;
    }
  }

  // Helper for creating default settings
  private async createDefaultSettings(shopId: string): Promise<ShopSettings> {
    try {
      const defaultSettings = {
        shop_id: shopId,
        delivery_options: ['pickup', 'delivery'] as DeliveryOption[],
        payment_methods: ['card', 'paypal'] as PaymentMethod[],
        auto_accept_orders: false,
        notification_preferences: {
          email: true,
          app: true
        }
      };
      
      const { data, error } = await supabase
        .from('shop_settings')
        .insert([defaultSettings])
        .select()
        .single();
      
      if (error) throw error;
      return data as ShopSettings;
    } catch (error) {
      console.error(`Error creating default settings for shop ${shopId}:`, error);
      throw error;
    }
  }
}
