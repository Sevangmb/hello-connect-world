import { Shop, ShopItem, ShopSettings, Order, CartItem, DbCartItem, mapShopFromDB, mapDeliveryOptions, mapPaymentMethods } from '../domain/types';
import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

export class ShopRepository implements IShopRepository {
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        delivery_options: mapDeliveryOptions(data.delivery_options),
        payment_methods: mapPaymentMethods(data.payment_methods)
      };
    } catch (error) {
      console.error('Error fetching shop settings:', error);
      return null;
    }
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .update({
          ...settings,
          shop_id: shopId,
          updated_at: new Date().toISOString()
        })
        .eq('shop_id', shopId)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        delivery_options: mapDeliveryOptions(data.delivery_options),
        payment_methods: mapPaymentMethods(data.payment_methods)
      };
    } catch (error) {
      console.error('Error updating shop settings:', error);
      return null;
    }
  }

  async getShopById(id: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles(
            username,
            full_name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return mapShopFromDB({
        ...data,
        profiles: data.profiles
      });
    } catch (error) {
      console.error('Error fetching shop by ID:', error);
      return null;
    }
  }

  async getShopsByUserId(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles(
            username,
            full_name
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      return data.map(shop => mapShopFromDB({
        ...shop,
        profiles: shop.profiles
      }));
    } catch (error) {
      console.error('Error fetching shops by user ID:', error);
      return [];
    }
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles(
            username,
            full_name
          )
        `)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      
      if (!data) return null;
      
      return mapShopFromDB({
        ...data,
        profiles: data.profiles
      });
    } catch (error) {
      console.error('Error fetching shop by user ID:', error);
      return null;
    }
  }

  async getUserShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles(
            username,
            full_name
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      return data.map(shop => mapShopFromDB({
        ...shop,
        profiles: shop.profiles
      }));
    } catch (error) {
      console.error('Error fetching user shops:', error);
      return [];
    }
  }

  async getAllShops(): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles(
            username,
            full_name
          )
        `);

      if (error) throw error;
      
      return data.map(shop => mapShopFromDB({
        ...shop,
        profiles: shop.profiles
      }));
    } catch (error) {
      console.error('Error fetching all shops:', error);
      return [];
    }
  }

  async createShop(shop: Partial<Shop>): Promise<Shop> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .insert([shop])
        .select(`
          *,
          profiles(
            username,
            full_name
          )
        `)
        .single();

      if (error) throw error;
      
      return mapShopFromDB({
        ...data,
        profiles: data.profiles
      });
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
        .select(`
          *,
          profiles(
            username,
            full_name
          )
        `)
        .single();

      if (error) throw error;
      
      return mapShopFromDB({
        ...data,
        profiles: data.profiles
      });
    } catch (error) {
      console.error('Error updating shop:', error);
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
      console.error('Error deleting shop:', error);
      return false;
    }
  }

  async getShopsByStatus(status: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles(
            username,
            full_name
          )
        `)
        .eq('status', status);

      if (error) throw error;
      
      return data.map(shop => mapShopFromDB({
        ...shop,
        profiles: shop.profiles
      }));
    } catch (error) {
      console.error('Error fetching shops by status:', error);
      return [];
    }
  }

  async updateShopStatus(shopId: string, status: string): Promise<boolean> {
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

  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop(
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

  async getShopItemsByShopId(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop(
            name
          )
        `)
        .eq('shop_id', shopId);

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error fetching shop items by shop ID:', error);
      return [];
    }
  }

  async getAllShopItems(): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop(
            name
          )
        `);

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error fetching all shop items:', error);
      return [];
    }
  }

  async getShopItemById(itemId: string): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop(
            name
          )
        `)
        .eq('id', itemId)
        .single();

      if (error) throw error;
      return data as ShopItem;
    } catch (error) {
      console.error('Error fetching shop item by ID:', error);
      return null;
    }
  }

  async createShopItem(shopItem: Partial<ShopItem>): Promise<ShopItem> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert([shopItem])
        .select(`
          *,
          shop(
            name
          )
        `)
        .single();

      if (error) throw error;
      return data as ShopItem;
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
        .select(`
          *,
          shop(
            name
          )
        `)
        .single();

      if (error) throw error;
      return data as ShopItem;
    } catch (error) {
      console.error('Error updating shop item:', error);
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
      console.error('Error deleting shop item:', error);
      return false;
    }
  }

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

  async addShopItems(items: Partial<ShopItem>[]): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert(items)
        .select(`
          *,
          shop(
            name
          )
        `);

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
        .select(`
          *,
          shop(
            name
          )
        `)
        .eq('shop_id', shopId)
        .like('category', `%${category}%`);

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error fetching shop items by category:', error);
      return [];
    }
  }

  async searchShopItems(query: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop(
            name
          )
        `)
        .like('name', `%${query}%`);

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error searching shop items:', error);
      return [];
    }
  }

  async getShopItemsByStatus(shopId: string, status: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop(
            name
          )
        `)
        .eq('shop_id', shopId)
        .eq('status', status);

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error fetching shop items by status:', error);
      return [];
    }
  }

  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select(`
          *,
          profiles(
            username,
            full_name
          )
        `)
        .eq('shop_id', shopId);

      if (error) throw error;
      return data as ShopReview[];
    } catch (error) {
      console.error('Error fetching shop reviews:', error);
      return [];
    }
  }

  async getShopReviewsByShopId(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select(`
          *,
          profiles(
            username,
            full_name
          )
        `)
        .eq('shop_id', shopId);

      if (error) throw error;
      return data as ShopReview[];
    } catch (error) {
      console.error('Error fetching shop reviews by shop ID:', error);
      return [];
    }
  }

  async addShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview | null> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert([review])
        .select(`
          *,
          profiles(
            username,
            full_name
          )
        `)
        .single();

      if (error) throw error;
      return data as ShopReview;
    } catch (error) {
      console.error('Error adding shop review:', error);
      return null;
    }
  }

  async createShopReview(review: Partial<ShopReview>): Promise<ShopReview> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert([review])
        .select(`
          *,
          profiles(
            username,
            full_name
          )
        `)
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
        .select(`
          *,
          profiles(
            username,
            full_name
          )
        `)
        .single();

      if (error) throw error;
      return data as ShopReview;
    } catch (error) {
      console.error('Error updating shop review:', error);
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
      console.error('Error deleting shop review:', error);
      return false;
    }
  }

  async getShopReviewsByUserId(userId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select(`
          *,
          profiles(
            username,
            full_name
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data as ShopReview[];
    } catch (error) {
      console.error('Error fetching shop reviews by user ID:', error);
      return [];
    }
  }

  async toggleShopFavorite(shopId: string, userId: string): Promise<boolean> {
    try {
      const { data: existingFavorite, error: selectError } = await supabase
        .from('shop_favorites')
        .select('*')
        .eq('shop_id', shopId)
        .eq('user_id', userId)
        .single();

      if (selectError) throw selectError;

      if (existingFavorite) {
        // If it exists, remove it
        return this.removeShopFromFavorites(userId, shopId);
      } else {
        // If it doesn't exist, add it
        return this.addShopToFavorites(userId, shopId);
      }
    } catch (error) {
      console.error('Error toggling shop favorite:', error);
      return false;
    }
  }

  async isShopFavorited(shopId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('shop_favorites')
        .select('*')
        .eq('shop_id', shopId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking if shop is favorited:', error);
      return false;
    }
  }

  async getUserFavoriteShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shop_favorites')
        .select(`
          shops (
            *,
            profiles(
              username,
              full_name
            )
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      // Extract shop data from the nested structure
      const favoriteShops = data.map(item => ({
        ...item.shops,
        profiles: item.shops.profiles
      }));

      return favoriteShops.map(shop => mapShopFromDB(shop));
    } catch (error) {
      console.error('Error fetching user favorite shops:', error);
      return [];
    }
  }

  async getFavoriteShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shop_favorites')
        .select(`
          shops (
            *,
            profiles(
              username,
              full_name
            )
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      // Extract shop data from the nested structure
      const favoriteShops = data.map(item => ({
        ...item.shops,
        profiles: item.shops.profiles
      }));

      return favoriteShops.map(shop => mapShopFromDB(shop));
    } catch (error) {
      console.error('Error fetching favorite shops:', error);
      return [];
    }
  }

  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_favorites')
        .insert([{ user_id: userId, shop_id: shopId }]);

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
        .from('shop_favorites')
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

  async getFeaturedShops(limit: number = 10): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles(
            username,
            full_name
          )
        `)
        .eq('is_featured', true)
        .limit(limit);

      if (error) throw error;
      
      return data.map(shop => mapShopFromDB({
        ...shop,
        profiles: shop.profiles
      }));
    } catch (error) {
      console.error('Error fetching featured shops:', error);
      return [];
    }
  }

  async getRelatedShops(shopId: string, limit: number = 10): Promise<Shop[]> {
    try {
      // Fetch the categories of the current shop
      const currentShop = await this.getShopById(shopId);
      if (!currentShop || !currentShop.categories) {
        return [];
      }

      // Fetch shops that share categories with the current shop
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles(
            username,
            full_name
          )
        `)
        .contains('categories', currentShop.categories)
        .neq('id', shopId) // Exclude the current shop
        .limit(limit);

      if (error) throw error;
      
      return data.map(shop => mapShopFromDB({
        ...shop,
        profiles: shop.profiles
      }));
    } catch (error) {
      console.error('Error fetching related shops:', error);
      return [];
    }
  }

  async getUserOrders(userId: string, status?: string): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          buyer:profiles!orders_buyer_id_fkey(username),
          order_items(
            quantity,
            shop_items(
              price,
              clothes!shop_items_clothes_id_fkey(name)
            )
          ),
          order_shipments(
            id,
            shipping_method,
            tracking_number,
            tracking_url,
            shipping_cost,
            status,
            shipping_address
          )
        `)
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Order[];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  }

  async getSellerOrders(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          buyer:profiles!orders_buyer_id_fkey(username),
          order_items(
            quantity,
            shop_items(
              price,
              clothes!shop_items_clothes_id_fkey(name)
            )
          ),
          order_shipments(
            id,
            shipping_method,
            tracking_number,
            tracking_url,
            shipping_cost,
            status,
            shipping_address
          )
        `)
        .eq('seller_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      return [];
    }
  }

  async getOrdersByShopId(shopId: string, status?: string): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          buyer:profiles!orders_buyer_id_fkey(username),
          order_items(
            quantity,
            shop_items(
              price,
              clothes!shop_items_clothes_id_fkey(name)
            )
          ),
          order_shipments(
            id,
            shipping_method,
            tracking_number,
            tracking_url,
            shipping_cost,
            status,
            shipping_address
          )
        `)
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Order[];
    } catch (error) {
      console.error('Error fetching orders by shop ID:', error);
      return [];
    }
  }

  async getShopOrders(shopId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          buyer:profiles!orders_buyer_id_fkey(username),
          order_items(
            quantity,
            shop_items(
              price,
              clothes!shop_items_clothes_id_fkey(name)
            )
          ),
          order_shipments(
            id,
            shipping_method,
            tracking_number,
            tracking_url,
            shipping_cost,
            status,
            shipping_address
          )
        `)
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    } catch (error) {
      console.error('Error fetching shop orders:', error);
      return [];
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
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

  async updatePaymentStatus(orderId: string, paymentStatus: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: paymentStatus })
        .eq('id', orderId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating payment status:', error);
      return false;
    }
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select(`
          *,
          buyer:profiles!orders_buyer_id_fkey(username),
          order_items(
            quantity,
            shop_items(
              price,
              clothes!shop_items_clothes_id_fkey(name)
            )
          ),
          order_shipments(
            id,
            shipping_method,
            tracking_number,
            tracking_url,
            shipping_cost,
            status,
            shipping_address
          )
        `)
        .single();

      if (error) throw error;
      return data as Order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async addToCart(userId: string, shopItemId: string, quantity: number): Promise<boolean> {
    try {
      const cartItem: DbCartItem = {
        user_id: userId,
        shop_item_id: shopItemId,
        quantity
      };

      const { error } = await supabase
        .from('cart_items')
        .insert([cartItem]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return false;
    }
  }
}
