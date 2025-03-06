import { supabase } from '@/integrations/supabase/client';
import { 
  IShopRepository, 
  Shop, 
  ShopItem, 
  ShopSettings, 
  ShopReview,
  Order,
  CartItem,
  ShopStatus,
  ShopItemStatus
} from '../domain/types';

export class ShopRepository implements IShopRepository {
  async createShops(shops: Partial<Shop>[]): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .insert(shops.map(shop => ({
        name: shop.name || '',
        user_id: shop.user_id || '',
        ...shop
      })))
      .select();

    if (error) throw error;
    return data as Shop[];
  }

  async updateShop(shopId: string, updates: Partial<Shop>): Promise<Shop> {
    const { data, error } = await supabase
      .from('shops')
      .update(updates)
      .eq('id', shopId)
      .select()
      .single();

    if (error) throw error;
    return data as Shop;
  }

  async getShopById(id: string): Promise<Shop | null> {
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

    if (error) {
      console.error('Error fetching shop by ID:', error);
      return null;
    }

    return data as Shop;
  }

  async getShops(): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `);

    if (error) {
      console.error('Error fetching shops:', error);
      return [];
    }

    return data as Shop[];
  }

  async getShopItems(shopId: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select(`
        *,
        shop (
          name
        )
      `)
      .eq('shop_id', shopId);

    if (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }

    return data as ShopItem[];
  }

  async createShopItem(shopItem: Partial<ShopItem>): Promise<ShopItem> {
    const { data, error } = await supabase
      .from('shop_items')
      .insert({
        name: shopItem.name || '',
        price: shopItem.price || 0,
        shop_id: shopItem.shop_id || '',
        ...shopItem
      })
      .select()
      .single();

    if (error) throw error;
    return data as ShopItem;
  }

  async updateShopItem(itemId: string, updates: Partial<ShopItem>): Promise<ShopItem> {
    const { data, error } = await supabase
      .from('shop_items')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    return data as ShopItem;
  }

  async deleteShopItem(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('shop_items')
      .delete()
      .eq('id', id);

    return !error;
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    const { data, error } = await supabase
      .from('shop_items')
      .select(`
        *,
        shop (
          name
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching shop item by ID:', error);
      return null;
    }

    return data as ShopItem;
  }

  async getShopItemsByCategory(shopId: string, category: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .eq('shop_id', shopId)
      .like('name', `%${category}%`);

    if (error) {
      console.error(`Error fetching shop items by category ${category}:`, error);
      return [];
    }

    return data as ShopItem[];
  }

  async getShopItemsByClothesId(clothesId: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .eq('clothes_id', clothesId);

    if (error) {
      console.error(`Error fetching shop items by clothes_id ${clothesId}:`, error);
      return [];
    }

    return data as ShopItem[];
  }

  async createShopItems(shopItems: any[]): Promise<boolean> {
    const { error } = await supabase
      .from('shop_items')
      .insert(shopItems);

    return !error;
  }

  async getShopReviews(shopId: string): Promise<ShopReview[]> {
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

    if (error) {
      console.error('Error fetching shop reviews:', error);
      return [];
    }

    return data as ShopReview[];
  }

  async createShopReview(shopReview: any): Promise<ShopReview | null> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .insert([shopReview])
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `)
      .single();

    if (error) throw error;
    return data as ShopReview;
  }

  async updateShopReview(id: string, shopReview: Partial<ShopReview>): Promise<boolean> {
    const { error } = await supabase
      .from('shop_reviews')
      .update(shopReview)
      .eq('id', id);

    return !error;
  }

  async deleteShopReview(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('shop_reviews')
      .delete()
      .eq('id', id);

    return !error;
  }

  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
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
  }

  async createShopSettings(shopSettings: any): Promise<ShopSettings | null> {
    const { data, error } = await supabase
      .from('shop_settings')
      .insert([shopSettings])
      .select()
      .single();

    if (error) throw error;
    return data as ShopSettings;
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings> {
    const { data, error } = await supabase
      .from('shop_settings')
      .update(settings)
      .eq('shop_id', shopId)
      .select()
      .single();

    if (error) throw error;
    return data as ShopSettings;
  }

  async getFeaturedShops(): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `)
      .order('average_rating', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching featured shops:', error);
      return [];
    }

    return data as Shop[];
  }

  async getShopsBySearch(searchTerm: string): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `)
      .like('name', `%${searchTerm}%`);

    if (error) {
      console.error('Error fetching shops by search term:', error);
      return [];
    }

    return data as Shop[];
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        shop_items (
          name,
          price,
          image_url,
          id
        ),
        shop (
          name,
          id
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data as CartItem[];
  }

  async removeFromCart(itemId: string): Promise<boolean> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    return !error;
  }

  async updateCartItemQuantity(itemId: string, quantity: number): Promise<boolean> {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    return !error;
  }

  async clearCart(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    return !error;
  }

  async addToCart(userId: string, shopItemId: string, quantity: number = 1): Promise<boolean> {
    const { error } = await supabase
      .from('cart_items')
      .insert({
        user_id: userId,
        shop_item_id: shopItemId,
        quantity
      });

    return !error;
  }

  async getShopsByUserId(userId: string): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data as Shop[];
  }

  async getShopOrders(shopId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('shop_id', shopId);

    if (error) throw error;
    return data as Order[];
  }

  // Implement missing required methods
  async getShopByUserId(userId: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data as Shop;
  }

  async getUserShops(userId: string): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('user_id', userId);

    if (error) return [];
    return data as Shop[];
  }

  async getAllShops(): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select('*');

    if (error) return [];
    return data as Shop[];
  }

  async deleteShop(shopId: string): Promise<boolean> {
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', shopId);

    return !error;
  }

  async getShopsByStatus(status: string): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('status', status);

    if (error) {
      console.error(`Error fetching shops with status ${status}:`, error);
      return [];
    }

    return data as Shop[];
  }

  async updateShopStatus(shopId: string, status: string): Promise<boolean> {
    const { error } = await supabase
      .from('shops')
      .update({ status })
      .eq('id', shopId);

    return !error;
  }

  async getShopItemsByShopId(shopId: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .eq('shop_id', shopId);

    if (error) {
      console.error(`Error fetching shop items for shop ${shopId}:`, error);
      return [];
    }

    return data as ShopItem[];
  }

  async getAllShopItems(): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*');

    if (error) {
      console.error('Error fetching all shop items:', error);
      return [];
    }

    return data as ShopItem[];
  }

  async updateShopItemStatus(itemId: string, status: string): Promise<boolean> {
    const { error } = await supabase
      .from('shop_items')
      .update({ status })
      .eq('id', itemId);

    return !error;
  }

  async addShopItems(items: Partial<ShopItem>[]): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .insert(items)
      .select();

    if (error) {
      console.error('Error adding shop items:', error);
      throw error;
    }

    return data as ShopItem[];
  }

  async searchShopItems(query: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .like('name', `%${query}%`);

    if (error) {
      console.error(`Error searching shop items with query ${query}:`, error);
      return [];
    }

    return data as ShopItem[];
  }

  async getShopItemsByStatus(shopId: string, status: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .eq('shop_id', shopId)
      .eq('status', status);

    if (error) {
      console.error(`Error fetching shop items with status ${status} for shop ${shopId}:`, error);
      return [];
    }

    return data as ShopItem[];
  }

  async getShopReviewsByShopId(shopId: string): Promise<ShopReview[]> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .select('*')
      .eq('shop_id', shopId);

    if (error) {
      console.error(`Error fetching shop reviews for shop ${shopId}:`, error);
      return [];
    }

    return data as ShopReview[];
  }

  async addShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>>): Promise<ShopReview | null> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .insert([review])
      .select()
      .single();

    if (error) {
      console.error('Error adding shop review:', error);
      return null;
    }

    return data as ShopReview;
  }

  async getShopReviewsByUserId(userId: string): Promise<ShopReview[]> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error(`Error fetching shop reviews for user ${userId}:`, error);
      return [];
    }

    return data as ShopReview[];
  }

  async toggleShopFavorite(shopId: string, userId: string): Promise<boolean> {
    // This is a placeholder implementation. You'll need to implement the actual logic
    // for toggling shop favorites in your database.
    console.log(`Toggling shop ${shopId} favorite for user ${userId}`);
    return true;
  }

  async isShopFavorited(shopId: string, userId: string): Promise<boolean> {
    // This is a placeholder implementation. You'll need to implement the actual logic
    // for checking if a shop is favorited by a user in your database.
    console.log(`Checking if shop ${shopId} is favorited by user ${userId}`);
    return false;
  }

  async getUserFavoriteShops(userId: string): Promise<Shop[]> {
    // This is a placeholder implementation. You'll need to implement the actual logic
    // for fetching user's favorite shops from your database.
    console.log(`Fetching favorite shops for user ${userId}`);
    return [];
  }

  async getFavoriteShops(userId: string): Promise<Shop[]> {
    // This is a placeholder implementation. You'll need to implement the actual logic
    // for fetching favorite shops from your database.
    console.log(`Fetching favorite shops for user ${userId}`);
    return [];
  }

  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    // This is a placeholder implementation. You'll need to implement the actual logic
    // for adding a shop to favorites in your database.
    console.log(`Adding shop ${shopId} to favorites for user ${userId}`);
    return true;
  }

  async removeShopFromFavorites(userId: string, shopId: string): Promise<boolean> {
    // This is a placeholder implementation. You'll need to implement the actual logic
    // for removing a shop from favorites in your database.
    console.log(`Removing shop ${shopId} from favorites for user ${userId}`);
    return true;
  }

  async getFeaturedShops(limit?: number): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `)
      .order('average_rating', { ascending: false })
      .limit(limit || 10);

    if (error) {
      console.error('Error fetching featured shops:', error);
      return [];
    }

    return data as Shop[];
  }

  async getRelatedShops(shopId: string, limit?: number): Promise<Shop[]> {
    // This is a placeholder implementation. You'll need to implement the actual logic
    // for fetching related shops from your database.
    console.log(`Fetching related shops for shop ${shopId} with limit ${limit}`);
    return [];
  }

  async getUserOrders(userId: string, status?: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', userId)
      .eq('status', status || undefined);

    if (error) {
      console.error(`Error fetching orders for user ${userId} with status ${status}:`, error);
      return [];
    }

    return data as Order[];
  }

  async getSellerOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('seller_id', userId);

    if (error) {
      console.error(`Error fetching seller orders for user ${userId}:`, error);
      return [];
    }

    return data as Order[];
  }

  async getOrdersByShopId(shopId: string, status?: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('shop_id', shopId)
      .eq('status', status || undefined);

    if (error) {
      console.error(`Error fetching orders for shop ${shopId} with status ${status}:`, error);
      return [];
    }

    return data as Order[];
  }

  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    return !error;
  }

  async updatePaymentStatus(orderId: string, paymentStatus: string): Promise<boolean> {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus })
      .eq('id', orderId);

    return !error;
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }

    return data as Order;
  }
}
