
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopItem, ShopReview, CartItem, RawShopItem, DbOrder, Order, ShopSettings } from '../domain/types';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

export class ShopRepository implements IShopRepository {
  /**
   * Get shop by ID
   */
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

  /**
   * Get shop by user ID
   */
  async getShopByUserId(userId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, not an error
          return null;
        }
        throw error;
      }
      return data as Shop;
    } catch (error) {
      console.error('Error fetching shop by user ID:', error);
      return null;
    }
  }

  /**
   * Create a shop
   */
  async createShop(shopData: Partial<Shop>): Promise<Shop | null> {
    try {
      // Ensure required fields are present
      if (!shopData.name || !shopData.user_id) {
        throw new Error("Shop name and user_id are required");
      }

      const { data, error } = await supabase
        .from('shops')
        .insert({
          ...shopData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data as Shop;
    } catch (error) {
      console.error('Error creating shop:', error);
      return null;
    }
  }

  /**
   * Update shop information
   */
  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .update({
          ...shopData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Shop;
    } catch (error) {
      console.error('Error updating shop:', error);
      return null;
    }
  }

  /**
   * Get all shop items
   */
  async getAllShopItems(): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shops(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }
  }

  /**
   * Get shop items by shop ID
   */
  async getShopItemsByShopId(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error fetching shop items by shop ID:', error);
      return [];
    }
  }

  /**
   * Create shop item
   */
  async createShopItem(itemData: Partial<ShopItem>): Promise<ShopItem | null> {
    try {
      // Ensure required fields are present
      if (!itemData.name || !itemData.shop_id || itemData.price === undefined) {
        throw new Error("Shop item name, shop_id, and price are required");
      }

      const { data, error } = await supabase
        .from('shop_items')
        .insert({
          name: itemData.name,
          shop_id: itemData.shop_id,
          price: itemData.price,
          description: itemData.description || '',
          image_url: itemData.image_url || '',
          stock: itemData.stock || 0,
          original_price: itemData.original_price,
          status: itemData.status || 'available',
          clothes_id: itemData.clothes_id || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data as ShopItem;
    } catch (error) {
      console.error('Error creating shop item:', error);
      return null;
    }
  }

  /**
   * Update shop item
   */
  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .update({
          ...itemData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ShopItem;
    } catch (error) {
      console.error('Error updating shop item:', error);
      return null;
    }
  }

  /**
   * Delete shop item
   */
  async deleteShopItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting shop item:', error);
      return false;
    }
  }

  /**
   * Get shop item by ID
   */
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
      console.error('Error fetching shop item:', error);
      return null;
    }
  }

  /**
   * Get shop reviews by shop ID
   */
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
      console.error('Error fetching shop reviews:', error);
      return [];
    }
  }

  /**
   * Create shop review
   */
  async createShopReview(reviewData: Partial<ShopReview>): Promise<ShopReview | null> {
    try {
      // Ensure required fields are present
      if (!reviewData.shop_id || !reviewData.user_id || reviewData.rating === undefined) {
        throw new Error("Shop ID, user ID, and rating are required for reviews");
      }
      
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert({
          shop_id: reviewData.shop_id,
          user_id: reviewData.user_id,
          rating: reviewData.rating,
          comment: reviewData.comment || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data as ShopReview;
    } catch (error) {
      console.error('Error creating shop review:', error);
      return null;
    }
  }

  /**
   * Get shop settings
   */
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No settings found
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

  /**
   * Update shop settings
   */
  async updateShopSettings(shopId: string, settingsData: Partial<ShopSettings>): Promise<ShopSettings | null> {
    try {
      // Check if settings exist first
      const existingSettings = await this.getShopSettings(shopId);
      
      if (existingSettings) {
        // Update existing settings
        const { data, error } = await supabase
          .from('shop_settings')
          .update({
            ...settingsData,
            updated_at: new Date().toISOString()
          })
          .eq('shop_id', shopId)
          .select()
          .single();
          
        if (error) throw error;
        return data as ShopSettings;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('shop_settings')
          .insert({
            shop_id: shopId,
            delivery_options: settingsData.delivery_options || ['pickup'],
            payment_methods: settingsData.payment_methods || ['card'],
            auto_accept_orders: settingsData.auto_accept_orders !== undefined ? settingsData.auto_accept_orders : true,
            notification_preferences: settingsData.notification_preferences || { email: true, app: true },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
          
        if (error) throw error;
        return data as ShopSettings;
      }
    } catch (error) {
      console.error('Error updating shop settings:', error);
      return null;
    }
  }

  // Methods needed by ShopApiGateway
  async getShopsByStatus(status: ShopStatus): Promise<Shop[]> {
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

  async getShopItems(): Promise<ShopItem[]> {
    return this.getAllShopItems();
  }

  async addShopItems(items: Partial<ShopItem>[]): Promise<ShopItem[]> {
    try {
      // Ensure all items have required fields
      const validItems = items.filter(item => 
        item.name && item.shop_id && item.price !== undefined
      );

      if (validItems.length === 0) {
        throw new Error("No valid items to add");
      }

      const formattedItems = validItems.map(item => ({
        name: item.name!,
        shop_id: item.shop_id!,
        price: item.price!,
        description: item.description || '',
        image_url: item.image_url || '',
        stock: item.stock || 0,
        original_price: item.original_price,
        status: item.status || 'available',
        clothes_id: item.clothes_id || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('shop_items')
        .insert(formattedItems)
        .select();

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error adding shop items:', error);
      return [];
    }
  }

  async updateShopItemStatus(id: string, status: ShopItemStatus): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ShopItem;
    } catch (error) {
      console.error('Error updating shop item status:', error);
      return null;
    }
  }

  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return this.getShopReviewsByShopId(shopId);
  }

  async getShopOrders(shopId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('shop_orders')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Process orders to include items
      const orders = data as DbOrder[];
      const processedOrders: Order[] = [];
      
      for (const order of orders) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);
          
        if (itemsError) throw itemsError;
        
        processedOrders.push({
          ...order,
          status: order.status as OrderStatus,
          payment_status: order.payment_status as PaymentStatus,
          items: itemsData as OrderItem[]
        });
      }
      
      return processedOrders;
    } catch (error) {
      console.error('Error fetching shop orders:', error);
      return [];
    }
  }

  async createOrder(orderData: Partial<Order>): Promise<Order | null> {
    try {
      // Validate required fields
      if (!orderData.shop_id || !orderData.customer_id || !orderData.items || orderData.items.length === 0) {
        throw new Error("Shop ID, customer ID, and at least one item are required");
      }
      
      // Create the order
      const { data, error } = await supabase
        .from('shop_orders')
        .insert({
          shop_id: orderData.shop_id,
          customer_id: orderData.customer_id,
          status: orderData.status || 'pending',
          total_amount: orderData.total_amount || 0,
          delivery_fee: orderData.delivery_fee || 0,
          payment_status: orderData.payment_status || 'pending',
          payment_method: orderData.payment_method || 'card',
          delivery_address: orderData.delivery_address || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      
      const orderId = data.id;
      const items = orderData.items;
      
      // Create order items
      const orderItems = items.map(item => ({
        order_id: orderId,
        item_id: item.item_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        created_at: new Date().toISOString()
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) throw itemsError;
      
      // Get the complete order with items
      return {
        ...data,
        items
      } as Order;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_orders')
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
      console.error('Error fetching favorite shops:', error);
      return [];
    }
  }

  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select('*')
        .eq('user_id', userId)
        .eq('shop_id', shopId)
        .maybeSingle();
        
      if (error) throw error;
      
      return !!data;
    } catch (error) {
      console.error('Error checking if shop is favorited:', error);
      return false;
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

  async addToCart(userId: string, itemId: string, shopId: string, quantity: number): Promise<CartItem | null> {
    try {
      // Check if item already exists in cart
      const { data: existingItem, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('item_id', itemId)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        
        const { data, error } = await supabase
          .from('cart_items')
          .update({
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItem.id)
          .select('*, shop_items(*), shop:shops(id, name)')
          .single();
          
        if (error) throw error;
        return data as CartItem;
      } else {
        // Create new cart item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            shop_id: shopId,
            item_id: itemId,
            quantity,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('*, shop_items(*), shop:shops(id, name)')
          .single();
          
        if (error) throw error;
        return data as CartItem;
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return null;
    }
  }
}
