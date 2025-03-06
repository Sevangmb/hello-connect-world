
import { supabase } from '@/integrations/supabase/client';
import { 
  Shop, 
  ShopItem, 
  ShopSettings, 
  ShopReview,
  Order,
  CartItem,
  ShopStatus,
  ShopItemStatus,
  DbOrder,
  DbCartItem,
  DeliveryOption,
  PaymentMethod
} from '../domain/types';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

export class ShopRepository implements IShopRepository {
  async createShops(shops: Partial<Shop>[]): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .insert(shops.map(shop => ({
          name: shop.name || '',
          user_id: shop.user_id || '',
          description: shop.description || '',
          status: shop.status || 'pending',
          average_rating: shop.average_rating || 0,
          ...shop
        })))
        .select();

      if (error) throw error;
      return data as Shop[];
    } catch (error) {
      console.error('Error creating shops:', error);
      throw error;
    }
  }

  async updateShop(shopId: string, updates: Partial<Shop>): Promise<Shop> {
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
      console.error(`Error updating shop ${shopId}:`, error);
      throw error;
    }
  }

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

      if (error) {
        console.error('Error fetching shop by ID:', error);
        return null;
      }

      return data as Shop;
    } catch (error) {
      console.error(`Error fetching shop by ID ${id}:`, error);
      return null;
    }
  }

  async getShops(): Promise<Shop[]> {
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

      if (error) {
        console.error('Error fetching shops:', error);
        return [];
      }

      return data as Shop[];
    } catch (error) {
      console.error('Error fetching shops:', error);
      return [];
    }
  }

  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop:shop_id (
            name
          )
        `)
        .eq('shop_id', shopId);

      if (error) {
        console.error('Error fetching shop items:', error);
        return [];
      }

      return data as unknown as ShopItem[];
    } catch (error) {
      console.error(`Error fetching shop items for shop ${shopId}:`, error);
      return [];
    }
  }

  async createShopItem(shopItem: Partial<ShopItem>): Promise<ShopItem> {
    try {
      const itemToCreate = {
        name: shopItem.name || '',
        price: shopItem.price || 0,
        shop_id: shopItem.shop_id || '',
        description: shopItem.description || '',
        image_url: shopItem.image_url || '',
        stock: shopItem.stock || 0,
        status: shopItem.status || 'available',
        ...shopItem
      };

      const { data, error } = await supabase
        .from('shop_items')
        .insert(itemToCreate)
        .select()
        .single();

      if (error) throw error;
      return data as ShopItem;
    } catch (error) {
      console.error('Error creating shop item:', error);
      throw error;
    }
  }

  async updateShopItem(itemId: string, updates: Partial<ShopItem>): Promise<ShopItem> {
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
      console.error(`Error updating shop item ${itemId}:`, error);
      throw error;
    }
  }

  async deleteShopItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_items')
        .delete()
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error(`Error deleting shop item ${id}:`, error);
      return false;
    }
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop:shop_id (
            name
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching shop item by ID:', error);
        return null;
      }

      return data as unknown as ShopItem;
    } catch (error) {
      console.error(`Error fetching shop item by ID ${id}:`, error);
      return null;
    }
  }

  async getShopItemsByCategory(shopId: string, category: string): Promise<ShopItem[]> {
    try {
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
    } catch (error) {
      console.error(`Error fetching shop items by category:`, error);
      return [];
    }
  }

  async getShopItemsByClothesId(clothesId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('clothes_id', clothesId);

      if (error) {
        console.error(`Error fetching shop items by clothes_id ${clothesId}:`, error);
        return [];
      }

      return data as ShopItem[];
    } catch (error) {
      console.error(`Error fetching shop items by clothes_id:`, error);
      return [];
    }
  }

  async createShopItems(shopItems: Partial<ShopItem>[]): Promise<boolean> {
    try {
      const itemsToCreate = shopItems.map(item => ({
        name: item.name || '',
        price: item.price || 0,
        shop_id: item.shop_id || '',
        description: item.description || '',
        image_url: item.image_url || '',
        stock: item.stock || 0,
        status: item.status || 'available',
        ...item
      }));

      const { error } = await supabase
        .from('shop_items')
        .insert(itemsToCreate);

      return !error;
    } catch (error) {
      console.error('Error creating shop items:', error);
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

      if (error) {
        console.error('Error fetching shop reviews:', error);
        return [];
      }

      return data as ShopReview[];
    } catch (error) {
      console.error(`Error fetching shop reviews for shop ${shopId}:`, error);
      return [];
    }
  }

  async createShopReview(shopReview: Partial<ShopReview>): Promise<ShopReview | null> {
    try {
      const reviewToCreate = {
        shop_id: shopReview.shop_id || '',
        user_id: shopReview.user_id || '',
        rating: shopReview.rating || 0,
        comment: shopReview.comment || '',
        ...shopReview
      };

      const { data, error } = await supabase
        .from('shop_reviews')
        .insert([reviewToCreate])
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
    } catch (error) {
      console.error('Error creating shop review:', error);
      return null;
    }
  }

  async updateShopReview(reviewId: string, updates: Partial<ShopReview>): Promise<ShopReview> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .update(updates)
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;
      return data as ShopReview;
    } catch (error) {
      console.error(`Error updating shop review ${reviewId}:`, error);
      throw error;
    }
  }

  async deleteShopReview(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_reviews')
        .delete()
        .eq('id', id);

      return !error;
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

      if (error) {
        console.error('Error fetching shop settings:', error);
        return null;
      }

      return data as ShopSettings;
    } catch (error) {
      console.error(`Error fetching shop settings for shop ${shopId}:`, error);
      return null;
    }
  }

  async createShopSettings(shopSettings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    try {
      const settingsToCreate = {
        shop_id: shopSettings.shop_id || '',
        delivery_options: shopSettings.delivery_options || ['pickup'],
        payment_methods: shopSettings.payment_methods || ['card'],
        auto_accept_orders: shopSettings.auto_accept_orders || false,
        notification_preferences: shopSettings.notification_preferences || { email: true, app: true },
        ...shopSettings
      };

      const { data, error } = await supabase
        .from('shop_settings')
        .insert([settingsToCreate])
        .select()
        .single();

      if (error) throw error;
      return data as ShopSettings;
    } catch (error) {
      console.error('Error creating shop settings:', error);
      return null;
    }
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .update(settings)
        .eq('shop_id', shopId)
        .select()
        .single();

      if (error) throw error;
      return data as ShopSettings;
    } catch (error) {
      console.error(`Error updating shop settings for shop ${shopId}:`, error);
      throw error;
    }
  }

  async getFeaturedShops(limit?: number): Promise<Shop[]> {
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
        .order('average_rating', { ascending: false })
        .limit(limit || 10);

      if (error) {
        console.error('Error fetching featured shops:', error);
        return [];
      }

      return data as Shop[];
    } catch (error) {
      console.error('Error fetching featured shops:', error);
      return [];
    }
  }

  async getShopsBySearch(searchTerm: string): Promise<Shop[]> {
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
        .like('name', `%${searchTerm}%`);

      if (error) {
        console.error('Error fetching shops by search term:', error);
        return [];
      }

      return data as Shop[];
    } catch (error) {
      console.error(`Error fetching shops by search term ${searchTerm}:`, error);
      return [];
    }
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    try {
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
          shop:shop_id (
            name,
            id
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      // Transform the data to match the expected CartItem type
      const cartItems = data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        shop_id: item.shop?.id || '',
        shop_item_id: item.shop_item_id,
        quantity: item.quantity,
        created_at: item.created_at,
        updated_at: item.updated_at,
        shop_items: item.shop_items,
        shop: {
          name: item.shop?.name || '',
          id: item.shop?.id || ''
        }
      })) as CartItem[];
      
      return cartItems;
    } catch (error) {
      console.error(`Error fetching cart items for user ${userId}:`, error);
      return [];
    }
  }

  async removeFromCart(itemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      return !error;
    } catch (error) {
      console.error(`Error removing item ${itemId} from cart:`, error);
      return false;
    }
  }

  async updateCartItemQuantity(itemId: string, quantity: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      return !error;
    } catch (error) {
      console.error(`Error updating quantity for cart item ${itemId}:`, error);
      return false;
    }
  }

  async clearCart(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      return !error;
    } catch (error) {
      console.error(`Error clearing cart for user ${userId}:`, error);
      return false;
    }
  }

  async addToCart(userId: string, shopItemId: string, quantity: number = 1): Promise<CartItem> {
    try {
      // Get shop_id from shop_items table
      const { data: shopItemData, error: shopItemError } = await supabase
        .from('shop_items')
        .select('shop_id')
        .eq('id', shopItemId)
        .single();
      
      if (shopItemError) throw shopItemError;
      
      const cartItem: DbCartItem = {
        user_id: userId,
        shop_item_id: shopItemId,
        quantity: quantity
      };
      
      const { data, error } = await supabase
        .from('cart_items')
        .insert(cartItem)
        .select(`
          *,
          shop_items (
            name,
            price,
            image_url,
            id
          )
        `)
        .single();

      if (error) throw error;
      
      // Transform to CartItem
      const transformedItem: CartItem = {
        id: data.id,
        user_id: data.user_id,
        shop_id: shopItemData.shop_id,
        shop_item_id: data.shop_item_id,
        quantity: data.quantity,
        created_at: data.created_at,
        updated_at: data.updated_at,
        shop_items: data.shop_items,
        shop: {
          name: '', // Fetch this separately if needed
          id: shopItemData.shop_id
        }
      };
      
      return transformedItem;
    } catch (error) {
      console.error(`Error adding item ${shopItemId} to cart for user ${userId}:`, error);
      throw error;
    }
  }

  async getShopsByUserId(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data as Shop[];
    } catch (error) {
      console.error(`Error fetching shops for user ${userId}:`, error);
      return [];
    }
  }

  async getShopOrders(shopId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('shop_id', shopId);

      if (error) throw error;
      
      // Transform DB orders to match the Order interface
      const orders: Order[] = data.map(dbOrder => ({
        id: dbOrder.id,
        shop_id: dbOrder.shop_id || '',
        customer_id: dbOrder.buyer_id || '',
        status: dbOrder.status as any,
        total_amount: dbOrder.total_amount || 0,
        delivery_fee: dbOrder.delivery_fee || 0,
        payment_status: dbOrder.payment_status as any,
        payment_method: dbOrder.payment_method || '',
        delivery_address: dbOrder.delivery_address || {},
        created_at: dbOrder.created_at,
        updated_at: dbOrder.updated_at,
        items: [],
        buyer_id: dbOrder.buyer_id,
        seller_id: dbOrder.seller_id
      }));
      
      return orders;
    } catch (error) {
      console.error(`Error fetching orders for shop ${shopId}:`, error);
      return [];
    }
  }

  // Implementation of required methods from interface
  async getShopByUserId(userId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) return null;
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
        .select('*')
        .eq('user_id', userId);

      if (error) return [];
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
        .select('*');

      if (error) return [];
      return data as Shop[];
    } catch (error) {
      console.error('Error fetching all shops:', error);
      return [];
    }
  }

  async deleteShop(shopId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shops')
        .delete()
        .eq('id', shopId);

      return !error;
    } catch (error) {
      console.error(`Error deleting shop ${shopId}:`, error);
      return false;
    }
  }

  async getShopsByStatus(status: ShopStatus): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('status', status);

      if (error) {
        console.error(`Error fetching shops with status ${status}:`, error);
        return [];
      }

      return data as Shop[];
    } catch (error) {
      console.error(`Error fetching shops with status ${status}:`, error);
      return [];
    }
  }

  async updateShopStatus(shopId: string, status: ShopStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shops')
        .update({ status })
        .eq('id', shopId);

      return !error;
    } catch (error) {
      console.error(`Error updating status for shop ${shopId}:`, error);
      return false;
    }
  }

  async getShopItemsByShopId(shopId: string): Promise<ShopItem[]> {
    return this.getShopItems(shopId);
  }

  async getAllShopItems(): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*');

      if (error) {
        console.error('Error fetching all shop items:', error);
        return [];
      }

      return data as ShopItem[];
    } catch (error) {
      console.error('Error fetching all shop items:', error);
      return [];
    }
  }

  async updateShopItemStatus(itemId: string, status: ShopItemStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_items')
        .update({ status })
        .eq('id', itemId);

      return !error;
    } catch (error) {
      console.error(`Error updating status for shop item ${itemId}:`, error);
      return false;
    }
  }

  async addShopItems(items: Partial<ShopItem>[]): Promise<ShopItem[]> {
    try {
      const preparedItems = items.map(item => ({
        name: item.name || '',
        price: item.price || 0,
        shop_id: item.shop_id || '',
        description: item.description || '',
        image_url: item.image_url || '',
        stock: item.stock || 0,
        status: item.status || 'available',
        ...item
      }));

      const { data, error } = await supabase
        .from('shop_items')
        .insert(preparedItems)
        .select();

      if (error) {
        console.error('Error adding shop items:', error);
        throw error;
      }

      return data as ShopItem[];
    } catch (error) {
      console.error('Error adding shop items:', error);
      throw error;
    }
  }

  async searchShopItems(query: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .like('name', `%${query}%`);

      if (error) {
        console.error(`Error searching shop items with query ${query}:`, error);
        return [];
      }

      return data as ShopItem[];
    } catch (error) {
      console.error(`Error searching shop items with query ${query}:`, error);
      return [];
    }
  }

  async getShopItemsByStatus(shopId: string, status: ShopItemStatus): Promise<ShopItem[]> {
    try {
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
    } catch (error) {
      console.error(`Error fetching shop items with status ${status} for shop ${shopId}:`, error);
      return [];
    }
  }

  async getShopReviewsByShopId(shopId: string): Promise<ShopReview[]> {
    return this.getShopReviews(shopId);
  }

  async addShopReview(review: Partial<ShopReview>): Promise<ShopReview | null> {
    return this.createShopReview(review);
  }

  async getShopReviewsByUserId(userId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error(`Error fetching shop reviews for user ${userId}:`, error);
        return [];
      }

      return data as ShopReview[];
    } catch (error) {
      console.error(`Error fetching shop reviews for user ${userId}:`, error);
      return [];
    }
  }

  async toggleShopFavorite(shopId: string, userId: string): Promise<boolean> {
    try {
      // Check if shop is already favorited
      const { data: existingFavorite, error: checkError } = await supabase
        .from('user_favorite_shops')
        .select('*')
        .eq('user_id', userId)
        .eq('shop_id', shopId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingFavorite) {
        // If already favorited, remove it
        const { error: deleteError } = await supabase
          .from('user_favorite_shops')
          .delete()
          .eq('user_id', userId)
          .eq('shop_id', shopId);

        if (deleteError) throw deleteError;
        return false; // Indicates it's no longer favorited
      } else {
        // If not favorited, add it
        const { error: insertError } = await supabase
          .from('user_favorite_shops')
          .insert({ user_id: userId, shop_id: shopId });

        if (insertError) throw insertError;
        return true; // Indicates it's now favorited
      }
    } catch (error) {
      console.error(`Error toggling favorite status for shop ${shopId}:`, error);
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

      if (error && error.code !== 'PGRST116') {
        console.error(`Error checking favorite status for shop ${shopId}:`, error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error(`Error checking favorite status for shop ${shopId}:`, error);
      return false;
    }
  }

  async getUserFavoriteShops(userId: string): Promise<Shop[]> {
    return this.getFavoriteShops(userId);
  }

  async getFavoriteShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select(`
          shop_id,
          shops:shop_id (*)
        `)
        .eq('user_id', userId);

      if (error) {
        console.error(`Error fetching favorite shops for user ${userId}:`, error);
        return [];
      }

      // Extract the shop data from the nested structure
      const shops = data.map(item => item.shops) as Shop[];
      return shops;
    } catch (error) {
      console.error(`Error fetching favorite shops for user ${userId}:`, error);
      return [];
    }
  }

  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_favorite_shops')
        .insert({ user_id: userId, shop_id: shopId });

      return !error;
    } catch (error) {
      console.error(`Error adding shop ${shopId} to favorites:`, error);
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

      return !error;
    } catch (error) {
      console.error(`Error removing shop ${shopId} from favorites:`, error);
      return false;
    }
  }

  async getRelatedShops(shopId: string, limit?: number): Promise<Shop[]> {
    try {
      // First, get the current shop's categories
      const { data: currentShop, error: shopError } = await supabase
        .from('shops')
        .select('categories')
        .eq('id', shopId)
        .single();

      if (shopError || !currentShop.categories || !currentShop.categories.length) {
        // If no categories or error, just return popular shops
        return this.getFeaturedShops(limit);
      }

      // Find shops with similar categories, excluding the current shop
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .neq('id', shopId)
        .filter('categories', 'cs', `{${currentShop.categories.join(',')}}`)
        .limit(limit || 5);

      if (error || !data.length) {
        console.error(`Error fetching related shops for shop ${shopId}:`, error);
        // Fallback to featured shops if no related shops found
        return this.getFeaturedShops(limit);
      }

      return data as Shop[];
    } catch (error) {
      console.error(`Error fetching related shops for shop ${shopId}:`, error);
      return this.getFeaturedShops(limit);
    }
  }

  async getUserOrders(userId: string, status?: string): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .eq('customer_id', userId);
        
      if (status) {
        query = query.eq('status', status);
      }
        
      const { data, error } = await query;

      if (error) {
        console.error(`Error fetching orders for user ${userId}:`, error);
        return [];
      }

      // Transform DB orders to match the Order interface
      const orders: Order[] = data.map(dbOrder => ({
        id: dbOrder.id,
        shop_id: dbOrder.shop_id || '',
        customer_id: dbOrder.buyer_id || '',
        status: dbOrder.status as any,
        total_amount: dbOrder.total_amount || 0,
        delivery_fee: dbOrder.delivery_fee || 0,
        payment_status: dbOrder.payment_status as any,
        payment_method: dbOrder.payment_method || '',
        delivery_address: dbOrder.delivery_address || {},
        created_at: dbOrder.created_at,
        updated_at: dbOrder.updated_at,
        items: [],
        buyer_id: dbOrder.buyer_id,
        seller_id: dbOrder.seller_id
      }));
      
      return orders;
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

      if (error) {
        console.error(`Error fetching seller orders for user ${userId}:`, error);
        return [];
      }

      // Transform DB orders to match the Order interface
      const orders: Order[] = data.map(dbOrder => ({
        id: dbOrder.id,
        shop_id: dbOrder.shop_id || '',
        customer_id: dbOrder.buyer_id || '',
        status: dbOrder.status as any,
        total_amount: dbOrder.total_amount || 0,
        delivery_fee: dbOrder.delivery_fee || 0,
        payment_status: dbOrder.payment_status as any,
        payment_method: dbOrder.payment_method || '',
        delivery_address: dbOrder.delivery_address || {},
        created_at: dbOrder.created_at,
        updated_at: dbOrder.updated_at,
        items: [],
        buyer_id: dbOrder.buyer_id,
        seller_id: dbOrder.seller_id
      }));
      
      return orders;
    } catch (error) {
      console.error(`Error fetching seller orders for user ${userId}:`, error);
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

      if (error) {
        console.error(`Error fetching orders for shop ${shopId}:`, error);
        return [];
      }

      // Transform DB orders to match the Order interface
      const orders: Order[] = data.map(dbOrder => ({
        id: dbOrder.id,
        shop_id: dbOrder.shop_id || '',
        customer_id: dbOrder.buyer_id || '',
        status: dbOrder.status as any,
        total_amount: dbOrder.total_amount || 0,
        delivery_fee: dbOrder.delivery_fee || 0,
        payment_status: dbOrder.payment_status as any,
        payment_method: dbOrder.payment_method || '',
        delivery_address: dbOrder.delivery_address || {},
        created_at: dbOrder.created_at,
        updated_at: dbOrder.updated_at,
        items: [],
        buyer_id: dbOrder.buyer_id,
        seller_id: dbOrder.seller_id
      }));
      
      return orders;
    } catch (error) {
      console.error(`Error fetching orders for shop ${shopId}:`, error);
      return [];
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      return !error;
    } catch (error) {
      console.error(`Error updating status for order ${orderId}:`, error);
      return false;
    }
  }

  async updatePaymentStatus(orderId: string, paymentStatus: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: paymentStatus })
        .eq('id', orderId);

      return !error;
    } catch (error) {
      console.error(`Error updating payment status for order ${orderId}:`, error);
      return false;
    }
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      // Transform Order to DbOrder format
      const dbOrder: Partial<DbOrder> = {
        shop_id: orderData.shop_id,
        customer_id: orderData.customer_id,
        buyer_id: orderData.customer_id,
        seller_id: '', // This would need to be fetched from the shop
        status: orderData.status,
        total_amount: orderData.total_amount,
        delivery_fee: orderData.delivery_fee,
        payment_status: orderData.payment_status,
        payment_method: orderData.payment_method,
        delivery_address: orderData.delivery_address
      };
      
      // Get seller_id from the shop
      if (orderData.shop_id) {
        const { data: shopData, error: shopError } = await supabase
          .from('shops')
          .select('user_id')
          .eq('id', orderData.shop_id)
          .single();
          
        if (!shopError && shopData) {
          dbOrder.seller_id = shopData.user_id;
        }
      }

      const { data, error } = await supabase
        .from('orders')
        .insert(dbOrder)
        .select()
        .single();

      if (error) throw error;
      
      // Transform back to Order format
      const order: Order = {
        id: data.id,
        shop_id: data.shop_id || '',
        customer_id: data.buyer_id || '',
        status: data.status as any,
        total_amount: data.total_amount || 0,
        delivery_fee: data.delivery_fee || 0,
        payment_status: data.payment_status as any,
        payment_method: data.payment_method || '',
        delivery_address: data.delivery_address || {},
        created_at: data.created_at,
        updated_at: data.updated_at,
        items: [],
        buyer_id: data.buyer_id,
        seller_id: data.seller_id
      };
      
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
}
