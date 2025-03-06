
import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import {
  Shop,
  ShopItem,
  ShopReview,
  Order,
  CartItem,
  DbCartItem,
  ShopSettings,
  ShopItemStatus,
  PaymentMethod,
  DeliveryOption,
  OrderStatus,
  PaymentStatus,
  DbOrder
} from '../domain/types';

export class ShopRepository implements IShopRepository {
  /**
   * Get shop by ID
   */
  async getShopById(id: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id(username, full_name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Check for shop settings
      const { data: settingsData } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', id)
        .single();

      // Convert the raw data to our Shop type
      const shop: Shop = {
        ...data,
        settings: settingsData || undefined
      };

      return shop;
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
        .select(`
          *,
          profiles:user_id(username, full_name)
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No shop found, which is a valid case
          return null;
        }
        throw error;
      }

      // Check for shop settings
      const { data: settingsData } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', data.id)
        .single();

      // Convert the raw data to our Shop type
      const shop: Shop = {
        ...data,
        settings: settingsData || undefined
      };

      return shop;
    } catch (error) {
      console.error('Error fetching shop by user ID:', error);
      return null;
    }
  }

  /**
   * Create a new shop
   */
  async createShop(shopData: Partial<Shop>): Promise<Shop | null> {
    try {
      // Ensure required fields are present
      if (!shopData.name || !shopData.user_id) {
        throw new Error('Shop name and user_id are required');
      }

      // Insert the shop
      const { data, error } = await supabase
        .from('shops')
        .insert({
          name: shopData.name,
          user_id: shopData.user_id,
          description: shopData.description || '',
          status: shopData.status || 'pending',
          average_rating: 0,
          categories: shopData.categories || [],
          address: shopData.address || '',
          phone: shopData.phone || '',
          website: shopData.website || '',
          image_url: shopData.image_url,
          latitude: shopData.latitude,
          longitude: shopData.longitude,
          opening_hours: shopData.opening_hours || {}
        })
        .select()
        .single();

      if (error) throw error;

      // Return the created shop
      return data as Shop;
    } catch (error) {
      console.error('Error creating shop:', error);
      return null;
    }
  }

  /**
   * Update shop details
   */
  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop | null> {
    try {
      // Insert timestamp
      shopData.updated_at = new Date().toISOString();

      // Update the shop
      const { data, error } = await supabase
        .from('shops')
        .update(shopData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Return the updated shop
      return data as Shop;
    } catch (error) {
      console.error('Error updating shop:', error);
      return null;
    }
  }

  /**
   * Delete shop
   */
  async deleteShop(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shops')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting shop:', error);
      return false;
    }
  }

  /**
   * Get shops with filter
   */
  async getShops(filters?: any): Promise<Shop[]> {
    try {
      let query = supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id(username, full_name)
        `)
        .eq('status', 'approved');

      // Apply filters if provided
      if (filters) {
        if (filters.category) {
          query = query.contains('categories', [filters.category]);
        }
        if (filters.search) {
          query = query.ilike('name', `%${filters.search}%`);
        }
        // Add more filters as needed
      }

      const { data, error } = await query.order('name');

      if (error) throw error;

      // Convert the raw data to our Shop type
      const shops: Shop[] = data.map(shop => ({
        ...shop,
        settings: undefined // We don't load settings for listing
      }));

      return shops;
    } catch (error) {
      console.error('Error fetching shops:', error);
      return [];
    }
  }

