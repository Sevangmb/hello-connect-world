
import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { 
  Shop, 
  ShopItem, 
  ShopReview, 
  ShopSettings, 
  ShopStatus, 
  ShopItemStatus,
  Order,
  CartItem,
  DbCartItem,
  DbOrder,
  OrderItem
} from '../domain/types';

export class ShopRepository implements IShopRepository {
  /**
   * Create a new shop
   */
  async createShop(shopData: Shop): Promise<Shop> {
    try {
      // Type assertion to make TypeScript happy
      const shopToCreate = {
        ...shopData,
        name: shopData.name || '',  // Ensure required fields are present
        user_id: shopData.user_id || ''
      };

      const { data, error } = await supabase
        .from('shops')
        .insert(shopToCreate)
        .select()
        .single();

      if (error) throw error;
      return data as Shop;
    } catch (error) {
      console.error('Error creating shop:', error);
      throw error;
    }
  }

  /**
   * Update shop data
   */
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

  /**
   * Delete shop
   */
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

  /**
   * Get shop by ID
   */
  async getShopById(shopId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('id', shopId)
        .single();

      if (error) throw error;
      return data as Shop;
    } catch (error) {
      console.error(`Error fetching shop by ID ${shopId}:`, error);
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

      if (error) throw error;
      return data as Shop;
    } catch (error) {
      console.error(`Error fetching shop for user ${userId}:`, error);
      return null;
    }
  }

  /**
   * Get all shops
   */
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

  /**
   * Get shops by user ID
   */
  async getUserShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Shop[];
    } catch (error) {
      console.error(`Error fetching shops for user ${userId}:`, error);
      return [];
    }
  }

  /**
   * Create a shop item
   */
  async createShopItem(item: ShopItem): Promise<ShopItem> {
    try {
      // Ensure required fields are present
      const itemToCreate = {
        ...item,
        clothes_id: item.clothes_id || '00000000-0000-0000-0000-000000000000', // Default UUID if not provided
        shop_id: item.shop_id,
        price: item.price,
        name: item.name,
        description: item.description || '',
        image_url: item.image_url || '',
        stock: item.stock,
        status: item.status
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

  /**
   * Update shop item
   */
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

  /**
   * Delete shop item
   */
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

  /**
   * Get shop item by ID
   */
  async getShopItemById(itemId: string): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shops(name)')
        .eq('id', itemId)
        .single();

      if (error) throw error;
      return data as unknown as ShopItem;
    } catch (error) {
      console.error(`Error fetching shop item by ID ${itemId}:`, error);
      return null;
    }
  }

  /**
   * Get items by shop ID
   */
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error(`Error fetching items for shop ${shopId}:`, error);
      return [];
    }
  }

  /**
   * Bulk create shop items
   */
  async bulkCreateShopItems(items: ShopItem[]): Promise<ShopItem[]> {
    try {
      // Ensure required fields are present for all items
      const itemsToCreate = items.map(item => ({
        ...item,
        clothes_id: item.clothes_id || '00000000-0000-0000-0000-000000000000',
        shop_id: item.shop_id,
        price: item.price,
        name: item.name,
        description: item.description || '',
        image_url: item.image_url || '',
        stock: item.stock,
        status: item.status
      }));

      const { data, error } = await supabase
        .from('shop_items')
        .insert(itemsToCreate)
        .select();

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error bulk creating shop items:', error);
      throw error;
    }
  }

  /**
   * Create a shop review
   */
  async createShopReview(review: ShopReview): Promise<ShopReview> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert({
          shop_id: review.shop_id,
          user_id: review.user_id,
          rating: review.rating,
          comment: review.comment
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

  /**
   * Update shop review
   */
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

  /**
   * Delete shop review
   */
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

  /**
   * Get shop reviews by shop ID
   */
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

  /**
   * Create shop settings
   */
  async createShopSettings(settings: ShopSettings): Promise<ShopSettings> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .insert({
          shop_id: settings.shop_id,
          delivery_options: settings.delivery_options,
          payment_methods: settings.payment_methods,
          auto_accept_orders: settings.auto_accept_orders,
          notification_preferences: settings.notification_preferences
        })
        .select()
        .single();

      if (error) throw error;
      return data as ShopSettings;
    } catch (error) {
      console.error('Error creating shop settings:', error);
      throw error;
    }
  }

  /**
   * Update shop settings
   */
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
      console.error(`Error updating settings for shop ${shopId}:`, error);
      throw error;
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

      if (error) throw error;
      return data as ShopSettings;
    } catch (error) {
      console.error(`Error fetching settings for shop ${shopId}:`, error);
      return null;
    }
  }

  /**
   * Get user cart items
   */
  async getUserCartItems(userId: string): Promise<CartItem[]> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          shop_items(id, name, price, image_url),
          shop:shop_items(shop_id:shop_id)
        `)
        .eq('user_id', userId);

      if (error) throw error;

      // Map to CartItem with correct structure
      const cartItems: CartItem[] = data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        shop_id: item.shop_items.shop_id || '',
        shop_item_id: item.shop_item_id,
        quantity: item.quantity,
        created_at: item.created_at,
        updated_at: item.updated_at,
        shop_items: {
          id: item.shop_items.id,
          name: item.shop_items.name,
          price: item.shop_items.price,
          image_url: item.shop_items.image_url
        },
        shop: {
          id: '', // Will be populated later
          name: '' // Will be populated later
        }
      }));

      // Fetch shop details for each cart item
      for (const item of cartItems) {
        const { data: shopData, error: shopError } = await supabase
          .from('shops')
          .select('id, name')
          .eq('id', item.shop_id)
          .single();
        
        if (!shopError && shopData) {
          item.shop.id = shopData.id;
          item.shop.name = shopData.name;
        }
      }

      return cartItems;
    } catch (error) {
      console.error(`Error fetching cart items for user ${userId}:`, error);
      return [];
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(userId: string, shopItemId: string, quantity: number = 1): Promise<boolean> {
    try {
      // Check if the item is already in cart
      const { data: existingItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('shop_item_id', shopItemId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // Real error, not just "no rows returned"
        throw fetchError;
      }

      if (existingItem) {
        // Update quantity if already in cart
        const newQuantity = existingItem.quantity + quantity;
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
          .eq('id', existingItem.id);

        if (updateError) throw updateError;
      } else {
        // Add new item to cart
        const cartItem: DbCartItem = {
          user_id: userId,
          shop_item_id: shopItemId,
          quantity: quantity
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

  /**
   * Update cart item quantity
   */
  async updateCartItemQuantity(cartItemId: string, quantity: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('id', cartItemId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating cart item ${cartItemId}:`, error);
      return false;
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(cartItemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error removing item ${cartItemId} from cart:`, error);
      return false;
    }
  }

  /**
   * Clear user cart
   */
  async clearUserCart(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error clearing cart for user ${userId}:`, error);
      return false;
    }
  }

  /**
   * Get user orders
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`*`)
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map database records to Order objects
      const orders: Order[] = data.map(record => ({
        id: record.id,
        shop_id: record.seller_id || '', // Map DB field to our domain model
        customer_id: record.buyer_id || record.customer_id,
        status: record.status,
        total_amount: record.total_amount,
        delivery_fee: record.shipping_fee || 0, // Map DB field to our domain model
        payment_status: record.payment_status,
        payment_method: record.payment_method,
        delivery_address: record.shipping_address || {}, // Map DB field to our domain model
        created_at: record.created_at,
        updated_at: record.updated_at,
        items: []
      }));

      // Fetch order items for each order
      for (const order of orders) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);

        if (!itemsError && itemsData) {
          order.items = itemsData as OrderItem[];
        }
      }

      return orders;
    } catch (error) {
      console.error(`Error fetching orders for user ${userId}:`, error);
      return [];
    }
  }

  /**
   * Get shop orders
   */
  async getShopOrders(shopId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`*`)
        .eq('seller_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map database records to Order objects
      const orders: Order[] = data.map(record => ({
        id: record.id,
        shop_id: record.seller_id || '', // Map DB field to our domain model
        customer_id: record.buyer_id || record.customer_id,
        status: record.status,
        total_amount: record.total_amount,
        delivery_fee: record.shipping_fee || 0, // Map DB field to our domain model
        payment_status: record.payment_status,
        payment_method: record.payment_method,
        delivery_address: record.shipping_address || {}, // Map DB field to our domain model
        created_at: record.created_at,
        updated_at: record.updated_at,
        items: []
      }));

      // Fetch order items for each order
      for (const order of orders) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);

        if (!itemsError && itemsData) {
          order.items = itemsData as OrderItem[];
        }
      }

      return orders;
    } catch (error) {
      console.error(`Error fetching orders for shop ${shopId}:`, error);
      return [];
    }
  }

  /**
   * Get all orders
   */
  async getAllOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`*`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map database records to Order objects
      const orders: Order[] = data.map(record => ({
        id: record.id,
        shop_id: record.seller_id || '', // Map DB field to our domain model
        customer_id: record.buyer_id || record.customer_id,
        status: record.status,
        total_amount: record.total_amount,
        delivery_fee: record.shipping_fee || 0, // Map DB field to our domain model
        payment_status: record.payment_status,
        payment_method: record.payment_method,
        delivery_address: record.shipping_address || {}, // Map DB field to our domain model
        created_at: record.created_at,
        updated_at: record.updated_at,
        items: []
      }));

      // Fetch order items for each order
      for (const order of orders) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);

        if (!itemsError && itemsData) {
          order.items = itemsData as OrderItem[];
        }
      }

      return orders;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return [];
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`*`)
        .eq('id', orderId)
        .single();

      if (error) throw error;

      // Map database record to Order object
      const order: Order = {
        id: data.id,
        shop_id: data.seller_id || '', // Map DB field to our domain model
        customer_id: data.buyer_id || data.customer_id,
        status: data.status,
        total_amount: data.total_amount,
        delivery_fee: data.shipping_fee || 0, // Map DB field to our domain model
        payment_status: data.payment_status,
        payment_method: data.payment_method,
        delivery_address: data.shipping_address || {}, // Map DB field to our domain model
        created_at: data.created_at,
        updated_at: data.updated_at,
        items: []
      };

      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      if (!itemsError && itemsData) {
        order.items = itemsData as OrderItem[];
      }

      return order;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      return null;
    }
  }

  /**
   * Create order
   */
  async createOrder(orderData: Order): Promise<Order> {
    try {
      // Map Order to database format
      const dbOrder: Partial<DbOrder> = {
        buyer_id: orderData.customer_id,
        seller_id: orderData.shop_id,
        status: orderData.status,
        total_amount: orderData.total_amount,
        shipping_fee: orderData.delivery_fee,
        payment_status: orderData.payment_status,
        payment_method: orderData.payment_method,
        shipping_address: orderData.delivery_address
      };

      // Create order
      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert(dbOrder)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      if (orderData.items && orderData.items.length > 0) {
        const orderItems = orderData.items.map(item => ({
          order_id: orderResult.id,
          shop_item_id: item.shop_item_id,
          price_at_time: item.price_at_time,
          quantity: item.quantity
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      // Return created order
      const createdOrder: Order = {
        id: orderResult.id,
        shop_id: orderResult.seller_id || '',
        customer_id: orderResult.buyer_id,
        status: orderResult.status,
        total_amount: orderResult.total_amount,
        delivery_fee: orderResult.shipping_fee || 0,
        payment_status: orderResult.payment_status,
        payment_method: orderResult.payment_method,
        delivery_address: orderResult.shipping_address || {},
        created_at: orderResult.created_at,
        updated_at: orderResult.updated_at,
        items: orderData.items || []
      };

      return createdOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating status for order ${orderId}:`, error);
      return false;
    }
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(orderId: string, paymentStatus: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating payment status for order ${orderId}:`, error);
      return false;
    }
  }

  /**
   * Add shop to favorites
   */
  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_favorite_shops')
        .insert({ user_id: userId, shop_id: shopId });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error adding shop ${shopId} to favorites:`, error);
      return false;
    }
  }

  /**
   * Remove shop from favorites
   */
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
      console.error(`Error removing shop ${shopId} from favorites:`, error);
      return false;
    }
  }

  /**
   * Check if a shop is favorited by a user
   */
  async isShopFavorited(shopId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select('*')
        .eq('user_id', userId)
        .eq('shop_id', shopId)
        .single();

      if (error && error.code !== 'PGRST116') { // Not "no rows returned"
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error(`Error checking if shop ${shopId} is favorited:`, error);
      return false;
    }
  }

  /**
   * Get user's favorite shops
   */
  async getUserFavoriteShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select('shop_id, shops:shop_id(*, profiles(username, full_name))')
        .eq('user_id', userId);

      if (error) throw error;
      
      // Extract shop data
      const shops = data.map(item => item.shops as Shop);
      return shops;
    } catch (error) {
      console.error(`Error fetching favorite shops for user ${userId}:`, error);
      return [];
    }
  }

  /**
   * Bulk create items for existing shops
   */
  async bulkCreateItemsForExistingShops(items: ShopItem[]): Promise<ShopItem[]> {
    try {
      // Ensure required fields are present for all items
      const itemsToCreate = items.map(item => ({
        ...item,
        clothes_id: item.clothes_id || '00000000-0000-0000-0000-000000000000',
        shop_id: item.shop_id,
        price: item.price,
        name: item.name,
        description: item.description || '',
        image_url: item.image_url || '',
        stock: item.stock,
        status: item.status
      }));

      const { data, error } = await supabase
        .from('shop_items')
        .insert(itemsToCreate)
        .select();

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error bulk creating shop items:', error);
      throw error;
    }
  }

  /**
   * Get shops by status
   */
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

  /**
   * Search shops by term
   */
  async searchShops(term: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .or(`name.ilike.%${term}%, description.ilike.%${term}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Shop[];
    } catch (error) {
      console.error(`Error searching shops with term "${term}":`, error);
      return [];
    }
  }
}
