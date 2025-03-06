import { supabase } from '@/integrations/supabase/client';
import { 
  Shop, 
  ShopItem, 
  ShopSettings, 
  ShopReview, 
  Order, 
  CartItem,
  DbCartItem,
  DbOrder,
  isShopStatus,
  isShopItemStatus,
  isOrderStatus,
  isPaymentStatus,
  mapShopFromDB,
  mapShopItem,
  mapShopItems,
  mapOrder,
  mapOrders,
  mapSettings,
  mapCartItem
} from '../domain/types';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

export class ShopRepository implements IShopRepository {
  async getShopById(shopId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('id', shopId)
        .single();
        
      if (error) throw error;
      if (!data) return null;
      
      return mapShopFromDB(data);
    } catch (error) {
      console.error(`Error fetching shop with ID ${shopId}:`, error);
      return null;
    }
  }
  
  async getUserShop(userId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('user_id', userId)
        .single();
        
      if (error) throw error;
      if (!data) return null;
      
      return mapShopFromDB(data);
    } catch (error) {
      console.error(`Error fetching shop for user ${userId}:`, error);
      return null;
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
      if (!data) return null;
      
      return mapSettings(data);
    } catch (error) {
      console.error(`Error fetching settings for shop ${shopId}:`, error);
      return null;
    }
  }
  
  async createShopSettings(settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    try {
      if (!settings.shop_id) {
        throw new Error('shop_id is required to create shop settings');
      }
      
      const { data, error } = await supabase
        .from('shop_settings')
        .insert(settings)
        .select()
        .single();
        
      if (error) throw error;
      if (!data) return null;
      
      return mapSettings(data);
    } catch (error) {
      console.error('Error creating shop settings:', error);
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
      if (!data) return null;
      
      return mapSettings(data);
    } catch (error) {
      console.error(`Error updating settings for shop ${shopId}:`, error);
      return null;
    }
  }

  async createShop(shop: Partial<Shop>): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .insert(shop)
        .select()
        .single();

      if (error) throw error;
      if (!data) return null;

      return mapShopFromDB(data);
    } catch (error) {
      console.error('Error creating shop:', error);
      return null;
    }
  }

  async updateShop(id: string, shop: Partial<Shop>): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .update(shop)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) return null;

      return mapShopFromDB(data);
    } catch (error) {
      console.error(`Error updating shop with ID ${id}:`, error);
      return null;
    }
  }

  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('shop_id', shopId);

      if (error) throw error;
      if (!data) return [];

      return mapShopItems(data);
    } catch (error) {
      console.error(`Error fetching shop items for shop ${shopId}:`, error);
      return [];
    }
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return mapShopItem(data);
    } catch (error) {
      console.error(`Error fetching shop item with ID ${id}:`, error);
      return null;
    }
  }

  async createShopItem(item: Partial<ShopItem>): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      if (!data) return null;

      return mapShopItem(data);
    } catch (error) {
      console.error('Error creating shop item:', error);
      return null;
    }
  }

  async updateShopItem(id: string, item: Partial<ShopItem>): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .update(item)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) return null;

      return mapShopItem(data);
    } catch (error) {
      console.error(`Error updating shop item with ID ${id}:`, error);
      return null;
    }
  }

  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select('*')
        .eq('shop_id', shopId);

      if (error) throw error;
      if (!data) return [];

      return data as ShopReview[];
    } catch (error) {
      console.error(`Error fetching shop reviews for shop ${shopId}:`, error);
      return [];
    }
  }

  async createShopReview(review: Partial<ShopReview>): Promise<ShopReview | null> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert(review)
        .select()
        .single();

      if (error) throw error;
      if (!data) return null;

      return data as ShopReview;
    } catch (error) {
      console.error('Error creating shop review:', error);
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
      if (!data) return [];

      return mapOrders(data);
    } catch (error) {
      console.error(`Error fetching orders for shop ${shopId}:`, error);
      return [];
    }
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`customer_id.eq.${userId},seller_id.eq.${userId}`);

      if (error) throw error;
      if (!data) return [];

      return mapOrders(data);
    } catch (error) {
      console.error(`Error fetching orders for user ${userId}:`, error);
      return [];
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
      if (!data) return null;

      return mapOrder(data);
    } catch (error) {
      console.error(`Error fetching order with ID ${id}:`, error);
      return null;
    }
  }

  async createOrder(order: Partial<Order>): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert(order)
        .select()
        .single();

      if (error) throw error;
      if (!data) return null;

      return mapOrder(data);
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }

  async updateOrderStatus(id: string, status: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error(`Error updating order status for order ${id}:`, error);
      return false;
    }
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, shop_items(*), shop(*)')
        .eq('user_id', userId);

      if (error) throw error;
      if (!data) return [];

      return data.map(mapCartItem);
    } catch (error) {
      console.error(`Error fetching cart items for user ${userId}:`, error);
      return [];
    }
  }

  async addToCart(item: DbCartItem): Promise<CartItem | null> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .insert(item)
        .select('*, shop_items(*), shop(*)')
        .single();

      if (error) throw error;
      if (!data) return null;

      return mapCartItem(data);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return null;
    }
  }

  async updateCartItemQuantity(id: string, quantity: number): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', id);

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error(`Error updating cart item quantity for item ${id}:`, error);
      return false;
    }
  }

  async removeFromCart(id: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error(`Error removing item from cart with ID ${id}:`, error);
      return false;
    }
  }

  async clearCart(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error(`Error clearing cart for user ${userId}:`, error);
      return false;
    }
  }

  async getUserFavoriteShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('favorite_shops')
        .select('shop(*, profiles(username, full_name))')
        .eq('user_id', userId);

      if (error) throw error;
      if (!data) return [];

      return data.map(item => mapShopFromDB(item.shop));
    } catch (error) {
      console.error(`Error fetching favorite shops for user ${userId}:`, error);
      return [];
    }
  }

  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('favorite_shops')
        .select('*')
        .eq('user_id', userId)
        .eq('shop_id', shopId)
        .single();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error(`Error checking if shop ${shopId} is favorited by user ${userId}:`, error);
      return false;
    }
  }

  async toggleShopFavorite(userId: string, shopId: string): Promise<boolean> {
    try {
      const isFavorited = await this.isShopFavorited(userId, shopId);

      if (isFavorited) {
        // Remove from favorites
        const { data, error } = await supabase
          .from('favorite_shops')
          .delete()
          .eq('user_id', userId)
          .eq('shop_id', shopId);

        if (error) throw error;
        return !!data;
      } else {
        // Add to favorites
        const { data, error } = await supabase
          .from('favorite_shops')
          .insert({ user_id: userId, shop_id: shopId });

        if (error) throw error;
        return !!data;
      }
    } catch (error) {
      console.error(`Error toggling favorite status for shop ${shopId} by user ${userId}:`, error);
      return false;
    }
  }
}
