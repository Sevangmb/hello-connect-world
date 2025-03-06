import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { 
  Shop, 
  ShopItem, 
  ShopReview, 
  ShopSettings, 
  Order, 
  OrderStatus, 
  CartItem, 
  DbOrder,
  PaymentStatus,
  ShopStatus
} from '../domain/types';

export class ShopRepository implements IShopRepository {
  // Shop CRUD operations
  async getShopById(id: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Add empty settings if not available
      return {
        ...data,
        settings: await this.getShopSettings(id) || undefined
      } as Shop;
    } catch (error) {
      console.error('Error fetching shop:', error);
      return null;
    }
  }

  async getShopsByUserId(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      // Add settings to each shop
      const shopsWithSettings = await Promise.all(
        data.map(async (shop) => ({
          ...shop,
          settings: await this.getShopSettings(shop.id) || undefined
        }))
      );

      return shopsWithSettings as Shop[];
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
          profiles:user_id (
            username,
            full_name
          )
        `)
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return {
        ...data,
        settings: await this.getShopSettings(data.id) || undefined
      } as Shop;
    } catch (error) {
      console.error('Error fetching shop by user ID:', error);
      return null;
    }
  }

  async getUserShops(userId: string): Promise<Shop[]> {
    return this.getShopsByUserId(userId);
  }

  async getAllShops(): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as Shop[];
    } catch (error) {
      console.error('Error fetching all shops:', error);
      return [];
    }
  }

  async createShop(shopData: Partial<Shop>): Promise<Shop> {
    try {
      // Ensure required fields are provided 
      const shopToCreate = {
        name: shopData.name || 'Untitled Shop', // Provide default value for required fields
        user_id: shopData.user_id,
        description: shopData.description || '',
        status: shopData.status || 'pending',
        average_rating: shopData.average_rating || 0,
        ...shopData
      };

      const { data, error } = await supabase
        .from('shops')
        .insert(shopToCreate)
        .select('*, profiles(username, full_name)')
        .single();

      if (error) throw error;

      // Create default shop settings when shop is created
      await this.createShopSettings({ 
        shop_id: data.id 
      });

      // Add settings property to shop object
      const settings = await this.getShopSettings(data.id);
      const shopWithSettings = {
        ...data,
        settings: settings,
      };

      return shopWithSettings as Shop;
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
        .select(`
          *,
          profiles:user_id (
            username,
            full_name
          )
        `)
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

  // Shop item operations
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('shop_id', shopId);

      if (error) throw error;

      return data as ShopItem[];
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
        .select(`
          *,
          shop:shop_id (
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
          shop:shop_id (
            name
          )
        `)
        .eq('id', itemId)
        .single();

      if (error) throw error;

      return data as ShopItem;
    } catch (error) {
      console.error('Error fetching shop item:', error);
      return null;
    }
  }

  async createShopItem(itemData: Partial<ShopItem>): Promise<ShopItem> {
    try {
      // Ensure required fields are present
      const requiredItemData = {
        shop_id: itemData.shop_id || '',
        clothes_id: itemData.clothes_id || '',
        name: itemData.name || 'Untitled Item',
        price: itemData.price || 0,
        stock: itemData.stock || 0,
        status: itemData.status || 'available',
        ...itemData
      };

      const { data, error } = await supabase
        .from('shop_items')
        .insert(requiredItemData)
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
      // Ensure each item has the required fields
      const validItems = items.map(item => ({
        shop_id: item.shop_id || '',
        clothes_id: item.clothes_id || '',
        name: item.name || 'Untitled Item',
        price: item.price || 0,
        stock: item.stock || 0,
        status: item.status || 'available',
        ...item
      }));

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
        .select('*')
        .eq('shop_id', shopId)
        .eq('category', category);

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
          shop:shop_id (
            name
          )
        `)
        .ilike('name', `%${query}%`);

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
        .select('*')
        .eq('shop_id', shopId)
        .eq('status', status);

      if (error) throw error;

      return data as ShopItem[];
    } catch (error) {
      console.error('Error fetching shop items by status:', error);
      return [];
    }
  }

  // Shop review operations
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select(`
          *,
          profiles:user_id (
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
    return this.getShopReviews(shopId);
  }

  async addShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview | null> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert(review)
        .select()
        .single();

      if (error) throw error;

      return data as ShopReview;
    } catch (error) {
      console.error('Error adding shop review:', error);
      return null;
    }
  }

  async createShopReview(reviewData: Partial<ShopReview>): Promise<ShopReview> {
    try {
      // Ensure required fields are present
      const requiredReviewData = {
        shop_id: reviewData.shop_id || '',
        user_id: reviewData.user_id || '',
        rating: reviewData.rating || 5, // Default to 5 stars
        ...reviewData
      };

      const { data, error } = await supabase
        .from('shop_reviews')
        .insert(requiredReviewData)
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
        .update(updates)
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
        .select(`
          *,
          shop:shop_id (
            name
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      return data as ShopReview[];
    } catch (error) {
      console.error('Error fetching user shop reviews:', error);
      return [];
    }
  }

  // Shop settings operations
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No settings found, return null
          return null;
        }
        throw error;
      }

      return data as ShopSettings;
    } catch (error) {
      console.error('Error fetching shop settings:', error);
      return null;
    }
  }

  async updateShopSettings(shopId: string, settingsData: Partial<ShopSettings>): Promise<ShopSettings> {
    try {
      // Ensure required fields are present
      const updatedSettings = {
        shop_id: shopId, // Always use the provided shopId
        ...settingsData
      };

      const { data, error } = await supabase
        .from('shop_settings')
        .update(updatedSettings)
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

  async createShopSettings(settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .insert(settings)
        .select()
        .single();

      if (error) throw error;

      return data as ShopSettings;
    } catch (error) {
      console.error('Error creating shop settings:', error);
      return null;
    }
  }

  // Shop favorites
  async toggleShopFavorite(shopId: string, userId: string): Promise<boolean> {
    try {
      // Check if already favorited
      const isFavorited = await this.isShopFavorited(shopId, userId);

      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorite_shops')
          .delete()
          .eq('user_id', userId)
          .eq('shop_id', shopId);

        if (error) throw error;
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorite_shops')
          .insert({
            user_id: userId,
            shop_id: shopId
          });

        if (error) throw error;
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

      if (error) {
        if (error.code === 'PGRST116') {
          // No row found
          return false;
        }
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking if shop is favorited:', error);
      return false;
    }
  }

  async getUserFavoriteShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select(`
          shop:shop_id (
            *,
            profiles:user_id (
              username,
              full_name
            )
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      // Extract shop data from the nested structure
      const shops = data.map(item => item.shop);

      return shops as Shop[];
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
          shop_id: shopId
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

  // Featured and related shops
  async getFeaturedShops(limit: number = 10): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name
          )
        `)
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

  async getRelatedShops(shopId: string, limit: number = 5): Promise<Shop[]> {
    try {
      // Get the categories of the shop
      const shop = await this.getShopById(shopId);
      if (!shop || !shop.categories || shop.categories.length === 0) {
        return [];
      }

      // Get shops with similar categories
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name
          )
        `)
        .eq('status', 'approved')
        .neq('id', shopId) // Exclude the current shop
        .limit(limit);

      if (error) throw error;

      // Filter shops that have at least one category in common
      const relatedShops = data.filter(relatedShop => {
        if (!relatedShop.categories) return false;
        return shop.categories!.some(category => 
          relatedShop.categories.includes(category)
        );
      });

      return relatedShops as Shop[];
    } catch (error) {
      console.error('Error fetching related shops:', error);
      return [];
    }
  }

  // Cart operations
  async getCartItems(userId: string): Promise<CartItem[]> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id, 
          user_id, 
          quantity, 
          created_at, 
          updated_at,
          shop_item_id,
          shop_items (
            id,
            name, 
            price, 
            image_url
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      // Manually add shop information to fix the type issue
      const cartItems = await Promise.all(data.map(async (item) => {
        // Get shop information for this item
        const { data: shopItemData } = await supabase
          .from('shop_items')
          .select('shop_id')
          .eq('id', item.shop_item_id)
          .single();
        
        if (!shopItemData) return item;
        
        const { data: shopData } = await supabase
          .from('shops')
          .select('id, name')
          .eq('id', shopItemData.shop_id)
          .single();
        
        return {
          ...item,
          shop_id: shopData?.id || '',
          shop: {
            id: shopData?.id || '',
            name: shopData?.name || ''
          }
        };
      }));
      
      return cartItems as CartItem[];
    } catch (error) {
      console.error(`Error fetching cart items for user ${userId}:`, error);
      return [];
    }
  }

  async addToCart(userId: string, shopItemId: string, quantity: number): Promise<boolean> {
    try {
      // Get shop item details
      const { data: itemData, error: itemError } = await supabase
        .from('shop_items')
        .select('shop_id')
        .eq('id', shopItemId)
        .single();

      if (itemError) throw itemError;

      // Check if item already in cart
      const { data: cartData, error: cartError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('shop_item_id', shopItemId)
        .single();

      if (cartError && cartError.code !== 'PGRST116') throw cartError;

      if (cartData) {
        // Update quantity
        const newQuantity = cartData.quantity + quantity;
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('id', cartData.id);

        if (updateError) throw updateError;
      } else {
        // Add new item to cart
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            shop_item_id: shopItemId,
            shop_id: itemData.shop_id,
            quantity
          });

        if (insertError) throw insertError;
      }

      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  }

  async removeFromCart(cartItemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  }

  async updateCartItemQuantity(cartItemId: string, quantity: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      return false;
    }
  }

  async clearUserCart(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error clearing user cart:', error);
      return false;
    }
  }

  // Order operations
  async getUserOrders(userId: string, status?: string): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .eq('customer_id', userId);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(order => ({
        id: order.id,
        shop_id: order.seller_id, // Map seller_id to shop_id
        customer_id: order.buyer_id, // Map buyer_id to customer_id
        status: order.status as OrderStatus,
        total_amount: order.total_amount,
        delivery_fee: order.shipping_cost || 0, // Map shipping_cost to delivery_fee
        payment_status: order.payment_status as PaymentStatus,
        payment_method: order.payment_method,
        delivery_address: this.formatDeliveryAddress(order),
        created_at: order.created_at,
        updated_at: order.created_at, // Use created_at as updated_at if not available
        items: [] // Order items will be loaded separately if needed
      })) as Order[];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  }

  private formatDeliveryAddress(order: any): any {
    return {
      street: order.shipping_address || '',
      city: order.shipping_city || '',
      postal_code: order.shipping_postal_code || '',
      country: order.shipping_country || ''
    };
  }

  async getSellerOrders(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(order => ({
        id: order.id,
        shop_id: order.seller_id, // Map seller_id to shop_id
        customer_id: order.buyer_id, // Map buyer_id to customer_id
        status: order.status as OrderStatus,
        total_amount: order.total_amount,
        delivery_fee: order.shipping_cost || 0, // Map shipping_cost to delivery_fee
        payment_status: order.payment_status as PaymentStatus,
        payment_method: order.payment_method,
        delivery_address: this.formatDeliveryAddress(order),
        created_at: order.created_at,
        updated_at: order.created_at, // Use created_at as updated_at if not available
        items: [] // Order items will be loaded separately if needed
      })) as Order[];
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
        .eq('seller_id', shopId); // Use seller_id instead of shop_id

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(order => ({
        id: order.id,
        shop_id: order.seller_id, // Map seller_id to shop_id
        customer_id: order.buyer_id, // Map buyer_id to customer_id
        status: order.status as OrderStatus,
        total_amount: order.total_amount,
        delivery_fee: order.shipping_cost || 0, // Map shipping_cost to delivery_fee
        payment_status: order.payment_status as PaymentStatus,
        payment_method: order.payment_method,
        delivery_address: this.formatDeliveryAddress(order),
        created_at: order.created_at,
        updated_at: order.created_at, // Use created_at as updated_at if not available
        items: [] // Order items will be loaded separately if needed
      })) as Order[];
    } catch (error) {
      console.error('Error fetching orders by shop ID:', error);
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
      // Ensure shop_id is mapped to seller_id and customer_id to buyer_id
      const dbOrderData = {
        buyer_id: orderData.customer_id,
        seller_id: orderData.shop_id,
        status: orderData.status || 'pending',
        total_amount: orderData.total_amount || 0,
        payment_status: orderData.payment_status || 'pending',
        payment_method: orderData.payment_method || 'card',
        delivery_fee: orderData.delivery_fee || 0,
        delivery_address: orderData.delivery_address || null
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(dbOrderData)
        .select()
        .single();

      if (error) throw error;

      // Create order items if provided
      if (orderData.items && orderData.items.length > 0) {
        const orderItems = orderData.items.map(item => ({
          order_id: data.id,
          shop_item_id: item.shop_item_id,
          price_at_time: item.price_at_time,
          quantity: item.quantity
        }));

        await supabase
          .from('order_items')
          .insert(orderItems);
      }

      // Convert the db order format back to the domain Order type
      const domainOrder: Order = {
        id: data.id,
        shop_id: data.seller_id,
        customer_id: data.buyer_id,
        status: data.status as OrderStatus,
        total_amount: data.total_amount,
        delivery_fee: data.delivery_fee || 0,
        payment_status: data.payment_status,
        payment_method: data.payment_method,
        delivery_address: data.delivery_address,
        created_at: data.created_at,
        updated_at: data.updated_at,
        items: orderData.items || []
      };

      return domainOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
}
