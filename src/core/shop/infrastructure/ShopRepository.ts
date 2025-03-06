
import { supabase } from '@/integrations/supabase/client';
import { 
  Shop, 
  ShopItem, 
  ShopReview, 
  ShopSettings, 
  Order, 
  ShopStatus, 
  ShopItemStatus, 
  PaymentMethod, 
  DeliveryOption, 
  OrderStatus, 
  PaymentStatus, 
  DbOrder, 
  CartItem, 
  DbCartItem 
} from '@/core/shop/domain/types';
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

      // Fetch shop settings if shop exists
      if (data) {
        const { data: settingsData, error: settingsError } = await supabase
          .from('shop_settings')
          .select('*')
          .eq('shop_id', id)
          .single();

        if (!settingsError && settingsData) {
          data.settings = settingsData;
        }
      }

      return data as Shop;
    } catch (error) {
      console.error(`Error fetching shop with ID ${id}:`, error);
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

      // Fetch shop settings if shop exists
      if (data) {
        const { data: settingsData, error: settingsError } = await supabase
          .from('shop_settings')
          .select('*')
          .eq('shop_id', data.id)
          .single();

        if (!settingsError && settingsData) {
          data.settings = settingsData;
        }
      }

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
   * Create shop
   */
  async createShop(shop: Partial<Shop>): Promise<Shop> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .insert({
          user_id: shop.user_id,
          name: shop.name,
          description: shop.description || '',
          address: shop.address,
          phone: shop.phone,
          website: shop.website,
          status: shop.status || 'pending',
          categories: shop.categories || [],
          average_rating: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Create default shop settings
      await supabase
        .from('shop_settings')
        .insert({
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
   * Update shop
   */
  async updateShop(shopId: string, updates: Partial<Shop>): Promise<Shop | null> {
    try {
      // Remove relations and computed fields
      const { profiles, settings, ...shopData } = updates as any;
      
      const { data, error } = await supabase
        .from('shops')
        .update({
          ...shopData,
          updated_at: new Date().toISOString()
        })
        .eq('id', shopId)
        .select()
        .single();

      if (error) throw error;
      return data as Shop;
    } catch (error) {
      console.error(`Error updating shop ${shopId}:`, error);
      return null;
    }
  }

  /**
   * Delete shop
   */
  async deleteShop(shopId: string): Promise<boolean> {
    try {
      // First delete shop settings
      await supabase
        .from('shop_settings')
        .delete()
        .eq('shop_id', shopId);

      // Then delete the shop
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
   * Get shop items
   */
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shop_id(name)')
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
   * Get shop item by ID
   */
  async getShopItemById(itemId: string): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shop_id(name)')
        .eq('id', itemId)
        .single();

      if (error) throw error;
      return data as ShopItem;
    } catch (error) {
      console.error(`Error fetching shop item ${itemId}:`, error);
      return null;
    }
  }

  /**
   * Create shop item
   */
  async createShopItem(shopItem: Partial<ShopItem>): Promise<ShopItem> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert({
          shop_id: shopItem.shop_id,
          clothes_id: shopItem.clothes_id || null, // Make clothes_id nullable
          name: shopItem.name,
          description: shopItem.description || '',
          image_url: shopItem.image_url || '',
          price: shopItem.price,
          original_price: shopItem.original_price,
          stock: shopItem.stock || 0,
          status: shopItem.status || 'available',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
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
  async updateShopItem(itemId: string, updates: Partial<ShopItem>): Promise<ShopItem | null> {
    try {
      const { shop, ...itemData } = updates as any;
      
      const { data, error } = await supabase
        .from('shop_items')
        .update({
          ...itemData,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      return data as ShopItem;
    } catch (error) {
      console.error(`Error updating shop item ${itemId}:`, error);
      return null;
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
   * Update shop status
   */
  async updateShopStatus(shopId: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shops')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', shopId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating shop status for ${shopId}:`, error);
      return false;
    }
  }

  /**
   * Get shop reviews
   */
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select('*, profiles:user_id(username, full_name)')
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
   * Add shop review
   */
  async addShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview | null> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert({
          shop_id: review.shop_id,
          user_id: review.user_id,
          rating: review.rating,
          comment: review.comment,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Update shop average rating
      await this.updateShopAverageRating(review.shop_id);

      return data as ShopReview;
    } catch (error) {
      console.error('Error adding shop review:', error);
      return null;
    }
  }

  /**
   * Update shop average rating
   */
  private async updateShopAverageRating(shopId: string): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select('rating')
        .eq('shop_id', shopId);

      if (error) throw error;

      if (data && data.length > 0) {
        const totalRating = data.reduce((sum, item) => sum + item.rating, 0);
        const averageRating = totalRating / data.length;

        await supabase
          .from('shops')
          .update({ 
            average_rating: averageRating,
            total_ratings: totalRating,
            rating_count: data.length,
            updated_at: new Date().toISOString()
          })
          .eq('id', shopId);
      }
    } catch (error) {
      console.error(`Error updating shop rating for ${shopId}:`, error);
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
   * Update shop settings
   */
  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    try {
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
      return data as ShopSettings;
    } catch (error) {
      console.error(`Error updating settings for shop ${shopId}:`, error);
      return null;
    }
  }

  /**
   * Create shop settings
   */
  async createShopSettings(settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .insert({
          shop_id: settings.shop_id,
          delivery_options: settings.delivery_options || ['pickup', 'delivery', 'both'],
          payment_methods: settings.payment_methods || ['card', 'paypal', 'bank_transfer', 'cash'],
          auto_accept_orders: settings.auto_accept_orders || false,
          notification_preferences: settings.notification_preferences || {
            email: true,
            app: true
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data as ShopSettings;
    } catch (error) {
      console.error(`Error creating settings for shop ${settings.shop_id}:`, error);
      return null;
    }
  }

  /**
   * Add to cart
   */
  async addToCart(userId: string, shopItemId: string, quantity: number): Promise<boolean> {
    try {
      // Check if item already in cart
      const { data: existingItems, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('shop_item_id', shopItemId);

      if (checkError) throw checkError;

      if (existingItems && existingItems.length > 0) {
        // Update quantity if already in cart
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItems[0].quantity + quantity,
            updated_at: new Date().toISOString() 
          })
          .eq('id', existingItems[0].id);

        if (updateError) throw updateError;
      } else {
        // Add new cart item
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            shop_item_id: shopItemId,
            quantity: quantity,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      return true;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return false;
    }
  }

  /**
   * Get cart items
   */
  async getCartItems(userId: string): Promise<CartItem[]> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          shop_items (id, name, price, image_url),
          shop:shop_items!inner(id, name)
        `)
        .eq('user_id', userId);

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        shop_id: item.shop?.id || '',
        shop_item_id: item.shop_item_id,
        quantity: item.quantity,
        created_at: item.created_at,
        updated_at: item.updated_at,
        shop_items: {
          name: item.shop_items?.name || '',
          price: item.shop_items?.price || 0,
          image_url: item.shop_items?.image_url || '',
          id: item.shop_items?.id || ''
        },
        shop: {
          name: item.shop?.name || '',
          id: item.shop?.id || ''
        }
      }));
    } catch (error) {
      console.error(`Error fetching cart items for user ${userId}:`, error);
      return [];
    }
  }

  /**
   * Remove from cart
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
      console.error(`Error removing cart item ${cartItemId}:`, error);
      return false;
    }
  }

  /**
   * Get shop orders
   */
  async getShopOrders(shopId: string): Promise<Order[]> {
    try {
      // Query orders table to get all orders for the shop
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format results to match Order type
      const orders: Order[] = [];
      
      for (const order of data) {
        // Get order items
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*, shop_items!inner(clothes(name))')
          .eq('order_id', order.id);
        
        if (itemsError) {
          console.error(`Error fetching items for order ${order.id}:`, itemsError);
          continue;
        }
        
        orders.push({
          id: order.id,
          shop_id: shopId,
          customer_id: order.buyer_id,
          status: order.status as OrderStatus,
          total_amount: order.total_amount,
          delivery_fee: order.shipping_cost || 0,
          payment_status: order.payment_status as PaymentStatus,
          payment_method: order.payment_method,
          delivery_address: {
            street: '',
            city: '',
            postal_code: '',
            country: ''
          },
          created_at: order.created_at,
          updated_at: order.updated_at || '',
          items: itemsData?.map(item => ({
            id: item.id,
            order_id: item.order_id,
            shop_item_id: item.shop_item_id,
            price_at_time: item.price_at_time,
            quantity: item.quantity,
            created_at: item.created_at,
            name: item.shop_items?.clothes?.name || ''
          })) || []
        });
      }
      
      return orders;
    } catch (error) {
      console.error(`Error fetching orders for shop ${shopId}:`, error);
      return [];
    }
  }

  /**
   * Get user orders
   */
  async getUserOrders(userId: string, status?: string): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .eq('buyer_id', userId);
        
      if (status) {
        query = query.eq('status', status);
      }
        
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Format results to match Order type
      const orders: Order[] = [];
      
      for (const order of data) {
        // Get order items
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*, shop_items!inner(clothes(name))')
          .eq('order_id', order.id);
        
        if (itemsError) {
          console.error(`Error fetching items for order ${order.id}:`, itemsError);
          continue;
        }
        
        orders.push({
          id: order.id,
          shop_id: order.seller_id,
          customer_id: userId,
          status: order.status as OrderStatus,
          total_amount: order.total_amount,
          delivery_fee: order.shipping_cost || 0,
          payment_status: order.payment_status as PaymentStatus,
          payment_method: order.payment_method,
          delivery_address: {
            street: '',
            city: '',
            postal_code: '',
            country: ''
          },
          created_at: order.created_at,
          updated_at: order.updated_at || '',
          items: itemsData?.map(item => ({
            id: item.id,
            order_id: item.order_id,
            shop_item_id: item.shop_item_id,
            price_at_time: item.price_at_time,
            quantity: item.quantity,
            created_at: item.created_at,
            name: item.shop_items?.clothes?.name || ''
          })) || []
        });
      }
      
      return orders;
    } catch (error) {
      console.error(`Error fetching orders for user ${userId}:`, error);
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
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;

      // Get order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*, shop_items!inner(clothes(name))')
        .eq('order_id', orderId);
      
      if (itemsError) {
        console.error(`Error fetching items for order ${orderId}:`, itemsError);
      }
      
      return {
        id: data.id,
        shop_id: data.seller_id,
        customer_id: data.buyer_id,
        status: data.status as OrderStatus,
        total_amount: data.total_amount,
        delivery_fee: data.shipping_cost || 0,
        payment_status: data.payment_status as PaymentStatus,
        payment_method: data.payment_method,
        delivery_address: {
          street: '',
          city: '',
          postal_code: '',
          country: ''
        },
        created_at: data.created_at,
        updated_at: data.updated_at || '',
        items: itemsData?.map(item => ({
          id: item.id,
          order_id: item.order_id,
          shop_item_id: item.shop_item_id,
          price_at_time: item.price_at_time,
          quantity: item.quantity,
          created_at: item.created_at,
          name: item.shop_items?.clothes?.name || ''
        })) || []
      };
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      return null;
    }
  }

  /**
   * Update order status
   */
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
        .update({ 
          payment_status: paymentStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating payment status for order ${orderId}:`, error);
      return false;
    }
  }

  /**
   * Create order
   */
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      // Create order record
      const orderValues: Partial<DbOrder> = {
        seller_id: orderData.shop_id,
        buyer_id: orderData.customer_id,
        status: orderData.status as string,
        total_amount: orderData.total_amount,
        shipping_cost: orderData.delivery_fee,
        payment_status: orderData.payment_status as string,
        payment_method: orderData.payment_method,
        created_at: new Date().toISOString(),
      };

      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert(orderValues)
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

      return {
        id: orderResult.id,
        shop_id: orderResult.seller_id,
        customer_id: orderResult.buyer_id,
        status: orderResult.status as OrderStatus,
        total_amount: orderResult.total_amount,
        delivery_fee: orderResult.shipping_cost || 0,
        payment_status: orderResult.payment_status as PaymentStatus,
        payment_method: orderResult.payment_method || '',
        delivery_address: {
          street: '',
          city: '',
          postal_code: '',
          country: ''
        },
        created_at: orderResult.created_at,
        updated_at: orderResult.updated_at || '',
        items: orderData.items || []
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Implementing the remaining interface methods
  
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

  async getUserShops(userId: string): Promise<Shop[]> {
    return this.getShopsByUserId(userId);
  }

  async getShopsByStatus(status: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('status', status);

      if (error) throw error;
      return data as Shop[];
    } catch (error) {
      console.error(`Error fetching shops with status ${status}:`, error);
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
        .select('*, shop:shop_id(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error fetching all shop items:', error);
      return [];
    }
  }

  async updateShopItemStatus(itemId: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_items')
        .update({ 
          status,
          updated_at: new Date().toISOString() 
        })
        .eq('id', itemId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating status for shop item ${itemId}:`, error);
      return false;
    }
  }

  async addShopItems(items: Partial<ShopItem>[]): Promise<ShopItem[]> {
    try {
      if (!items || items.length === 0) return [];
      
      const formattedItems = items.map(item => ({
        shop_id: item.shop_id,
        clothes_id: item.clothes_id || null,
        name: item.name,
        description: item.description || '',
        image_url: item.image_url || '',
        price: item.price,
        original_price: item.original_price,
        stock: item.stock || 0,
        status: item.status || 'available',
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
      console.error('Error adding multiple shop items:', error);
      return [];
    }
  }

  async getShopItemsByCategory(shopId: string, category: string): Promise<ShopItem[]> {
    try {
      // Assuming shop items have a category field or related to clothes with category
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shop_id(name), clothes:clothes_id(category)')
        .eq('shop_id', shopId)
        .eq('clothes.category', category);

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error(`Error fetching items by category for shop ${shopId}:`, error);
      return [];
    }
  }

  async searchShopItems(query: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shop_id(name)')
        .ilike('name', `%${query}%`);

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error(`Error searching shop items with query ${query}:`, error);
      return [];
    }
  }

  async getShopItemsByStatus(shopId: string, status: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shop_id(name)')
        .eq('shop_id', shopId)
        .eq('status', status);

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error(`Error fetching items by status for shop ${shopId}:`, error);
      return [];
    }
  }

  async getShopReviewsByShopId(shopId: string): Promise<ShopReview[]> {
    return this.getShopReviews(shopId);
  }

  async createShopReview(review: Partial<ShopReview>): Promise<ShopReview> {
    const result = await this.addShopReview({
      shop_id: review.shop_id!,
      user_id: review.user_id!,
      rating: review.rating!,
      comment: review.comment
    });
    
    if (!result) {
      throw new Error('Failed to create shop review');
    }
    
    return result;
  }

  async updateShopReview(reviewId: string, updates: Partial<ShopReview>): Promise<ShopReview | null> {
    try {
      const { profiles, ...reviewData } = updates as any;
      
      const { data, error } = await supabase
        .from('shop_reviews')
        .update({
          ...reviewData,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;
      
      // Update shop average rating if rating changed
      if (updates.rating) {
        await this.updateShopAverageRating(data.shop_id);
      }
      
      return data as ShopReview;
    } catch (error) {
      console.error(`Error updating shop review ${reviewId}:`, error);
      return null;
    }
  }

  async deleteShopReview(reviewId: string): Promise<boolean> {
    try {
      // Get shop_id before deleting for rating update
      const { data: review, error: getError } = await supabase
        .from('shop_reviews')
        .select('shop_id')
        .eq('id', reviewId)
        .single();
        
      if (getError) throw getError;
      
      const { error } = await supabase
        .from('shop_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      
      // Update shop average rating after deletion
      if (review) {
        await this.updateShopAverageRating(review.shop_id);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting shop review ${reviewId}:`, error);
      return false;
    }
  }

  async getShopReviewsByUserId(userId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select('*, shops:shop_id(name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ShopReview[];
    } catch (error) {
      console.error(`Error fetching reviews by user ${userId}:`, error);
      return [];
    }
  }

  async toggleShopFavorite(shopId: string, userId: string): Promise<boolean> {
    try {
      // Check if already favorited
      const { data, error: checkError } = await supabase
        .from('user_favorite_shops')
        .select('*')
        .eq('user_id', userId)
        .eq('shop_id', shopId);
        
      if (checkError) throw checkError;
      
      if (data && data.length > 0) {
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
      console.error(`Error toggling favorite for shop ${shopId}:`, error);
      return false;
    }
  }

  async isShopFavorited(shopId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select('*')
        .eq('user_id', userId)
        .eq('shop_id', shopId);
        
      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      console.error(`Error checking if shop ${shopId} is favorited:`, error);
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
        .select('shops:shop_id(*)')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      return data.map(item => item.shops) as Shop[];
    } catch (error) {
      console.error(`Error fetching favorite shops for user ${userId}:`, error);
      return [];
    }
  }

  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    try {
      // Check if already favorited
      const { data, error: checkError } = await supabase
        .from('user_favorite_shops')
        .select('*')
        .eq('user_id', userId)
        .eq('shop_id', shopId);
        
      if (checkError) throw checkError;
      
      if (data && data.length > 0) {
        // Already favorited
        return true;
      }
      
      // Add to favorites
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
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error removing shop ${shopId} from favorites:`, error);
      return false;
    }
  }

  async getFeaturedShops(limit?: number): Promise<Shop[]> {
    try {
      let query = supabase
        .from('shops')
        .select('*')
        .eq('status', 'approved')
        .order('average_rating', { ascending: false });
        
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Shop[];
    } catch (error) {
      console.error('Error fetching featured shops:', error);
      return [];
    }
  }

  async getRelatedShops(shopId: string, limit?: number): Promise<Shop[]> {
    try {
      // First get the categories of the shop
      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select('categories')
        .eq('id', shopId)
        .single();
        
      if (shopError) throw shopError;
      
      if (!shopData?.categories || shopData.categories.length === 0) {
        return [];
      }
      
      // Then find shops with similar categories
      let query = supabase
        .from('shops')
        .select('*')
        .neq('id', shopId)
        .eq('status', 'approved');
        
      // Add overlapping categories filter
      // This is a simplified approach; for more complex queries consider RPC functions
      shopData.categories.forEach((category: string) => {
        query = query.or(`categories.cs.{${category}}`);
      });
      
      query = query.order('average_rating', { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Shop[];
    } catch (error) {
      console.error(`Error fetching related shops for ${shopId}:`, error);
      return [];
    }
  }

  async getOrdersByShopId(shopId: string, status?: string): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .eq('seller_id', shopId);
        
      if (status) {
        query = query.eq('status', status);
      }
        
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Format results to match Order type
      const orders: Order[] = [];
      
      for (const order of data) {
        // Get order items
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*, shop_items(clothes(name))')
          .eq('order_id', order.id);
        
        if (itemsError) {
          console.error(`Error fetching items for order ${order.id}:`, itemsError);
          continue;
        }
        
        orders.push({
          id: order.id,
          shop_id: shopId,
          customer_id: order.buyer_id,
          status: order.status as OrderStatus,
          total_amount: order.total_amount,
          delivery_fee: order.shipping_cost || 0,
          payment_status: order.payment_status as PaymentStatus,
          payment_method: order.payment_method,
          delivery_address: {
            street: '',
            city: '',
            postal_code: '',
            country: ''
          },
          created_at: order.created_at,
          updated_at: order.updated_at || '',
          items: itemsData?.map(item => ({
            id: item.id,
            order_id: item.order_id,
            shop_item_id: item.shop_item_id,
            price_at_time: item.price_at_time,
            quantity: item.quantity,
            created_at: item.created_at,
            name: item.shop_items?.clothes?.name || ''
          })) || []
        });
      }
      
      return orders;
    } catch (error) {
      console.error(`Error fetching orders for shop ${shopId}:`, error);
      return [];
    }
  }

  async getSellerOrders(userId: string): Promise<Order[]> {
    try {
      // First get seller's shop
      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select('id')
        .eq('user_id', userId)
        .single();
        
      if (shopError) {
        console.error(`Error fetching shop for user ${userId}:`, shopError);
        return [];
      }
      
      if (!shopData) {
        return [];
      }
      
      // Then get orders for that shop
      return this.getShopOrders(shopData.id);
    } catch (error) {
      console.error(`Error fetching seller orders for user ${userId}:`, error);
      return [];
    }
  }
}
