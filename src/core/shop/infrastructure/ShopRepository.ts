
import { supabase } from '@/integrations/supabase/client';
import { 
  Shop, 
  ShopItem, 
  ShopStatus, 
  ShopItemStatus, 
  Order, 
  OrderItem, 
  ShopReview,
  ShopSettings,
  CartItem,
  DbCartItem,
  PaymentMethod,
  DeliveryOption,
  OrderStatus,
  PaymentStatus,
  DbOrder
} from '../domain/types';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

export class ShopRepository implements IShopRepository {
  /**
   * Create a new shop
   */
  async createShop(shopData: Partial<Shop>): Promise<Shop> {
    try {
      // Ensure required fields are present
      if (!shopData.name || !shopData.user_id) {
        throw new Error('Shop name and user_id are required');
      }

      const { data, error } = await supabase
        .from('shops')
        .insert({
          name: shopData.name,
          description: shopData.description || '',
          user_id: shopData.user_id,
          image_url: shopData.image_url,
          address: shopData.address,
          phone: shopData.phone,
          website: shopData.website,
          status: shopData.status || 'pending',
          categories: shopData.categories || [],
          average_rating: 0,
          latitude: shopData.latitude,
          longitude: shopData.longitude
        })
        .select('*')
        .single();

      if (error) throw error;
      
      // Create default shop settings
      await this.createShopSettings({
        shop_id: data.id,
        delivery_options: ['pickup', 'delivery', 'both'],
        payment_methods: ['card', 'paypal', 'bank_transfer', 'cash'],
        auto_accept_orders: false,
        notification_preferences: {
          email: true,
          app: true
        }
      });
      
      return data as Shop;
    } catch (error) {
      console.error('Error creating shop:', error);
      throw error;
    }
  }

  /**
   * Update an existing shop
   */
  async updateShop(shopId: string, updates: Partial<Shop>): Promise<Shop> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', shopId)
        .select('*')
        .single();

