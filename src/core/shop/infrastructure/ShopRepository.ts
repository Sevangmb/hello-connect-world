
import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { 
  Shop, 
  ShopItem, 
  ShopSettings, 
  ShopReview, 
  Order, 
  OrderItem, 
  OrderStatus, 
  PaymentStatus, 
  DeliveryOption, 
  PaymentMethod,
  RawShopItem,
  CartItem,
  DbOrder 
} from '../types';

export class ShopRepository implements IShopRepository {
  // Mapping methods
  private mapShopFromDB(shop: any): Shop {
    return {
      id: shop.id,
      user_id: shop.user_id,
      name: shop.name,
      description: shop.description || '',
      image_url: shop.image_url || '',
      address: shop.address || '',
      phone: shop.phone || '',
      website: shop.website || '',
      status: shop.status || 'pending',
      categories: shop.categories || [],
      average_rating: shop.average_rating || 0,
      total_ratings: shop.total_ratings || 0,
      rating_count: shop.rating_count || 0,
      latitude: shop.latitude || 0,
      longitude: shop.longitude || 0,
      created_at: shop.created_at,
      updated_at: shop.updated_at,
      profiles: shop.profiles ? {
        username: shop.profiles.username || '',
        full_name: shop.profiles.full_name || ''
      } : undefined
    };
  }

  private mapShopItemFromDB(item: any): ShopItem {
    return {
      id: item.id,
      shop_id: item.shop_id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      original_price: item.original_price,
      image_url: item.image_url || '',
      stock: item.stock || 0,
      status: item.status || 'available',
      created_at: item.created_at,
      updated_at: item.updated_at,
      clothes_id: item.clothes_id,
      shop: item.shop ? {
        name: item.shop.name || ''
      } : undefined
    };
  }

  private mapShopSettingsFromDB(settings: any): ShopSettings {
    return {
      id: settings.id,
      shop_id: settings.shop_id,
      delivery_options: (settings.delivery_options || []) as DeliveryOption[],
      payment_methods: (settings.payment_methods || []) as PaymentMethod[],
      auto_accept_orders: settings.auto_accept_orders || false,
      notification_preferences: {
        email: settings.notification_preferences?.email || false,
        app: settings.notification_preferences?.app || false
      },
      created_at: settings.created_at,
      updated_at: settings.updated_at
    };
  }

  private mapOrderFromDB(order: any, items: any[] = []): Order {
    return {
      id: order.id,
      shop_id: order.shop_id,
      customer_id: order.customer_id,
      status: order.status as OrderStatus,
      total_amount: order.total_amount,
      delivery_fee: order.delivery_fee || 0,
      payment_status: order.payment_status as PaymentStatus,
      payment_method: order.payment_method || 'card',
      delivery_address: order.delivery_address || {
        street: '',
        city: '',
        postal_code: '',
        country: ''
      },
      created_at: order.created_at,
      updated_at: order.updated_at,
      items: items.map(item => this.mapOrderItemFromDB(item))
    };
  }

  private mapOrderItemFromDB(item: any): OrderItem {
    return {
      id: item.id,
      order_id: item.order_id,
      item_id: item.item_id || item.shop_item_id,
      name: item.name || (item.shop_items ? item.shop_items.name : 'Unknown Item'),
      price: item.price || item.price_at_time || 0,
      quantity: item.quantity || 1,
      created_at: item.created_at,
      shop_item_id: item.shop_item_id,
      price_at_time: item.price_at_time
    };
  }

  private mapShopReviewFromDB(review: any): ShopReview {
    return {
      id: review.id,
      shop_id: review.shop_id,
      user_id: review.user_id,
      rating: review.rating,
      comment: review.comment || '',
      created_at: review.created_at,
      updated_at: review.updated_at,
      profiles: review.profiles ? {
        username: review.profiles.username || '',
        full_name: review.profiles.full_name || ''
      } : undefined
    };
  }

  // Repository methods
  async getShops(): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select('*, profiles(*)');

