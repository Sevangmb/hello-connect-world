
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopItem, ShopReview, ShopSettings, Order, ShopStatus, ShopItemStatus, PaymentMethod, DeliveryOption, OrderStatus, PaymentStatus, DbOrder, DbCartItem } from '../domain/types';
import { IShopRepository } from '../domain/repository/IShopRepository';

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
      console.error('Error fetching shop:', error);
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

      if (error) throw error;
      return data as Shop;
    } catch (error) {
      console.error('Error fetching shop by user ID:', error);
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
      console.error('Error fetching user shops:', error);
      return [];
    }
  }

  async getAllShops(): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)');

      if (error) throw error;
      return data as Shop[];
    } catch (error) {
      console.error('Error fetching all shops:', error);
      return [];
    }
  }

  async createShop(shop: Partial<Shop>): Promise<Shop> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .insert(shop)
        .select()
        .single();

      if (error) throw error;
      return data as Shop;
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
      return data as Shop;
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
        .select('*, profiles(username, full_name)')
        .eq('status', status);

      if (error) throw error;
      return data as Shop[];
    } catch (error) {
      console.error(`Error fetching shops by status ${status}:`, error);
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
        .select('*, shop:shops(name, id)')
        .eq('shop_id', shopId);

      if (error) throw error;
      return data as unknown as ShopItem[];
    } catch (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }
  }

  async getShopItemsByShopId(shopId: string): Promise<ShopItem[]> {
    return this.getShopItems(shopId);
  }

  async getAllShopItems(): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shops(name, id)');

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
        .select('*, shop:shops(name, id)')
        .eq('id', itemId)
        .single();

      if (error) throw error;
      return data as unknown as ShopItem;
    } catch (error) {
      console.error('Error fetching shop item:', error);
      return null;
    }
  }

  async createShopItem(shopItem: Partial<ShopItem>): Promise<ShopItem> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert(shopItem)
        .select()
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
        .select()
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
      // Make sure all required fields are present in each item
      const validItems = items.map(item => {
        if (!item.shop_id || !item.price) {
          throw new Error('Missing required fields in shop items');
        }
        return {
          shop_id: item.shop_id,
          price: item.price,
          name: item.name || '',
          description: item.description,
          image_url: item.image_url,
          original_price: item.original_price,
          stock: item.stock || 1,
          status: item.status || 'available',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      });

      const { data, error } = await supabase
        .from('shop_items')
        .insert(validItems)
        .select();

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error adding shop items:', error);
      throw error;
    }
  }

  async getShopItemsByCategory(shopId: string, category: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shops(name, id)')
        .eq('shop_id', shopId)
        .eq('category', category);

      if (error) throw error;
      return data as unknown as ShopItem[];
    } catch (error) {
      console.error('Error fetching shop items by category:', error);
      return [];
    }
  }

  async searchShopItems(query: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shops(name, id)')
        .ilike('name', `%${query}%`);

      if (error) throw error;
      return data as unknown as ShopItem[];
    } catch (error) {
      console.error('Error searching shop items:', error);
      return [];
    }
  }

  async getShopItemsByStatus(shopId: string, status: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shops(name, id)')
        .eq('shop_id', shopId)
        .eq('status', status);

      if (error) throw error;
      return data as unknown as ShopItem[];
    } catch (error) {
      console.error('Error fetching shop items by status:', error);
      return [];
    }
  }

  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select('*, profiles(username, full_name)')
        .eq('shop_id', shopId);

      if (error) throw error;
      return data as ShopReview[];
    } catch (error) {
      console.error('Error fetching shop reviews:', error);
      return [];
    }
  }

  async getShopReviewsByShopId(shopId: string): Promise<ShopReview[]> {
    return this.getShopReviews(shopId);
  }

  async addShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview | null> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert({
          ...review,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
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
        .insert({
          ...review,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
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
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .select()
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
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data as ShopReview[];
    } catch (error) {
      console.error('Error fetching user shop reviews:', error);
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
      console.error('Error fetching shop settings:', error);
      return null;
    }
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    try {
      // Check if settings exist first
      const { data: existingSettings } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();

      let result;
      
      if (existingSettings) {
        // Update existing settings
        const { data, error } = await supabase
          .from('shop_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString()
          })
          .eq('shop_id', shopId)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('shop_settings')
          .insert({
            shop_id: shopId,
            ...settings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      return result as ShopSettings;
    } catch (error) {
      console.error('Error updating shop settings:', error);
      return null;
    }
  }

  async createShopSettings(settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .insert({
          ...settings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
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
      // Check if already favorited
      const { data: existing, error: checkError } = await supabase
        .from('user_favorite_shops')
        .select('*')
        .eq('user_id', userId)
        .eq('shop_id', shopId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existing) {
        // Remove from favorites
        const { error: deleteError } = await supabase
          .from('user_favorite_shops')
          .delete()
          .eq('user_id', userId)
          .eq('shop_id', shopId);

        if (deleteError) throw deleteError;
      } else {
        // Add to favorites
        const { error: insertError } = await supabase
          .from('user_favorite_shops')
          .insert({
            user_id: userId,
            shop_id: shopId,
            created_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      return true;
    } catch (error) {
      console.error('Error toggling shop favorite:', error);
      return false;
    }
  }

  async isShopFavorited(shopId: string, userId: string): Promise<boolean> {
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
      console.error('Error checking shop favorite status:', error);
      return false;
    }
  }

  async getUserFavoriteShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select('shop_id, shops:shop_id(*, profiles(username, full_name))')
        .eq('user_id', userId);

      if (error) throw error;
      
      const shops = data.map(item => item.shops) as Shop[];
      return shops;
    } catch (error) {
      console.error('Error fetching user favorite shops:', error);
      return [];
    }
  }

  async getFavoriteShops(userId: string): Promise<Shop[]> {
    return this.getUserFavoriteShops(userId);
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

  async getFeaturedShops(limit: number = 5): Promise<Shop[]> {
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

  async getRelatedShops(shopId: string, limit: number = 3): Promise<Shop[]> {
    try {
      // Get the categories of the specified shop
      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select('categories')
        .eq('id', shopId)
        .single();

      if (shopError) throw shopError;
      
      if (!shopData.categories || !shopData.categories.length) {
        return [];
      }

      // Find shops with similar categories
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .neq('id', shopId)
        .eq('status', 'approved')
        .order('average_rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      // Filter shops that have at least one matching category
      const relatedShops = data.filter(shop => {
        if (!shop.categories) return false;
        return shop.categories.some((category: string) => 
          shopData.categories.includes(category)
        );
      });

      return relatedShops as Shop[];
    } catch (error) {
      console.error('Error fetching related shops:', error);
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
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the database orders to the Order type
      const orders = data.map(dbOrder => this.mapDatabaseOrderToOrder(dbOrder));
      return orders;
    } catch (error) {
      console.error('Error fetching user orders:', error);
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
      
      const orders = data.map(dbOrder => this.mapDatabaseOrderToOrder(dbOrder));
      return orders;
    } catch (error) {
      console.error('Error fetching seller orders:', error);
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
      
      const { data, error } = await query;

      if (error) throw error;
      
      const orders = data.map(dbOrder => this.mapDatabaseOrderToOrder(dbOrder));
      return orders;
    } catch (error) {
      console.error('Error fetching shop orders:', error);
      return [];
    }
  }

  async getShopOrders(shopId: string): Promise<Order[]> {
    return this.getOrdersByShopId(shopId);
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
      console.error('Error updating order status:', error);
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
      console.error('Error updating payment status:', error);
      return false;
    }
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      // Map Order to database structure
      const dbOrderData = {
        buyer_id: orderData.customer_id,
        seller_id: orderData.seller_id,
        status: orderData.status,
        total_amount: orderData.total_amount,
        payment_status: orderData.payment_status,
        payment_method: orderData.payment_method,
        delivery_address: orderData.delivery_address,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(dbOrderData)
        .select()
        .single();

      if (error) throw error;
      
      return this.mapDatabaseOrderToOrder(data);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async addToCart(userId: string, shopItemId: string, quantity: number): Promise<boolean> {
    try {
      // Check if the item is already in the cart
      const { data: existingItems, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('shop_item_id', shopItemId);

      if (checkError) throw checkError;

      if (existingItems && existingItems.length > 0) {
        // Update the quantity if the item is already in the cart
        const existingItem = existingItems[0];
        const newQuantity = existingItem.quantity + quantity;

        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ 
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItem.id);

        if (updateError) throw updateError;
      } else {
        // Add a new item to the cart
        const cartItem: DbCartItem = {
          user_id: userId,
          shop_item_id: shopItemId,
          quantity,
        };

        const { error: insertError } = await supabase
          .from('cart_items')
          .insert(cartItem);

        if (insertError) throw insertError;
      }

      return true;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return false;
    }
  }

  // Helper method to map database order to Order type
  private mapDatabaseOrderToOrder(dbOrder: any): Order {
    return {
      id: dbOrder.id,
      shop_id: dbOrder.shop_id || '',
      customer_id: dbOrder.buyer_id,
      seller_id: dbOrder.seller_id,
      status: dbOrder.status as OrderStatus,
      total_amount: dbOrder.total_amount,
      delivery_fee: dbOrder.delivery_fee || 0,
      payment_status: dbOrder.payment_status as PaymentStatus,
      payment_method: dbOrder.payment_method,
      delivery_address: dbOrder.delivery_address || {
        street: '',
        city: '',
        postal_code: '',
        country: ''
      },
      created_at: dbOrder.created_at,
      updated_at: dbOrder.updated_at,
      items: []
    };
  }
}