      if (error) throw error;
      return data as Shop;
    } catch (error) {
      console.error(`Error updating shop ${shopId}:`, error);
      throw error;
    }
  }

  /**
   * Get a shop by its ID
   */
  async getShopById(id: string): Promise<Shop> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Shop;
    } catch (error) {
      console.error(`Error fetching shop by id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get a shop by user ID
   */
  async getShopByUserId(userId: string): Promise<Shop> {
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
      throw error;
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
      throw error;
    }
  }

  /**
   * Get shops by user ID
   */
  async getShopsByUserId(userId: string): Promise<Shop[]> {
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
      throw error;
    }
  }

  /**
   * Delete a shop by ID
   */
  async deleteShop(id: string): Promise<boolean> {
    try {
      // Delete shop settings first due to foreign key constraints
      await supabase
        .from('shop_settings')
        .delete()
        .eq('shop_id', id);
        
      // Delete shop items
      await supabase
        .from('shop_items')
        .delete()
        .eq('shop_id', id);
        
      // Delete the shop
      const { error } = await supabase
        .from('shops')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting shop ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update shop status
   */
  async updateShopStatus(shopId: string, status: ShopStatus): Promise<Shop> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', shopId)
        .select('*')
        .single();

      if (error) throw error;
      return data as Shop;
    } catch (error) {
      console.error(`Error updating shop status for ${shopId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new shop item
   */
  async createShopItem(itemData: Partial<ShopItem>): Promise<ShopItem> {
    try {
      // Ensure required fields
      if (!itemData.shop_id || !itemData.name || !itemData.price) {
        throw new Error('Shop ID, name, and price are required for shop items');
      }

      const shopItem = {
        shop_id: itemData.shop_id,
        name: itemData.name,
        description: itemData.description || '',
        image_url: itemData.image_url || '',
        price: itemData.price,
        original_price: itemData.original_price,
        stock: itemData.stock || 0,
        status: itemData.status || 'available',
        clothes_id: itemData.clothes_id
      };

      const { data, error } = await supabase
        .from('shop_items')
        .insert(shopItem)
        .select('*, shop:shops(name)')
        .single();

      if (error) throw error;
      return data as unknown as ShopItem;
    } catch (error) {
      console.error('Error creating shop item:', error);
      throw error;
    }
  }

  /**
   * Get a shop item by ID
   */
  async getShopItemById(itemId: string): Promise<ShopItem> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shops(name)')
        .eq('id', itemId)
        .single();

      if (error) throw error;
      return data as unknown as ShopItem;
    } catch (error) {
      console.error(`Error fetching shop item ${itemId}:`, error);
      throw error;
    }
  }

  /**
   * Get all items for a shop
   */
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shops(name)')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as ShopItem[];
    } catch (error) {
      console.error(`Error fetching items for shop ${shopId}:`, error);
      throw error;
    }
  }

  /**
   * Get shop items by shop ID
   */
  async getShopItemsByShopId(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shops(name)')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as ShopItem[];
    } catch (error) {
      console.error(`Error fetching items for shop ${shopId}:`, error);
      throw error;
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
      return data as unknown as ShopItem[];
    } catch (error) {
      console.error('Error fetching all shop items:', error);
      throw error;
    }
  }

  /**
   * Update a shop item
   */
  async updateShopItem(itemId: string, updates: Partial<ShopItem>): Promise<ShopItem> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)
        .select('*, shop:shops(name)')
        .single();

      if (error) throw error;
      return data as unknown as ShopItem;
    } catch (error) {
      console.error(`Error updating shop item ${itemId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a shop item
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
      throw error;
    }
  }

  /**
   * Create a shop review
   */
  async createShopReview(reviewData: Partial<ShopReview>): Promise<ShopReview> {
    try {
      if (!reviewData.shop_id || !reviewData.user_id || !reviewData.rating) {
        throw new Error('Shop ID, user ID, and rating are required for reviews');
      }

      const { data, error } = await supabase
        .from('shop_reviews')
        .insert({
          shop_id: reviewData.shop_id,
          user_id: reviewData.user_id,
          rating: reviewData.rating,
          comment: reviewData.comment
        })
        .select('*, profiles(username, full_name)')
        .single();

      if (error) throw error;
      
      // Update shop average rating
      await this.updateShopAverageRating(reviewData.shop_id);
      
      return data as ShopReview;
    } catch (error) {
      console.error('Error creating shop review:', error);
      throw error;
    }
  }

  /**
   * Get reviews for a shop
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
      throw error;
    }
  }

  /**
   * Update a shop review
   */
  async updateShopReview(reviewId: string, updates: Partial<ShopReview>): Promise<ShopReview> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .select('*, profiles(username, full_name)')
        .single();

      if (error) throw error;
      
      if (updates.rating && data.shop_id) {
        await this.updateShopAverageRating(data.shop_id);
      }
      
      return data as ShopReview;
    } catch (error) {
      console.error(`Error updating shop review ${reviewId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a shop review
   */
  async deleteShopReview(reviewId: string): Promise<boolean> {
    try {
      // Get shop_id before deleting for updating rating
      const { data: review } = await supabase
        .from('shop_reviews')
        .select('shop_id')
        .eq('id', reviewId)
        .single();
        
      const { error } = await supabase
        .from('shop_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      
      if (review?.shop_id) {
        await this.updateShopAverageRating(review.shop_id);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting shop review ${reviewId}:`, error);
      throw error;
    }
  }

  /**
   * Update a shop's average rating
   */
  private async updateShopAverageRating(shopId: string): Promise<void> {
    try {
      // Get all reviews for this shop
      const { data: reviews, error } = await supabase
        .from('shop_reviews')
        .select('rating')
        .eq('shop_id', shopId);

      if (error) throw error;
      
      if (!reviews || reviews.length === 0) {
        // No reviews, set average to 0
        await supabase
          .from('shops')
          .update({ 
            average_rating: 0,
            rating_count: 0,
            updated_at: new Date().toISOString()
          })
          .eq('id', shopId);
        return;
      }
      
      // Calculate average
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      const average = sum / reviews.length;
      
      // Update shop
      await supabase
        .from('shops')
        .update({ 
          average_rating: average,
          rating_count: reviews.length,
          updated_at: new Date().toISOString()
        })
        .eq('id', shopId);
    } catch (error) {
      console.error(`Error updating average rating for shop ${shopId}:`, error);
    }
  }

  /**
   * Create shop settings
   */
  async createShopSettings(settingsData: Partial<ShopSettings>): Promise<ShopSettings> {
    try {
      if (!settingsData.shop_id) {
        throw new Error('Shop ID is required for settings');
      }

      const { data, error } = await supabase
        .from('shop_settings')
        .insert({
          shop_id: settingsData.shop_id,
          delivery_options: settingsData.delivery_options || ['pickup', 'delivery', 'both'],
          payment_methods: settingsData.payment_methods || ['card', 'paypal', 'bank_transfer', 'cash'],
          auto_accept_orders: settingsData.auto_accept_orders || false,
          notification_preferences: settingsData.notification_preferences || { email: true, app: true }
        })
        .select('*')
        .single();

      if (error) throw error;
      return data as ShopSettings;
    } catch (error) {
      console.error('Error creating shop settings:', error);
      throw error;
    }
  }

  /**
   * Get shop settings
   */
  async getShopSettings(shopId: string): Promise<ShopSettings> {
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
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq('shop_id', shopId)
        .select('*')
        .single();

      if (error) throw error;
      return data as ShopSettings;
    } catch (error) {
      console.error(`Error updating settings for shop ${shopId}:`, error);
      throw error;
    }
  }

  /**
   * Add item to user's cart
   */
  async addToCart(userId: string, shopItemId: string, quantity: number): Promise<boolean> {
    try {
      // Check if item already in cart
      const { data: existingItems } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('shop_item_id', shopItemId)
        .maybeSingle();
        
      if (existingItems) {
        // Update quantity
        const newQuantity = existingItems.quantity + quantity;
        
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
          .eq('id', existingItems.id);
          
        if (error) throw error;
      } else {
        // Add new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            shop_item_id: shopItemId,
            quantity: quantity
          });
          
        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
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
      throw error;
    }
  }

  /**
   * Get user's cart items
   */
  async getCartItems(userId: string): Promise<CartItem[]> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          shop_items (id, name, price, image_url),
          shop_id:shop_items(shop_id)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      // Transform data to match CartItem interface
      const cartItems: CartItem[] = data.map(item => {
        return {
          id: item.id,
          user_id: item.user_id,
          shop_id: item.shop_id?.shop_id || "",
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
            id: item.shop_id?.shop_id || "",
            name: ""  // We'll need to fetch shop names in a separate query
          }
        };
      });
      
      // Get shop details for each cart item
      for (const item of cartItems) {
        if (item.shop_id) {
          const { data: shopData } = await supabase
            .from('shops')
            .select('name')
            .eq('id', item.shop_id)
            .single();
            
          if (shopData) {
            item.shop.name = shopData.name;
          }
        }
      }
      
      return cartItems;
    } catch (error) {
      console.error(`Error fetching cart for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItemQuantity(cartItemId: string, quantity: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ 
          quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', cartItemId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating quantity for cart item ${cartItemId}:`, error);
      throw error;
    }
  }

  /**
   * Clear user's cart
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
      console.error(`Error clearing cart for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new order
   */
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      if (!orderData.customer_id || !orderData.shop_id || !orderData.total_amount) {
        throw new Error('Customer ID, shop ID, and total amount are required for orders');
      }

      // Prepare order data
      const orderToInsert: Partial<DbOrder> = {
        buyer_id: orderData.customer_id,
        seller_id: (await this.getShopById(orderData.shop_id)).user_id,
        status: orderData.status || 'pending',
        total_amount: orderData.total_amount,
        delivery_fee: orderData.delivery_fee || 0,
        payment_status: orderData.payment_status || 'pending',
        payment_method: orderData.payment_method || '',
        delivery_address: orderData.delivery_address ? JSON.stringify(orderData.delivery_address) : null,
        shipping_required: orderData.delivery_address ? true : false,
        transaction_type: 'p2p'
      };

      // Insert order
      const { data, error } = await supabase
        .from('orders')
        .insert(orderToInsert)
        .select('*')
        .single();

      if (error) throw error;
      
      // Insert order items if provided
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

      // Transform data to match Order interface
      const createdOrder: Order = {
        id: data.id,
        shop_id: orderData.shop_id,
        customer_id: orderData.customer_id,
        status: data.status as OrderStatus,
        total_amount: data.total_amount,
        delivery_fee: data.delivery_fee || 0,
        payment_status: data.payment_status as PaymentStatus,
        payment_method: data.payment_method,
        delivery_address: orderData.delivery_address as any,
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at,
        items: orderData.items || [],
        buyer_id: data.buyer_id,
        seller_id: data.seller_id
      };
      
      return createdOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Get an order by ID
   */
  async getOrderById(orderId: string): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      
      // Get order items
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('*, shop_items:shop_items(name, price, clothes:clothes(name))')
        .eq('order_id', orderId);
      
      // Transform DB order to Order interface
      const order: Order = {
        id: data.id,
        shop_id: data.shop_id || "",
        customer_id: data.buyer_id,
        status: data.status as OrderStatus,
        total_amount: data.total_amount,
        delivery_fee: data.delivery_fee || 0,
        payment_status: data.payment_status as PaymentStatus,
        payment_method: data.payment_method,
        delivery_address: typeof data.delivery_address === 'string' ? 
          JSON.parse(data.delivery_address) : data.delivery_address,
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at,
        items: orderItems.map(item => ({
          id: item.id,
          order_id: item.order_id,
          shop_item_id: item.shop_item_id,
          price_at_time: item.price_at_time,
          quantity: item.quantity,
          created_at: item.created_at,
          name: item.shop_items?.clothes?.name || item.shop_items?.name || ""
        })),
        buyer_id: data.buyer_id,
        seller_id: data.seller_id
      };
      
      return order;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Get orders for a customer
   */
  async getCustomerOrders(customerId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('buyer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match Order interface
      const orders: Order[] = await Promise.all(data.map(async (order) => {
        // Get order items
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('*, shop_items:shop_items(name, price, clothes:clothes(name))')
          .eq('order_id', order.id);
        
        return {
          id: order.id,
          shop_id: order.shop_id || "",
          customer_id: order.buyer_id,
          status: order.status as OrderStatus,
          total_amount: order.total_amount,
          delivery_fee: order.delivery_fee || 0,
          payment_status: order.payment_status as PaymentStatus,
          payment_method: order.payment_method,
          delivery_address: typeof order.delivery_address === 'string' ? 
            JSON.parse(order.delivery_address) : order.delivery_address,
          created_at: order.created_at,
          updated_at: order.updated_at || order.created_at,
          items: orderItems.map(item => ({
            id: item.id,
            order_id: item.order_id,
            shop_item_id: item.shop_item_id,
            price_at_time: item.price_at_time,
            quantity: item.quantity,
            created_at: item.created_at,
            name: item.shop_items?.clothes?.name || item.shop_items?.name || ""
          })),
          buyer_id: order.buyer_id,
          seller_id: order.seller_id
        };
      }));
      
      return orders;
    } catch (error) {
      console.error(`Error fetching orders for customer ${customerId}:`, error);
      throw error;
    }
  }

  /**
   * Get orders for a shop
   */
  async getShopOrders(shopId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match Order interface
      const orders: Order[] = await Promise.all(data.map(async (order) => {
        // Get order items
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('*, shop_items:shop_items(name, price, clothes:clothes(name))')
          .eq('order_id', order.id);
        
        return {
          id: order.id,
          shop_id: order.shop_id || "",
          customer_id: order.buyer_id,
          status: order.status as OrderStatus,
          total_amount: order.total_amount,
          delivery_fee: order.delivery_fee || 0,
          payment_status: order.payment_status as PaymentStatus,
          payment_method: order.payment_method,
          delivery_address: typeof order.delivery_address === 'string' ? 
            JSON.parse(order.delivery_address) : order.delivery_address,
          created_at: order.created_at,
          updated_at: order.updated_at || order.created_at,
          items: orderItems.map(item => ({
            id: item.id,
            order_id: item.order_id,
            shop_item_id: item.shop_item_id,
            price_at_time: item.price_at_time,
            quantity: item.quantity,
            created_at: item.created_at,
            name: item.shop_items?.clothes?.name || item.shop_items?.name || ""
          })),
          buyer_id: order.buyer_id,
          seller_id: order.seller_id
        };
      }));
      
      return orders;
    } catch (error) {
      console.error(`Error fetching orders for shop ${shopId}:`, error);
      throw error;
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select('*')
        .single();

      if (error) throw error;
      
      // Get order items
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('*, shop_items:shop_items(name, price, clothes:clothes(name))')
        .eq('order_id', orderId);
      
      // Transform data to match Order interface
      const updatedOrder: Order = {
        id: data.id,
        shop_id: data.shop_id || "",
        customer_id: data.buyer_id,
        status: data.status as OrderStatus,
        total_amount: data.total_amount,
        delivery_fee: data.delivery_fee || 0,
        payment_status: data.payment_status as PaymentStatus,
        payment_method: data.payment_method,
        delivery_address: typeof data.delivery_address === 'string' ? 
          JSON.parse(data.delivery_address) : data.delivery_address,
        created_at: data.created_at,
        updated_at: data.updated_at,
        items: orderItems.map(item => ({
          id: item.id,
          order_id: item.order_id,
          shop_item_id: item.shop_item_id,
          price_at_time: item.price_at_time,
          quantity: item.quantity,
          created_at: item.created_at,
          name: item.shop_items?.clothes?.name || item.shop_items?.name || ""
        })),
        buyer_id: data.buyer_id,
        seller_id: data.seller_id
      };
      
      return updatedOrder;
    } catch (error) {
      console.error(`Error updating status for order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          payment_status: paymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select('*')
        .single();

      if (error) throw error;
      
      // Get order items
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('*, shop_items:shop_items(name, price, clothes:clothes(name))')
        .eq('order_id', orderId);
      
      // Transform data to match Order interface
      const updatedOrder: Order = {
        id: data.id,
        shop_id: data.shop_id || "",
        customer_id: data.buyer_id,
        status: data.status as OrderStatus,
        total_amount: data.total_amount,
        delivery_fee: data.delivery_fee || 0,
        payment_status: data.payment_status as PaymentStatus,
        payment_method: data.payment_method,
        delivery_address: typeof data.delivery_address === 'string' ? 
          JSON.parse(data.delivery_address) : data.delivery_address,
        created_at: data.created_at,
        updated_at: data.updated_at,
        items: orderItems.map(item => ({
          id: item.id,
          order_id: item.order_id,
          shop_item_id: item.shop_item_id,
          price_at_time: item.price_at_time,
          quantity: item.quantity,
          created_at: item.created_at,
          name: item.shop_items?.clothes?.name || item.shop_items?.name || ""
        })),
        buyer_id: data.buyer_id,
        seller_id: data.seller_id
      };
      
      return updatedOrder;
    } catch (error) {
      console.error(`Error updating payment status for order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Check if a shop is favorited by user
   */
  async isShopFavorited(shopId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select('*')
        .eq('shop_id', shopId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error(`Error checking if shop ${shopId} is favorited by user ${userId}:`, error);
      return false;
    }
  }

  /**
   * Add shop to user's favorites
   */
  async addShopToFavorites(shopId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_favorite_shops')
        .insert({
          shop_id: shopId,
          user_id: userId
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error adding shop ${shopId} to favorites for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Remove shop from user's favorites
   */
  async removeShopFromFavorites(shopId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_favorite_shops')
        .delete()
        .eq('shop_id', shopId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error removing shop ${shopId} from favorites for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get user's favorite shops
   */
  async getUserFavoriteShops(userId: string): Promise<Shop[]> {
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
      console.error(`Error fetching favorite shops for user ${userId}:`, error);
      throw error;
    }
  }
}
