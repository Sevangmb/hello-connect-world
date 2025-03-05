
import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { 
  Shop, 
  ShopItem, 
  ShopReview, 
  Order, 
  ShopStatus, 
  ShopItemStatus,
  PaymentStatus,
  OrderStatus,
  OrderItem,
  ShopSettings,
  DeliveryOption,
  PaymentMethod
} from '../domain/types';
import { Json } from '@/integrations/supabase/types';

export class ShopRepository implements IShopRepository {
  /**
   * Get a shop by ID
   */
  async getShopById(id: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching shop:', error);
        return null;
      }

      if (!data) return null;

      return {
        id: data.id,
        user_id: data.user_id,
        name: data.name,
        description: data.description,
        image_url: data.image_url,
        address: data.address,
        phone: data.phone,
        website: data.website,
        status: data.status as ShopStatus,
        categories: data.categories,
        average_rating: data.average_rating || 0,
        total_ratings: data.total_ratings,
        rating_count: data.rating_count,
        latitude: data.latitude,
        longitude: data.longitude,
        opening_hours: data.opening_hours,
        created_at: data.created_at,
        updated_at: data.updated_at,
        profiles: data.profiles
      };
    } catch (error) {
      console.error('Error in getShopById:', error);
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
        if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.error('Error fetching shop by user ID:', error);
        }
        return null;
      }

      if (!data) return null;

      return {
        id: data.id,
        user_id: data.user_id,
        name: data.name,
        description: data.description,
        image_url: data.image_url,
        address: data.address,
        phone: data.phone,
        website: data.website,
        status: data.status as ShopStatus,
        categories: data.categories,
        average_rating: data.average_rating || 0,
        total_ratings: data.total_ratings,
        rating_count: data.rating_count,
        latitude: data.latitude,
        longitude: data.longitude,
        opening_hours: data.opening_hours,
        created_at: data.created_at,
        updated_at: data.updated_at,
        profiles: data.profiles
      };
    } catch (error) {
      console.error('Error in getShopByUserId:', error);
      return null;
    }
  }

  /**
   * Get all shops
   */
  async getShops(): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching shops:', error);
        return [];
      }

      return data.map(shop => ({
        id: shop.id,
        user_id: shop.user_id,
        name: shop.name,
        description: shop.description,
        image_url: shop.image_url,
        address: shop.address,
        phone: shop.phone,
        website: shop.website,
        status: shop.status as ShopStatus,
        categories: shop.categories,
        average_rating: shop.average_rating || 0,
        total_ratings: shop.total_ratings,
        rating_count: shop.rating_count,
        latitude: shop.latitude,
        longitude: shop.longitude,
        opening_hours: shop.opening_hours,
        created_at: shop.created_at,
        updated_at: shop.updated_at,
        profiles: shop.profiles
      }));
    } catch (error) {
      console.error('Error in getShops:', error);
      return [];
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

      if (error) {
        console.error('Error fetching shops by status:', error);
        return [];
      }

      return data.map(shop => ({
        id: shop.id,
        user_id: shop.user_id,
        name: shop.name,
        description: shop.description,
        image_url: shop.image_url,
        address: shop.address,
        phone: shop.phone,
        website: shop.website,
        status: shop.status as ShopStatus,
        categories: shop.categories,
        average_rating: shop.average_rating || 0,
        total_ratings: shop.total_ratings,
        rating_count: shop.rating_count,
        latitude: shop.latitude,
        longitude: shop.longitude,
        opening_hours: shop.opening_hours,
        created_at: shop.created_at,
        updated_at: shop.updated_at,
        profiles: shop.profiles
      }));
    } catch (error) {
      console.error('Error in getShopsByStatus:', error);
      return [];
    }
  }

  /**
   * Create a shop
   */
  async createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop> {
    try {
      // Make sure average_rating has a default value
      const shopWithDefaults = {
        ...shopData,
        average_rating: shopData.average_rating || 0
      };

      const { data, error } = await supabase
        .from('shops')
        .insert(shopWithDefaults)
        .select()
        .single();

      if (error) {
        console.error('Error creating shop:', error);
        throw new Error(error.message);
      }

      return {
        id: data.id,
        user_id: data.user_id,
        name: data.name,
        description: data.description,
        image_url: data.image_url,
        address: data.address,
        phone: data.phone,
        website: data.website,
        status: data.status as ShopStatus,
        categories: data.categories,
        average_rating: data.average_rating || 0,
        total_ratings: data.total_ratings,
        rating_count: data.rating_count,
        latitude: data.latitude,
        longitude: data.longitude,
        opening_hours: data.opening_hours,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error in createShop:', error);
      throw error;
    }
  }

  /**
   * Update shop
   */
  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .update(shopData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating shop:', error);
        throw new Error(error.message);
      }

      return {
        id: data.id,
        user_id: data.user_id,
        name: data.name,
        description: data.description,
        image_url: data.image_url,
        address: data.address,
        phone: data.phone,
        website: data.website,
        status: data.status as ShopStatus,
        categories: data.categories,
        average_rating: data.average_rating || 0,
        total_ratings: data.total_ratings,
        rating_count: data.rating_count,
        latitude: data.latitude,
        longitude: data.longitude,
        opening_hours: data.opening_hours,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error in updateShop:', error);
      throw error;
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

      if (error) {
        console.error('Error deleting shop:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteShop:', error);
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
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching shop items:', error);
        return [];
      }

      return data.map(item => ({
        id: item.id,
        shop_id: item.shop_id,
        name: item.name,
        description: item.description,
        price: item.price,
        original_price: item.original_price,
        stock: item.stock,
        image_url: item.image_url,
        status: item.status as ShopItemStatus,
        created_at: item.created_at,
        updated_at: item.updated_at,
        clothes_id: item.clothes_id
      }));
    } catch (error) {
      console.error('Error in getShopItems:', error);
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
        .select('*, shop:shops(name)')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching shop item:', error);
        return null;
      }

      if (!data) return null;

      return {
        id: data.id,
        shop_id: data.shop_id,
        name: data.name,
        description: data.description,
        price: data.price,
        original_price: data.original_price,
        stock: data.stock,
        image_url: data.image_url,
        status: data.status as ShopItemStatus,
        created_at: data.created_at,
        updated_at: data.updated_at,
        clothes_id: data.clothes_id,
        shop: data.shop
      };
    } catch (error) {
      console.error('Error in getShopItemById:', error);
      return null;
    }
  }

  /**
   * Get shop items by IDs
   */
  async getShopItemsByIds(ids: string[]): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shops(name)')
        .in('id', ids);

      if (error) {
        console.error('Error fetching shop items by IDs:', error);
        return [];
      }

      return data.map(item => ({
        id: item.id,
        shop_id: item.shop_id,
        name: item.name,
        description: item.description,
        price: item.price,
        original_price: item.original_price,
        stock: item.stock,
        image_url: item.image_url,
        status: item.status as ShopItemStatus,
        created_at: item.created_at,
        updated_at: item.updated_at,
        clothes_id: item.clothes_id,
        shop: item.shop
      }));
    } catch (error) {
      console.error('Error in getShopItemsByIds:', error);
      return [];
    }
  }

  /**
   * Create shop item
   */
  async createShopItem(itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert({
          shop_id: itemData.shop_id,
          name: itemData.name,
          description: itemData.description,
          price: itemData.price,
          original_price: itemData.original_price,
          stock: itemData.stock,
          image_url: itemData.image_url,
          status: itemData.status || 'available',
          clothes_id: itemData.clothes_id || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating shop item:', error);
        throw new Error(error.message);
      }

      return {
        id: data.id,
        shop_id: data.shop_id,
        name: data.name,
        description: data.description,
        price: data.price,
        original_price: data.original_price,
        stock: data.stock,
        image_url: data.image_url,
        status: data.status as ShopItemStatus,
        created_at: data.created_at,
        updated_at: data.updated_at,
        clothes_id: data.clothes_id
      };
    } catch (error) {
      console.error('Error in createShopItem:', error);
      throw error;
    }
  }

  /**
   * Update shop item
   */
  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .update(itemData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating shop item:', error);
        throw new Error(error.message);
      }

      return {
        id: data.id,
        shop_id: data.shop_id,
        name: data.name,
        description: data.description,
        price: data.price,
        original_price: data.original_price,
        stock: data.stock,
        image_url: data.image_url,
        status: data.status as ShopItemStatus,
        created_at: data.created_at,
        updated_at: data.updated_at,
        clothes_id: data.clothes_id
      };
    } catch (error) {
      console.error('Error in updateShopItem:', error);
      throw error;
    }
  }

  /**
   * Update shop item status
   */
  async updateShopItemStatus(id: string, status: ShopItemStatus): Promise<ShopItem> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating shop item status:', error);
        throw new Error(error.message);
      }

      return {
        id: data.id,
        shop_id: data.shop_id,
        name: data.name,
        description: data.description,
        price: data.price,
        original_price: data.original_price,
        stock: data.stock,
        image_url: data.image_url,
        status: data.status as ShopItemStatus,
        created_at: data.created_at,
        updated_at: data.updated_at,
        clothes_id: data.clothes_id
      };
    } catch (error) {
      console.error('Error in updateShopItemStatus:', error);
      throw error;
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

      if (error) {
        console.error('Error deleting shop item:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteShopItem:', error);
      return false;
    }
  }

  /**
   * Helper method to map order items
   */
  private mapOrderItems(items: any[]): OrderItem[] {
    return items.map(item => ({
      id: item.id,
      order_id: item.order_id,
      item_id: item.shop_item_id,
      name: item.shop_items?.name || item.name || 'Unknown item',
      price: item.price_at_time || item.shop_items?.price || 0,
      quantity: item.quantity,
      created_at: item.created_at
    }));
  }

  /**
   * Get orders for a shop
   */
  async getOrders(shopId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            id,
            order_id,
            shop_item_id,
            quantity,
            price_at_time,
            created_at,
            shop_items:shop_items(
              id,
              name,
              price
            )
          )
        `)
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching shop orders:', error);
        return [];
      }

      return data.map(order => {
        // Parse delivery_address from JSON to object
        const deliveryAddress = typeof order.delivery_address === 'string' 
          ? JSON.parse(order.delivery_address as string) 
          : order.delivery_address;

        // Ensure it has the required structure
        const address = {
          street: deliveryAddress?.street || '',
          city: deliveryAddress?.city || '',
          postal_code: deliveryAddress?.postal_code || '',
          country: deliveryAddress?.country || ''
        };

        return {
          id: order.id,
          shop_id: order.shop_id,
          customer_id: order.customer_id,
          status: order.status as OrderStatus,
          total_amount: order.total_amount,
          delivery_fee: order.delivery_fee,
          payment_status: order.payment_status as PaymentStatus,
          payment_method: order.payment_method || 'unknown',
          delivery_address: address,
          created_at: order.created_at,
          updated_at: order.updated_at,
          items: this.mapOrderItems(order.items)
        };
      });
    } catch (error) {
      console.error('Error in getOrders:', error);
      return [];
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
          items:order_items(
            id,
            order_id,
            shop_item_id,
            quantity,
            price_at_time,
            created_at,
            shop_items:shop_items(
              id,
              name,
              price
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        return null;
      }

      if (!data) return null;

      // Parse delivery_address from JSON to object
      const deliveryAddress = typeof data.delivery_address === 'string' 
        ? JSON.parse(data.delivery_address as string) 
        : data.delivery_address;

      // Ensure it has the required structure
      const address = {
        street: deliveryAddress?.street || '',
        city: deliveryAddress?.city || '',
        postal_code: deliveryAddress?.postal_code || '',
        country: deliveryAddress?.country || ''
      };

      return {
        id: data.id,
        shop_id: data.shop_id,
        customer_id: data.customer_id,
        status: data.status as OrderStatus,
        total_amount: data.total_amount,
        delivery_fee: data.delivery_fee,
        payment_status: data.payment_status as PaymentStatus,
        payment_method: data.payment_method || 'unknown',
        delivery_address: address,
        created_at: data.created_at,
        updated_at: data.updated_at,
        items: this.mapOrderItems(data.items)
      };
    } catch (error) {
      console.error('Error in getOrderById:', error);
      return null;
    }
  }

  /**
   * Create order
   */
  async createOrder(orderData: any): Promise<Order> {
    try {
      // Prepare the order data
      const { items, ...orderInfo } = orderData;
      
      // Convert delivery address to JSON if needed
      if (typeof orderInfo.delivery_address === 'object') {
        orderInfo.delivery_address = JSON.stringify(orderInfo.delivery_address);
      }

      // Insert the order
      const { data: orderData2, error: orderError } = await supabase
        .from('orders')
        .insert(orderInfo)
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        throw new Error(orderError.message);
      }

      // Insert order items
      const orderItems = items.map((item: any) => ({
        order_id: orderData2.id,
        shop_item_id: item.item_id,
        quantity: item.quantity,
        price_at_time: item.price
      }));

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select();

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // Consider rolling back the order here
        throw new Error(itemsError.message);
      }

      // Parse delivery_address from JSON to object
      const deliveryAddress = typeof orderData2.delivery_address === 'string' 
        ? JSON.parse(orderData2.delivery_address as string) 
        : orderData2.delivery_address;

      // Ensure it has the required structure
      const address = {
        street: deliveryAddress?.street || '',
        city: deliveryAddress?.city || '',
        postal_code: deliveryAddress?.postal_code || '',
        country: deliveryAddress?.country || ''
      };

      // Return the created order with items
      return {
        status: orderData2.status as OrderStatus,
        payment_status: orderData2.payment_status as PaymentStatus,
        payment_method: orderData2.payment_method || 'unknown',
        items: this.mapOrderItems(itemsData),
        ...orderData2,
        delivery_address: address
      };
    } catch (error) {
      console.error('Error in createOrder:', error);
      throw error;
    }
  }

  /**
   * Update order
   */
  async updateOrder(id: string, orderData: any): Promise<Order> {
    try {
      // Convert delivery address to JSON if needed
      if (orderData.delivery_address && typeof orderData.delivery_address === 'object') {
        orderData.delivery_address = JSON.stringify(orderData.delivery_address);
      }

      const { data, error } = await supabase
        .from('orders')
        .update(orderData)
        .eq('id', id)
        .select(`
          *,
          items:order_items(
            id,
            order_id,
            shop_item_id,
            quantity,
            price_at_time,
            created_at,
            shop_items:shop_items(
              id,
              name,
              price
            )
          )
        `)
        .single();

      if (error) {
        console.error('Error updating order:', error);
        throw new Error(error.message);
      }

      // Parse delivery_address from JSON to object
      const deliveryAddress = typeof data.delivery_address === 'string' 
        ? JSON.parse(data.delivery_address as string) 
        : data.delivery_address;

      // Ensure it has the required structure
      const address = {
        street: deliveryAddress?.street || '',
        city: deliveryAddress?.city || '',
        postal_code: deliveryAddress?.postal_code || '',
        country: deliveryAddress?.country || ''
      };

      return {
        id: data.id,
        shop_id: data.shop_id,
        customer_id: data.customer_id,
        status: data.status as OrderStatus,
        total_amount: data.total_amount,
        delivery_fee: data.delivery_fee,
        payment_status: data.payment_status as PaymentStatus,
        payment_method: data.payment_method || 'unknown',
        delivery_address: address,
        created_at: data.created_at,
        updated_at: data.updated_at,
        items: this.mapOrderItems(data.items)
      };
    } catch (error) {
      console.error('Error in updateOrder:', error);
      throw error;
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating order status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
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
        .select('*, profiles(username, full_name)')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching shop reviews:', error);
        return [];
      }

      return data.map(review => ({
        id: review.id,
        shop_id: review.shop_id,
        user_id: review.user_id,
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at,
        updated_at: review.updated_at,
        profiles: review.profiles
      }));
    } catch (error) {
      console.error('Error in getShopReviews:', error);
      return [];
    }
  }

  /**
   * Create shop review
   */
  async createShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview> {
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

      if (error) {
        console.error('Error creating shop review:', error);
        throw new Error(error.message);
      }

      return {
        id: data.id,
        shop_id: data.shop_id,
        user_id: data.user_id,
        rating: data.rating,
        comment: data.comment,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error in createShopReview:', error);
      throw error;
    }
  }

  /**
   * Update shop review
   */
  async updateShopReview(id: string, reviewData: Partial<ShopReview>): Promise<ShopReview> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .update(reviewData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating shop review:', error);
        throw new Error(error.message);
      }

      return {
        id: data.id,
        shop_id: data.shop_id,
        user_id: data.user_id,
        rating: data.rating,
        comment: data.comment,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error in updateShopReview:', error);
      throw error;
    }
  }

  /**
   * Delete shop review
   */
  async deleteShopReview(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_reviews')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting shop review:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteShopReview:', error);
      return false;
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
        if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.error('Error fetching shop settings:', error);
        }
        return null;
      }

      if (!data) return null;

      return {
        id: data.id,
        shop_id: data.shop_id,
        delivery_options: data.delivery_options as DeliveryOption[],
        payment_methods: data.payment_methods as PaymentMethod[],
        auto_accept_orders: data.auto_accept_orders,
        notification_preferences: data.notification_preferences,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error in getShopSettings:', error);
      return null;
    }
  }

  /**
   * Update shop settings
   */
  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    try {
      // Check if settings exist
      const { data: existingSettings } = await supabase
        .from('shop_settings')
        .select('id')
        .eq('shop_id', shopId)
        .single();

      let result;
      
      if (existingSettings) {
        // Update existing settings
        const { data, error } = await supabase
          .from('shop_settings')
          .update(settings)
          .eq('shop_id', shopId)
          .select()
          .single();

        if (error) {
          console.error('Error updating shop settings:', error);
          throw new Error(error.message);
        }
        
        result = data;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('shop_settings')
          .insert({
            shop_id: shopId,
            ...settings
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating shop settings:', error);
          throw new Error(error.message);
        }
        
        result = data;
      }

      return {
        id: result.id,
        shop_id: result.shop_id,
        delivery_options: result.delivery_options as DeliveryOption[],
        payment_methods: result.payment_methods as PaymentMethod[],
        auto_accept_orders: result.auto_accept_orders,
        notification_preferences: result.notification_preferences,
        created_at: result.created_at,
        updated_at: result.updated_at
      };
    } catch (error) {
      console.error('Error in updateShopSettings:', error);
      return null;
    }
  }

  /**
   * Add shop to favorites
   */
  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('favorite_shops')
        .insert({
          user_id: userId,
          shop_id: shopId
        });

      if (error) {
        console.error('Error adding shop to favorites:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in addShopToFavorites:', error);
      return false;
    }
  }

  /**
   * Remove shop from favorites
   */
  async removeShopFromFavorites(userId: string, shopId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('favorite_shops')
        .delete()
        .match({
          user_id: userId,
          shop_id: shopId
        });

      if (error) {
        console.error('Error removing shop from favorites:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in removeShopFromFavorites:', error);
      return false;
    }
  }

  /**
   * Check if shop is favorited
   */
  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('favorite_shops')
        .select('id')
        .match({
          user_id: userId,
          shop_id: shopId
        })
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.error('Error checking if shop is favorited:', error);
        }
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in isShopFavorited:', error);
      return false;
    }
  }

  /**
   * Get user favorite shops
   */
  async getUserFavoriteShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('favorite_shops')
        .select('shop_id, shops(*)')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching favorite shops:', error);
        return [];
      }

      return data.map(favorite => ({
        id: favorite.shops.id,
        user_id: favorite.shops.user_id,
        name: favorite.shops.name,
        description: favorite.shops.description,
        image_url: favorite.shops.image_url,
        address: favorite.shops.address,
        phone: favorite.shops.phone,
        website: favorite.shops.website,
        status: favorite.shops.status,
        categories: favorite.shops.categories,
        average_rating: favorite.shops.average_rating || 0,
        total_ratings: favorite.shops.total_ratings,
        rating_count: favorite.shops.rating_count,
        latitude: favorite.shops.latitude,
        longitude: favorite.shops.longitude,
        opening_hours: favorite.shops.opening_hours,
        created_at: favorite.shops.created_at,
        updated_at: favorite.shops.updated_at
      }));
    } catch (error) {
      console.error('Error in getUserFavoriteShops:', error);
      return [];
    }
  }
}