  /**
   * Get nearby shops based on coordinates
   */
  async getNearbyShops(latitude: number, longitude: number, radiusKm: number = 10): Promise<Shop[]> {
    try {
      // For now, we'll do a simple rectangular search
      // In a real application, you might want to use PostGIS for proper geospatial queries
      const latDelta = radiusKm / 111; // Roughly 111km per degree of latitude
      const lonDelta = radiusKm / (111 * Math.cos(latitude * (Math.PI / 180))); // Adjust for longitude

      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id(username, full_name)
        `)
        .eq('status', 'approved')
        .gt('latitude', latitude - latDelta)
        .lt('latitude', latitude + latDelta)
        .gt('longitude', longitude - lonDelta)
        .lt('longitude', longitude + lonDelta);

      if (error) throw error;

      // Convert the raw data to our Shop type
      const shops: Shop[] = data.map(shop => ({
        ...shop,
        settings: undefined // We don't load settings for listing
      }));

      return shops;
    } catch (error) {
      console.error('Error fetching nearby shops:', error);
      return [];
    }
  }

  /**
   * Get user shops
   */
  async getUserShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id(username, full_name)
        `)
        .eq('user_id', userId);

      if (error) throw error;

      // Convert the raw data to our Shop type
      const shops: Shop[] = data.map(shop => ({
        ...shop,
        settings: undefined // We don't load settings for listing
      }));

      return shops;
    } catch (error) {
      console.error('Error fetching user shops:', error);
      return [];
    }
  }

  /**
   * Create a shop item
   */
  async createShopItem(itemData: Partial<ShopItem>): Promise<ShopItem | null> {
    try {
      // Ensure required fields are present
      if (!itemData.shop_id || !itemData.name || itemData.price === undefined) {
        throw new Error('Shop ID, name, and price are required');
      }

      // Insert the shop item
      const { data, error } = await supabase
        .from('shop_items')
        .insert({
          shop_id: itemData.shop_id,
          name: itemData.name,
          price: itemData.price,
          description: itemData.description || '',
          image_url: itemData.image_url || '',
          stock: itemData.stock || 1,
          status: itemData.status || 'available',
          original_price: itemData.original_price,
          clothes_id: itemData.clothes_id || null
        })
        .select()
        .single();

      if (error) throw error;

      // Return the created item
      return data as ShopItem;
    } catch (error) {
      console.error('Error creating shop item:', error);
      return null;
    }
  }

  /**
   * Create multiple shop items
   */
  async createShopItems(items: Partial<ShopItem>[]): Promise<ShopItem[]> {
    try {
      // Validate that each item has the required fields
      const validItems = items.filter(item => 
        item.shop_id && 
        item.name && 
        item.price !== undefined
      );

      if (validItems.length === 0) {
        throw new Error('No valid items to create');
      }

      // Map to ensure all required fields have appropriate defaults
      const formattedItems = validItems.map(item => ({
        shop_id: item.shop_id!,
        name: item.name!,
        price: item.price!,
        description: item.description || '',
        image_url: item.image_url || '',
        stock: item.stock || 1,
        status: item.status || 'available',
        original_price: item.original_price,
        clothes_id: item.clothes_id || null
      }));

      // Insert the shop items
      const { data, error } = await supabase
        .from('shop_items')
        .insert(formattedItems)
        .select();

      if (error) throw error;

      // Return the created items
      return data as ShopItem[];
    } catch (error) {
      console.error('Error creating multiple shop items:', error);
      return [];
    }
  }

  /**
   * Get shop items
   */
  async getShopItems(shopId: string, status?: ShopItemStatus): Promise<ShopItem[]> {
    try {
      let query = supabase
        .from('shop_items')
        .select(`
          *,
          shop:shop_id(name)
        `)
        .eq('shop_id', shopId);

      // Filter by status if provided
      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }
  }

  /**
   * Get shop item by ID
   */
  async getShopItemById(id: string): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop:shop_id(name)
        `)
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
   * Update shop item
   */
  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem | null> {
    try {
      // Insert timestamp
      itemData.updated_at = new Date().toISOString();

      // Update the shop item
      const { data, error } = await supabase
        .from('shop_items')
        .update(itemData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Return the updated item
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
   * Add shop review
   */
  async addShopReview(reviewData: Partial<ShopReview>): Promise<ShopReview | null> {
    try {
      // Ensure required fields are present
      if (!reviewData.shop_id || !reviewData.user_id || reviewData.rating === undefined) {
        throw new Error('Shop ID, user ID, and rating are required');
      }

      // Check if the user already reviewed this shop
      const { data: existingReview, error: existingError } = await supabase
        .from('shop_reviews')
        .select('id')
        .eq('shop_id', reviewData.shop_id)
        .eq('user_id', reviewData.user_id)
        .single();

      if (existingReview) {
        // User already reviewed, update instead
        const { data, error } = await supabase
          .from('shop_reviews')
          .update({
            rating: reviewData.rating,
            comment: reviewData.comment,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingReview.id)
          .select(`*, profiles:user_id(username, full_name)`)
          .single();

        if (error) throw error;
        return data as ShopReview;
      }

      // Insert new review
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert({
          shop_id: reviewData.shop_id,
          user_id: reviewData.user_id,
          rating: reviewData.rating,
          comment: reviewData.comment || null
        })
        .select(`*, profiles:user_id(username, full_name)`)
        .single();

      if (error) throw error;
      return data as ShopReview;
    } catch (error) {
      console.error('Error adding shop review:', error);
      return null;
    }
  }

  /**
   * Get shop reviews
   */
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select(`
          *,
          profiles:user_id(username, full_name)
        `)
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
   * Get user review for a shop
   */
  async getUserShopReview(shopId: string, userId: string): Promise<ShopReview | null> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select(`
          *,
          profiles:user_id(username, full_name)
        `)
        .eq('shop_id', shopId)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No review found, which is valid
          return null;
        }
        throw error;
      }

      return data as ShopReview;
    } catch (error) {
      console.error('Error fetching user review:', error);
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
          // No settings found, which might be valid
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
   * Create or update shop settings
   */
  async updateShopSettings(settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    try {
      // Check if settings exist
      const { data: existingSettings } = await supabase
        .from('shop_settings')
        .select('id')
        .eq('shop_id', settings.shop_id!)
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
          .eq('id', existingSettings.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new settings
        if (!settings.shop_id) throw new Error('Shop ID is required');

        // Ensure we have all required fields for new settings
        const newSettings = {
          shop_id: settings.shop_id,
          delivery_options: settings.delivery_options || ['pickup'],
          payment_methods: settings.payment_methods || ['card'],
          auto_accept_orders: settings.auto_accept_orders !== undefined ? settings.auto_accept_orders : false,
          notification_preferences: settings.notification_preferences || { email: true, app: true },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('shop_settings')
          .insert(newSettings)
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

  /**
   * Get user cart items
   */
  async getCartItems(userId: string): Promise<CartItem[]> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          shop_items(*),
          shop:shop_id(id, name)
        `)
        .eq('user_id', userId);

      if (error) throw error;

      // Transform data to match CartItem interface
      const cartItems: CartItem[] = data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        shop_id: item.shop_id,
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
          id: item.shop.id,
          name: item.shop.name
        }
      }));

      return cartItems;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(cartItem: DbCartItem): Promise<CartItem | null> {
    try {
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', cartItem.user_id)
        .eq('shop_item_id', cartItem.shop_item_id)
        .single();

      let result;

      if (existingItem) {
        // Update quantity
        const { data, error } = await supabase
          .from('cart_items')
          .update({
            quantity: existingItem.quantity + cartItem.quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItem.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Get shop_id from shop_items
        const { data: shopItem } = await supabase
          .from('shop_items')
          .select('shop_id')
          .eq('id', cartItem.shop_item_id)
          .single();

        if (!shopItem) throw new Error('Shop item not found');

        // Add new cart item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: cartItem.user_id,
            shop_item_id: cartItem.shop_item_id,
            shop_id: shopItem.shop_id,
            quantity: cartItem.quantity
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      // Get full cart item with shop and shop_items
      const { data: fullCartItem, error: fetchError } = await supabase
        .from('cart_items')
        .select(`
          *,
          shop_items(id, name, price, image_url),
          shop:shop_id(id, name)
        `)
        .eq('id', result.id)
        .single();

      if (fetchError) throw fetchError;

      // Transform to match CartItem interface
      return {
        id: fullCartItem.id,
        user_id: fullCartItem.user_id,
        shop_id: fullCartItem.shop_id,
        shop_item_id: fullCartItem.shop_item_id,
        quantity: fullCartItem.quantity,
        created_at: fullCartItem.created_at,
        updated_at: fullCartItem.updated_at,
        shop_items: {
          id: fullCartItem.shop_items.id,
          name: fullCartItem.shop_items.name,
          price: fullCartItem.shop_items.price,
          image_url: fullCartItem.shop_items.image_url
        },
        shop: {
          id: fullCartItem.shop.id,
          name: fullCartItem.shop.name
        }
      };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return null;
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItemQuantity(id: string, quantity: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({
          quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      return false;
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  }

  /**
   * Clear user cart
   */
  async clearCart(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  }

  /**
   * Create order from cart items
   */
  async createOrder(orderData: Partial<Order>): Promise<Order | null> {
    try {
      // Ensure required fields are present and use correct types
      if (!orderData.shop_id || !orderData.customer_id) {
        throw new Error('Shop ID and customer ID are required');
      }

      // Create the order record
      const newOrder = {
        shop_id: orderData.shop_id,
        customer_id: orderData.customer_id,
        status: orderData.status || 'pending',
        total_amount: orderData.total_amount || 0,
        delivery_fee: orderData.delivery_fee || 0,
        payment_status: orderData.payment_status || 'pending',
        payment_method: orderData.payment_method || 'card',
        delivery_address: orderData.delivery_address || null,
        buyer_id: orderData.customer_id, // Map to DB schema
        seller_id: orderData.shop_id // Map to DB schema
      };

      const { data: order, error } = await supabase
        .from('orders')
        .insert(newOrder)
        .select()
        .single();

      if (error) throw error;

      // If there are order items, create them
      if (orderData.items && orderData.items.length > 0) {
        const orderItems = orderData.items.map(item => ({
          order_id: order.id,
          shop_item_id: item.shop_item_id,
          price_at_time: item.price_at_time,
          quantity: item.quantity || 1
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      // Get the full order with items
      const { data: fullOrder, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('id', order.id)
        .single();

      if (fetchError) throw fetchError;

      // Convert from DB schema to domain model
      const mappedOrder: Order = {
        id: fullOrder.id,
        shop_id: fullOrder.shop_id,
        customer_id: fullOrder.customer_id,
        status: fullOrder.status as OrderStatus,
        total_amount: fullOrder.total_amount,
        delivery_fee: fullOrder.delivery_fee || 0,
        payment_status: fullOrder.payment_status as PaymentStatus,
        payment_method: fullOrder.payment_method,
        delivery_address: fullOrder.delivery_address,
        created_at: fullOrder.created_at,
        updated_at: fullOrder.updated_at || fullOrder.created_at,
        items: fullOrder.items || [],
        // Map additional fields
        buyer_id: fullOrder.buyer_id,
        seller_id: fullOrder.seller_id
      };

      return mappedOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Convert from DB schema to domain model
      const order: Order = {
        id: data.id,
        shop_id: data.shop_id,
        customer_id: data.customer_id,
        status: data.status as OrderStatus,
        total_amount: data.total_amount,
        delivery_fee: data.delivery_fee || 0,
        payment_status: data.payment_status as PaymentStatus,
        payment_method: data.payment_method,
        delivery_address: data.delivery_address,
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at,
        items: data.items || [],
        // Map additional fields
        buyer_id: data.buyer_id,
        seller_id: data.seller_id
      };

      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  }

  /**
   * Get user orders
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert from DB schema to domain model
      const orders: Order[] = data.map(order => ({
        id: order.id,
        shop_id: order.shop_id,
        customer_id: order.customer_id,
        status: order.status as OrderStatus,
        total_amount: order.total_amount,
        delivery_fee: order.delivery_fee || 0,
        payment_status: order.payment_status as PaymentStatus,
        payment_method: order.payment_method,
        delivery_address: order.delivery_address,
        created_at: order.created_at,
        updated_at: order.updated_at || order.created_at,
        items: order.items || [],
        // Map additional fields
        buyer_id: order.buyer_id,
        seller_id: order.seller_id
      }));

      return orders;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  }

  /**
   * Get orders by shop ID
   */
  async getOrdersByShopId(shopId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert from DB schema to domain model
      const orders: Order[] = data.map(order => ({
        id: order.id,
        shop_id: order.shop_id,
        customer_id: order.customer_id,
        status: order.status as OrderStatus,
        total_amount: order.total_amount,
        delivery_fee: order.delivery_fee || 0,
        payment_status: order.payment_status as PaymentStatus,
        payment_method: order.payment_method,
        delivery_address: order.delivery_address,
        created_at: order.created_at,
        updated_at: order.updated_at || order.created_at,
        items: order.items || [],
        // Map additional fields
        buyer_id: order.buyer_id,
        seller_id: order.seller_id
      }));

      return orders;
    } catch (error) {
      console.error('Error fetching shop orders:', error);
      return [];
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  /**
   * Update order payment status
   */
  async updateOrderPaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: paymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating order payment status:', error);
      return false;
    }
  }

  /**
   * Get orders with filter
   */
  async getFilteredOrders(filters: any): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `);

      // Apply filters
      if (filters.userId) {
        query = query.eq('customer_id', filters.userId);
      }
      if (filters.shopId) {
        query = query.eq('shop_id', filters.shopId);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.paymentStatus) {
        query = query.eq('payment_status', filters.paymentStatus);
      }
      if (filters.fromDate) {
        query = query.gte('created_at', filters.fromDate);
      }
      if (filters.toDate) {
        query = query.lte('created_at', filters.toDate);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Convert from DB schema to domain model
      const orders: Order[] = data.map(order => ({
        id: order.id,
        shop_id: order.shop_id,
        customer_id: order.customer_id,
        status: order.status as OrderStatus,
        total_amount: order.total_amount,
        delivery_fee: order.delivery_fee || 0,
        payment_status: order.payment_status as PaymentStatus,
        payment_method: order.payment_method,
        delivery_address: order.delivery_address,
        created_at: order.created_at,
        updated_at: order.updated_at || order.created_at,
        items: order.items || [],
        // Map additional fields
        buyer_id: order.buyer_id,
        seller_id: order.seller_id
      }));

      return orders;
    } catch (error) {
      console.error('Error fetching filtered orders:', error);
      return [];
    }
  }
}