    if (error) throw error;
    return data.map(shop => this.mapShopFromDB(shop));
  }

  async getShopById(id: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select('*, profiles(*)')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapShopFromDB(data);
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select('*, profiles(*)')
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return this.mapShopFromDB(data);
  }

  async createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop> {
    const { data, error } = await supabase
      .from('shops')
      .insert({
        user_id: shopData.user_id,
        name: shopData.name,
        description: shopData.description,
        image_url: shopData.image_url,
        address: shopData.address,
        phone: shopData.phone,
        website: shopData.website,
        status: shopData.status,
        categories: shopData.categories,
        average_rating: shopData.average_rating,
        total_ratings: shopData.total_ratings,
        rating_count: shopData.rating_count,
        latitude: shopData.latitude,
        longitude: shopData.longitude
      })
      .select('*, profiles(*)')
      .single();

    if (error) throw error;
    return this.mapShopFromDB(data);
  }

  async updateShop(id: string, shopData: Partial<Omit<Shop, 'id' | 'created_at' | 'updated_at'>>): Promise<Shop> {
    const { data, error } = await supabase
      .from('shops')
      .update({
        user_id: shopData.user_id,
        name: shopData.name,
        description: shopData.description,
        image_url: shopData.image_url,
        address: shopData.address,
        phone: shopData.phone,
        website: shopData.website,
        status: shopData.status,
        categories: shopData.categories,
        average_rating: shopData.average_rating,
        total_ratings: shopData.total_ratings,
        rating_count: shopData.rating_count,
        latitude: shopData.latitude,
        longitude: shopData.longitude
      })
      .eq('id', id)
      .select('*, profiles(*)')
      .single();

    if (error) throw error;
    return this.mapShopFromDB(data);
  }

  async deleteShop(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async createShopItem(itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem> {
    const { data, error } = await supabase
      .from('shop_items')
      .insert({
        shop_id: itemData.shop_id,
        name: itemData.name,
        description: itemData.description,
        price: itemData.price,
        original_price: itemData.original_price,
        image_url: itemData.image_url,
        stock: itemData.stock,
        status: itemData.status,
        clothes_id: itemData.clothes_id
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapShopItemFromDB(data);
  }

  async getShopItemsByShop(shopId: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*, shop:shops(name)')
      .eq('shop_id', shopId);

    if (error) throw error;
    return data.map(item => this.mapShopItemFromDB(item));
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*, shop:shops(name)')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapShopItemFromDB(data);
  }

  async updateShopItem(id: string, itemData: Partial<Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>>): Promise<ShopItem> {
    const { data, error } = await supabase
      .from('shop_items')
      .update({
        shop_id: itemData.shop_id,
        name: itemData.name,
        description: itemData.description,
        price: itemData.price,
        original_price: itemData.original_price,
        image_url: itemData.image_url,
        stock: itemData.stock,
        status: itemData.status,
        clothes_id: itemData.clothes_id
      })
      .eq('id', id)
      .select('*, shop:shops(name)')
      .single();

    if (error) throw error;
    return this.mapShopItemFromDB(data);
  }

  async deleteShopItem(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('shop_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async createShopReview(reviewData: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .insert({
        shop_id: reviewData.shop_id,
        user_id: reviewData.user_id,
        rating: reviewData.rating,
        comment: reviewData.comment
      })
      .select('*, profiles(*)')
      .single();

    if (error) throw error;
    return this.mapShopReviewFromDB(data);
  }

  async getShopReviewsByShop(shopId: string): Promise<ShopReview[]> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .select('*, profiles(*)')
      .eq('shop_id', shopId);

    if (error) throw error;
    return data.map(review => this.mapShopReviewFromDB(review));
  }

  async getShopReviewById(id: string): Promise<ShopReview | null> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .select('*, profiles(*)')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapShopReviewFromDB(data);
  }

  async updateShopReview(id: string, reviewData: Partial<Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>>): Promise<ShopReview> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .update({
        shop_id: reviewData.shop_id,
        user_id: reviewData.user_id,
        rating: reviewData.rating,
        comment: reviewData.comment
      })
      .eq('id', id)
      .select('*, profiles(*)')
      .single();

    if (error) throw error;
    return this.mapShopReviewFromDB(data);
  }

  async deleteShopReview(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('shop_reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  // Order operations
  async getOrdersByShop(shopId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('shop_id', shopId);

    if (error) throw error;

    // Get order items separately
    const orders: Order[] = [];
    for (const order of data) {
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*, shop_items(*)')
        .eq('order_id', order.id);

      if (itemsError) {
        console.error(`Error fetching items for order ${order.id}:`, itemsError);
        orders.push(this.mapOrderFromDB(order, []));
      } else {
        orders.push(this.mapOrderFromDB(order, itemsData || []));
      }
    }

    return orders;
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', customerId);

    if (error) throw error;

    // Get order items separately
    const orders: Order[] = [];
    for (const order of data) {
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*, shop_items(*)')
        .eq('order_id', order.id);

      if (itemsError) {
        console.error(`Error fetching items for order ${order.id}:`, itemsError);
        orders.push(this.mapOrderFromDB(order, []));
      } else {
        orders.push(this.mapOrderFromDB(order, itemsData || []));
      }
    }

    return orders;
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) return null;

    // Get order items
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*, shop_items(*)')
      .eq('order_id', orderId);

    if (itemsError) {
      console.error(`Error fetching items for order ${orderId}:`, itemsError);
      return this.mapOrderFromDB(data, []);
    }

    return this.mapOrderFromDB(data, itemsData || []);
  }

  async createOrder(
    orderData: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'items'>, 
    items: Omit<OrderItem, 'id' | 'created_at' | 'order_id'>[]
  ): Promise<Order> {
    // Transaction to create order and items
    const { data, error } = await supabase
      .from('orders')
      .insert({
        shop_id: orderData.shop_id,
        customer_id: orderData.customer_id,
        status: orderData.status,
        total_amount: orderData.total_amount,
        delivery_fee: orderData.delivery_fee,
        payment_status: orderData.payment_status,
        payment_method: orderData.payment_method,
        delivery_address: orderData.delivery_address
      })
      .select()
      .single();

    if (error) throw error;

    // Create order items
    if (items.length > 0) {
      const orderItems = items.map(item => ({
        order_id: data.id,
        item_id: item.item_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        shop_item_id: item.shop_item_id,
        price_at_time: item.price_at_time
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;
    }

    return this.mapOrderFromDB(data, []);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) throw error;
    return true;
  }

  async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus): Promise<boolean> {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus })
      .eq('id', orderId);

    if (error) throw error;
    return true;
  }

  // Favorites operations
  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('shop_favorites')
      .select('*')
      .eq('shop_id', shopId)
      .eq('user_id', userId)
      .single();

    if (error) return false;
    return !!data;
  }

  async addFavoriteShop(userId: string, shopId: string): Promise<boolean> {
    const { error } = await supabase
      .from('shop_favorites')
      .insert({
        shop_id: shopId,
        user_id: userId
      });

    if (error) {
      // Check if it's because the favorite already exists
      if (error.code === '23505') { // Unique constraint violation
        return true;
      }
      throw error;
    }
    return true;
  }

  async removeFavoriteShop(userId: string, shopId: string): Promise<boolean> {
    const { error } = await supabase
      .from('shop_favorites')
      .delete()
      .eq('shop_id', shopId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

  async getFavoriteShops(userId: string): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shop_favorites')
      .select('shop_id')
      .eq('user_id', userId);

    if (error) throw error;

    if (data.length === 0) return [];

    const shopIds = data.map(fav => fav.shop_id);

    const { data: shops, error: shopsError } = await supabase
      .from('shops')
      .select('*, profiles(*)')
      .in('id', shopIds);

    if (shopsError) throw shopsError;
    return shops.map(shop => this.mapShopFromDB(shop));
  }

  // Cart methods
  async getCartItems(userId: string): Promise<CartItem[]> {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        shop_items (id, name, price, image_url, shop_id),
        shop:shops (id, name)
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  async addToCart(userId: string, itemId: string, quantity: number): Promise<CartItem | null> {
    // Check if item is already in cart
    const { data: existingItem, error: checkError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
      throw checkError;
    }

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id)
        .select(`
          *,
          shop_items (id, name, price, image_url, shop_id),
          shop:shops (id, name)
        `)
        .single();

      if (error) throw error;
      return data;
    } else {
      // Get shop_id from shop_items
      const { data: shopItem, error: shopItemError } = await supabase
        .from('shop_items')
        .select('shop_id')
        .eq('id', itemId)
        .single();

      if (shopItemError) throw shopItemError;

      // Insert new cart item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          item_id: itemId,
          shop_id: shopItem.shop_id,
          quantity
        })
        .select(`
          *,
          shop_items (id, name, price, image_url, shop_id),
          shop:shops (id, name)
        `)
        .single();

      if (error) throw error;
      return data;
    }
  }

  async updateCartItemQuantity(userId: string, itemId: string, quantity: number): Promise<CartItem | null> {
    if (quantity <= 0) {
      // Remove item from cart
      await this.removeFromCart(userId, itemId);
      return null;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .select(`
        *,
        shop_items (id, name, price, image_url, shop_id),
        shop:shops (id, name)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  async removeFromCart(userId: string, itemId: string): Promise<boolean> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('item_id', itemId);

    if (error) throw error;
    return true;
  }

  async clearCart(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

  // Helper to get shop for a user
  async getUserShop(userId: string): Promise<Shop | null> {
    return this.getShopByUserId(userId);
  }

  // Helper method to get orders for a shop
  async getShopOrders(shopId: string): Promise<Order[]> {
    return this.getOrdersByShop(shopId);
  }

  // Helper method to get orders for a user as a customer
  async getUserOrders(userId: string): Promise<Order[]> {
    return this.getOrdersByCustomer(userId);
  }
}

export const shopRepository = new ShopRepository();
