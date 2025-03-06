
import { Shop, ShopStatus, ShopItem, ShopItemStatus, Order, OrderStatus, PaymentStatus, PaymentMethod, CartItem, DbCartItem, DbOrder, ShopSettings } from '../domain/types';
import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { Json } from '@/integrations/supabase/types';

export class ShopRepository implements IShopRepository {
  /**
   * Create a new shop
   */
  async createShop(shop: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'average_rating'>): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .insert({
          name: shop.name,
          description: shop.description,
          user_id: shop.user_id,
          image_url: shop.image_url || null,
          address: shop.address || null,
          phone: shop.phone || null,
          website: shop.website || null,
          status: shop.status || 'pending',
          categories: shop.categories || [],
          latitude: shop.latitude || null,
          longitude: shop.longitude || null,
          opening_hours: shop.opening_hours || null,
        })
        .select('*')
        .single();

      if (error) throw error;

      // Also create default settings for this shop
      if (data) {
        await supabase
          .from('shop_settings')
          .insert({
            shop_id: data.id,
            delivery_options: ['pickup', 'delivery', 'both'],
            payment_methods: ['card', 'paypal', 'bank_transfer', 'cash'],
            auto_accept_orders: false,
            notification_preferences: { email: true, app: true }
          });

        // Add settings to the returned shop
        return {
          ...data as Shop,
          settings: {
            id: '',  // This will be filled when fetched later
            shop_id: data.id,
            delivery_options: ['pickup', 'delivery', 'both'],
            payment_methods: ['card', 'paypal', 'bank_transfer', 'cash'],
            auto_accept_orders: false,
            notification_preferences: { email: true, app: true },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        };
      }

      return data as Shop;
    } catch (error) {
      console.error('Error creating shop:', error);
      return null;
    }
  }

  /**
   * Get a shop by ID
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

      // Get shop settings separately
      const { data: settingsData } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', id)
        .single();

      // Return the shop with settings
      return {
        ...data as Shop,
        settings: settingsData as ShopSettings
      };
    } catch (error) {
      console.error(`Error fetching shop with ID ${id}:`, error);
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
        .select(`
          *,
          profiles:user_id(username, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // We don't include settings here for performance reasons
      return data as Shop[];
    } catch (error) {
      console.error('Error fetching all shops:', error);
      return [];
    }
  }

  /**
   * Get shops by user ID
   */
  async getShopsByUserId(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
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
   * Get a user's shop
   */
  async getUserShop(userId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id(username, full_name)
        `)
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      // Get shop settings separately
      if (data) {
        const { data: settingsData, error: settingsError } = await supabase
          .from('shop_settings')
          .select('*')
          .eq('shop_id', data.id)
          .single();

        if (!settingsError && settingsData) {
          return {
            ...data as Shop,
            settings: settingsData as ShopSettings
          };
        }
      }

      return data as Shop;
    } catch (error) {
      console.error(`Error fetching shop for user ${userId}:`, error);
      return null;
    }
  }

  /**
   * Update a shop
   */
  async updateShop(shopId: string, shopData: Partial<Shop>): Promise<Shop | null> {
    try {
      // Extract settings to update separately
      const { settings, ...shopUpdateData } = shopData;
      
      // Update shop
      const { data, error } = await supabase
        .from('shops')
        .update({
          ...shopUpdateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', shopId)
        .select('*')
        .single();

      if (error) throw error;

      // Update settings if provided
      if (settings && data) {
        const { error: settingsError } = await supabase
          .from('shop_settings')
          .update({
            delivery_options: settings.delivery_options,
            payment_methods: settings.payment_methods,
            auto_accept_orders: settings.auto_accept_orders,
            notification_preferences: settings.notification_preferences,
            updated_at: new Date().toISOString()
          })
          .eq('shop_id', shopId);

        if (settingsError) {
          console.error(`Error updating shop settings: ${settingsError.message}`);
        }
      }

      // Get the updated shop with settings
      return this.getShopById(shopId);
    } catch (error) {
      console.error(`Error updating shop ${shopId}:`, error);
      return null;
    }
  }

  /**
   * Update shop status
   */
  async updateShopStatus(shopId: string, status: ShopStatus): Promise<boolean> {
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
      console.error(`Error updating shop status: ${error}`);
      return false;
    }
  }

  /**
   * Get shops by status
   */
  async getShopsByStatus(status: ShopStatus): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id(username, full_name)
        `)
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
   * Create a shop item
   */
  async createShopItem(item: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert({
          shop_id: item.shop_id,
          name: item.name,
          description: item.description || null,
          image_url: item.image_url || null,
          price: item.price,
          original_price: item.original_price || null,
          stock: item.stock,
          status: item.status || 'available',
          clothes_id: item.clothes_id || null
        })
        .select('*')
        .single();

      if (error) throw error;
      return data as ShopItem;
    } catch (error) {
      console.error('Error creating shop item:', error);
      return null;
    }
  }

  /**
   * Update a shop item
   */
  async updateShopItem(itemId: string, itemData: Partial<ShopItem>): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .update({
          ...itemData,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)
        .select('*')
        .single();

      if (error) throw error;
      return data as ShopItem;
    } catch (error) {
      console.error(`Error updating shop item ${itemId}:`, error);
      return null;
    }
  }

  /**
   * Update shop item status
   */
  async updateShopItemStatus(itemId: string, status: ShopItemStatus): Promise<boolean> {
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
      console.error(`Error updating shop item status: ${error}`);
      return false;
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
      return false;
    }
  }

  /**
   * Get shop items by shop ID
   */
  async getShopItemsByShopId(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop:shop_id (
            name
          )
        `)
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
   * Get all shop items
   */
  async getAllShopItems(): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop:shop_id (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error fetching all shop items:', error);
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
        .select(`
          *,
          shop:shop_id (
            name,
            id
          )
        `)
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
   * Add multiple shop items
   */
  async addShopItems(items: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>[]): Promise<ShopItem[]> {
    try {
      const shopItems = items.map(item => ({
        shop_id: item.shop_id,
        name: item.name,
        description: item.description || null,
        image_url: item.image_url || null,
        price: item.price,
        original_price: item.original_price || null,
        stock: item.stock,
        status: item.status || 'available',
        clothes_id: item.clothes_id || null
      }));

      const { data, error } = await supabase
        .from('shop_items')
        .insert(shopItems)
        .select('*');

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error adding multiple shop items:', error);
      return [];
    }
  }

  /**
   * Add to cart
   */
  async addToCart(userId: string, shopItemId: string, quantity: number = 1): Promise<boolean> {
    try {
      // Check if item is already in cart
      const { data: existingItem, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('shop_item_id', shopItemId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItem.quantity + quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Add new item to cart
        const cartItem: DbCartItem = {
          user_id: userId,
          shop_item_id: shopItemId,
          quantity: quantity
        };

        const { error } = await supabase
          .from('cart_items')
          .insert(cartItem);

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return false;
    }
  }

  /**
   * Remove from cart
   */
  async removeFromCart(userId: string, cartItemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error removing item ${cartItemId} from cart:`, error);
      return false;
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItemQuantity(userId: string, cartItemId: string, quantity: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ 
          quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', cartItemId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating quantity for cart item ${cartItemId}:`, error);
      return false;
    }
  }

  /**
   * Get cart items for a user
   */
  async getCartItems(userId: string): Promise<CartItem[]> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          shop_items(
            id,
            name,
            price,
            image_url
          ),
          shop:shop_items!inner (
            id:shop_id,
            name:shops!inner(name)
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      // Transform the data to match the CartItem interface
      return data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        shop_id: item.shop.id,
        shop_item_id: item.shop_items.id,
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
    } catch (error) {
      console.error(`Error fetching cart items for user ${userId}:`, error);
      return [];
    }
  }

  /**
   * Clear cart for a user
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
      return false;
    }
  }

  /**
   * Create an order
   */
  async createOrder(shopId: string, userId: string, items: { itemId: string; quantity: number; price: number }[], address: any): Promise<Order | null> {
    try {
      // Calculate total amount
      const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Create the order
      const orderData = {
        shop_id: shopId,
        customer_id: userId,
        status: 'pending',
        total_amount: totalAmount,
        payment_status: 'pending',
        payment_method: 'card',
        delivery_address: address
      };

      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select('*')
        .single();

      if (orderError) throw orderError;

      // Add items to the order
      const orderItems = items.map(item => ({
        order_id: orderResult.id,
        shop_item_id: item.itemId,
        quantity: item.quantity,
        price_at_time: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Return the complete order
      const order: Order = {
        id: orderResult.id,
        shop_id: orderResult.shop_id,
        customer_id: orderResult.customer_id,
        status: orderResult.status as OrderStatus,
        total_amount: orderResult.total_amount,
        delivery_fee: orderResult.delivery_fee || 0,
        payment_status: orderResult.payment_status as PaymentStatus,
        payment_method: orderResult.payment_method,
        delivery_address: orderResult.delivery_address,
        created_at: orderResult.created_at,
        updated_at: orderResult.updated_at || new Date().toISOString(),
        items: orderItems.map(item => ({
          id: '', // Will be filled when fetched later
          order_id: item.order_id,
          shop_item_id: item.shop_item_id,
          price_at_time: item.price_at_time,
          quantity: item.quantity,
          created_at: new Date().toISOString(),
          name: '' // Will be filled when fetched later
        })),

        // For DB compatibility
        buyer_id: orderResult.buyer_id,
        seller_id: orderResult.seller_id
      };

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }

  /**
   * Get orders by shop ID
   */
  async getOrdersByShopId(shopId: string): Promise<Order[]> {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *
        `)
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Get items for each order
      const orders: Order[] = [];
      
      for (const orderData of ordersData) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            shop_items (
              name
            )
          `)
          .eq('order_id', orderData.id);

        if (itemsError) {
          console.error(`Error fetching items for order ${orderData.id}:`, itemsError);
          continue;
        }

        const items = itemsData.map(item => ({
          id: item.id,
          order_id: item.order_id,
          shop_item_id: item.shop_item_id,
          price_at_time: item.price_at_time,
          quantity: item.quantity,
          created_at: item.created_at,
          name: item.shop_items ? item.shop_items.name : 'Unknown Item'
        }));

        orders.push({
          id: orderData.id,
          shop_id: orderData.shop_id,
          customer_id: orderData.customer_id || orderData.buyer_id,
          status: orderData.status as OrderStatus,
          total_amount: orderData.total_amount,
          delivery_fee: orderData.delivery_fee || 0,
          payment_status: orderData.payment_status as PaymentStatus,
          payment_method: orderData.payment_method,
          delivery_address: orderData.delivery_address || { street: '', city: '', postal_code: '', country: '' },
          created_at: orderData.created_at,
          updated_at: orderData.updated_at || orderData.created_at,
          items,
          
          // For DB compatibility
          buyer_id: orderData.buyer_id,
          seller_id: orderData.seller_id
        });
      }

      return orders;
    } catch (error) {
      console.error(`Error fetching orders for shop ${shopId}:`, error);
      return [];
    }
  }

  /**
   * Get orders by user ID
   */
  async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *
        `)
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Get items for each order
      const orders: Order[] = [];
      
      for (const orderData of ordersData) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            shop_items (
              name
            )
          `)
          .eq('order_id', orderData.id);

        if (itemsError) {
          console.error(`Error fetching items for order ${orderData.id}:`, itemsError);
          continue;
        }

        const items = itemsData.map(item => ({
          id: item.id,
          order_id: item.order_id,
          shop_item_id: item.shop_item_id,
          price_at_time: item.price_at_time,
          quantity: item.quantity,
          created_at: item.created_at,
          name: item.shop_items ? item.shop_items.name : 'Unknown Item'
        }));

        orders.push({
          id: orderData.id,
          shop_id: orderData.shop_id,
          customer_id: orderData.customer_id || orderData.buyer_id,
          status: orderData.status as OrderStatus,
          total_amount: orderData.total_amount,
          delivery_fee: orderData.delivery_fee || 0,
          payment_status: orderData.payment_status as PaymentStatus,
          payment_method: orderData.payment_method,
          delivery_address: orderData.delivery_address || { street: '', city: '', postal_code: '', country: '' },
          created_at: orderData.created_at,
          updated_at: orderData.updated_at || orderData.created_at,
          items,
          
          // For DB compatibility
          buyer_id: orderData.buyer_id,
          seller_id: orderData.seller_id
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
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      // Get items for the order
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          shop_items (
            name
          )
        `)
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      const items = itemsData.map(item => ({
        id: item.id,
        order_id: item.order_id,
        shop_item_id: item.shop_item_id,
        price_at_time: item.price_at_time,
        quantity: item.quantity,
        created_at: item.created_at,
        name: item.shop_items ? item.shop_items.name : 'Unknown Item'
      }));

      const order: Order = {
        id: orderData.id,
        shop_id: orderData.shop_id,
        customer_id: orderData.customer_id || orderData.buyer_id,
        status: orderData.status as OrderStatus,
        total_amount: orderData.total_amount,
        delivery_fee: orderData.delivery_fee || 0,
        payment_status: orderData.payment_status as PaymentStatus,
        payment_method: orderData.payment_method,
        delivery_address: orderData.delivery_address || { street: '', city: '', postal_code: '', country: '' },
        created_at: orderData.created_at,
        updated_at: orderData.updated_at || orderData.created_at,
        items,
        
        // For DB compatibility
        buyer_id: orderData.buyer_id,
        seller_id: orderData.seller_id
      };

      return order;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      return null;
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: status, 
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
  async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus): Promise<boolean> {
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
   * Count orders by status for a shop
   */
  async countOrdersByStatusForShop(shopId: string): Promise<Record<OrderStatus, number>> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status')
        .eq('shop_id', shopId);

      if (error) throw error;

      const counts: Record<OrderStatus, number> = {
        'pending': 0,
        'confirmed': 0,
        'shipped': 0,
        'delivered': 0,
        'cancelled': 0,
        'returned': 0
      };

      data.forEach(order => {
        const status = order.status as OrderStatus;
        if (counts[status] !== undefined) {
          counts[status]++;
        }
      });

      return counts;
    } catch (error) {
      console.error(`Error counting orders by status for shop ${shopId}:`, error);
      return {
        'pending': 0,
        'confirmed': 0,
        'shipped': 0,
        'delivered': 0,
        'cancelled': 0,
        'returned': 0
      };
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
        .select('*')
        .single();

      if (error) throw error;
      return data as ShopSettings;
    } catch (error) {
      console.error(`Error updating settings for shop ${shopId}:`, error);
      return null;
    }
  }

  /**
   * Get shop stats
   */
  async getShopStats(shopId: string): Promise<any> {
    const stats = {
      totalSales: 0,
      totalItems: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      recentOrders: [],
      orderCountsByStatus: {}
    };

    try {
      // Count total items
      const { count: itemsCount, error: itemsError } = await supabase
        .from('shop_items')
        .select('*', { count: 'exact', head: true })
        .eq('shop_id', shopId);

      if (itemsError) throw itemsError;
      stats.totalItems = itemsCount || 0;

      // Count total orders and calculate total sales
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('shop_id', shopId)
        .eq('payment_status', 'paid');

      if (ordersError) throw ordersError;
      
      stats.totalOrders = orders.length;
      stats.totalSales = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      stats.averageOrderValue = stats.totalOrders > 0 ? (stats.totalSales / stats.totalOrders) : 0;

      // Get order counts by status
      stats.orderCountsByStatus = await this.countOrdersByStatusForShop(shopId);

      return stats;
    } catch (error) {
      console.error(`Error fetching stats for shop ${shopId}:`, error);
      return stats;
    }
  }

  /**
   * Check if a user's shop exists
   */
  async doesUserHaveShop(userId: string): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from('shops')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) throw error;
      return (count || 0) > 0;
    } catch (error) {
      console.error(`Error checking if user ${userId} has a shop:`, error);
      return false;
    }
  }
}
