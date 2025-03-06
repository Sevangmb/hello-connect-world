import { IShopRepository } from '../../domain/interfaces/IShopRepository';
import { Shop, ShopItem, ShopSettings, ShopReview, Order, OrderItem, OrderStatus, PaymentStatus, DeliveryOption, PaymentMethod } from '../../domain/models/Shop';
import { supabase } from '@/integrations/supabase/client';

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
      categories: shop.categories || [],
      opening_hours: shop.opening_hours || {},
      average_rating: shop.average_rating || 0,
      latitude: shop.latitude || 0,
      longitude: shop.longitude || 0,
      status: shop.status || 'active',
      is_verified: shop.is_verified || false,
      created_at: shop.created_at,
      updated_at: shop.updated_at,
      owner: shop.profiles ? {
        id: shop.profiles.id,
        username: shop.profiles.username || '',
        avatar_url: shop.profiles.avatar_url || ''
      } : null
    };
  }

  private mapShopItemFromDB(item: any): ShopItem {
    return {
      id: item.id,
      shop_id: item.shop_id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      sale_price: item.sale_price,
      image_url: item.image_url || '',
      category: item.category || '',
      subcategory: item.subcategory || '',
      tags: item.tags || [],
      inventory: item.inventory || 0,
      is_available: item.is_available || false,
      options: item.options || [],
      specifications: item.specifications || {},
      created_at: item.created_at,
      updated_at: item.updated_at
    };
  }

  private mapShopSettingsFromDB(settings: any): ShopSettings {
    return {
      id: settings.id,
      shop_id: settings.shop_id,
      currency: settings.currency || 'USD',
      language: settings.language || 'en',
      notification_email: settings.notification_email || '',
      order_confirmation_message: settings.order_confirmation_message || '',
      automatic_order_confirmation: settings.automatic_order_confirmation || false,
      delivery_options: (settings.delivery_options || []) as DeliveryOption[],
      payment_methods: (settings.payment_methods || []) as PaymentMethod[],
      social_links: settings.social_links || {},
      notification_settings: {
        email: settings.notification_settings?.email || false,
        app: settings.notification_settings?.app || false
      }
    };
  }

  private mapOrderFromDB(order: any, items: any[] = []): Order {
    return {
      id: order.id,
      shop_id: order.shop_id,
      customer_id: order.customer_id,
      status: order.status as OrderStatus,
      total_amount: order.total_amount,
      delivery_fee: order.delivery_fee,
      payment_status: order.payment_status as PaymentStatus,
      payment_method: order.payment_method || 'card',
      delivery_address: {
        street: order.delivery_address?.street || '',
        city: order.delivery_address?.city || '',
        postal_code: order.delivery_address?.postal_code || '',
        country: order.delivery_address?.country || ''
      },
      created_at: order.created_at,
      updated_at: order.updated_at,
      items: items.map(this.mapOrderItemFromDB)
    };
  }

  private mapOrderItemFromDB(item: any): OrderItem {
    return {
      id: item.id,
      order_id: item.order_id,
      shop_item_id: item.shop_item_id,
      quantity: item.quantity,
      price: item.price,
      options: item.options || {},
      created_at: item.created_at,
      updated_at: item.updated_at,
      shop_item: item.shop_items ? {
        name: item.shop_items.name,
        image_url: item.shop_items.image_url || ''
      } : { name: item.name || 'Unknown Item' }
    };
  }

  private mapShopReviewFromDB(review: any): ShopReview {
    return {
      id: review.id,
      shop_id: review.shop_id,
      user_id: review.user_id,
      rating: review.rating,
      comment: review.comment || '',
      images: review.images || [],
      likes_count: review.likes_count || 0,
      is_verified_purchase: review.is_verified_purchase || false,
      created_at: review.created_at,
      updated_at: review.updated_at,
      user: review.profiles ? {
        id: review.profiles.id,
        username: review.profiles.username || '',
        avatar_url: review.profiles.avatar_url || ''
      } : null
    };
  }

  // Repository methods
  async getShops(): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select('*, profiles(*)');

    if (error) throw error;
    return data.map(this.mapShopFromDB);
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

  async createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'owner'>>): Promise<Shop> {
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
        categories: shopData.categories,
        opening_hours: shopData.opening_hours,
        average_rating: shopData.average_rating,
        latitude: shopData.latitude,
        longitude: shopData.longitude,
        status: shopData.status,
        is_verified: shopData.is_verified
      })
      .select('*, profiles(*)')
      .single();

    if (error) throw error;
    return this.mapShopFromDB(data);
  }

  async updateShop(id: string, shopData: Partial<Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'owner'>>): Promise<Shop> {
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
        categories: shopData.categories,
        opening_hours: shopData.opening_hours,
        average_rating: shopData.average_rating,
        latitude: shopData.latitude,
        longitude: shopData.longitude,
        status: shopData.status,
        is_verified: shopData.is_verified
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
        sale_price: itemData.sale_price,
        image_url: itemData.image_url,
        category: itemData.category,
        subcategory: itemData.subcategory,
        tags: itemData.tags,
        inventory: itemData.inventory,
        is_available: itemData.is_available,
        options: itemData.options,
        specifications: itemData.specifications
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapShopItemFromDB(data);
  }

  async getShopItemsByShop(shopId: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .eq('shop_id', shopId);

    if (error) throw error;
    return data.map(this.mapShopItemFromDB);
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
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
        sale_price: itemData.sale_price,
        image_url: itemData.image_url,
        category: itemData.category,
        subcategory: itemData.subcategory,
        tags: itemData.tags,
        inventory: itemData.inventory,
        is_available: itemData.is_available,
        options: itemData.options,
        specifications: itemData.specifications
      })
      .eq('id', id)
      .select()
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
        comment: reviewData.comment,
        images: reviewData.images,
        is_verified_purchase: reviewData.is_verified_purchase
      })
      .select()
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
    return data.map(this.mapShopReviewFromDB);
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
        comment: reviewData.comment,
        images: reviewData.images,
        is_verified_purchase: reviewData.is_verified_purchase
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
      .select('*, items:order_items(*)')
      .eq('shop_id', shopId);

    if (error) throw error;

    return data.map(order => {
      // Handle order items safely
      let orderItems: any[] = [];
      if (order.items && Array.isArray(order.items)) {
        orderItems = order.items;
      }
      return this.mapOrderFromDB(order, orderItems);
    });
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('customer_id', customerId);

    if (error) throw error;

    return data.map(order => {
      // Handle order items safely
      let orderItems: any[] = [];
      if (order.items && Array.isArray(order.items)) {
        orderItems = order.items;
      }
      return this.mapOrderFromDB(order, orderItems);
    });
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', orderId)
      .single();

    if (error) return null;

    // Handle order items safely
    let orderItems: any[] = [];
    if (data.items && Array.isArray(data.items)) {
      orderItems = data.items;
    }
    return this.mapOrderFromDB(data, orderItems);
  }

  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'items'>, items: Omit<OrderItem, 'id' | 'created_at' | 'updated_at' | 'order_id'>[]): Promise<Order> {
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
        shop_item_id: item.shop_item_id,
        quantity: item.quantity,
        price: item.price,
        options: item.options
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
  async isShopFavorited(shopId: string): Promise<boolean> {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('shop_favorites')
      .select('*')
      .eq('shop_id', shopId)
      .eq('user_id', user.id)
      .single();

    return data ? true : false;
  }

  async addShopToFavorites(shopId: string): Promise<boolean> {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('shop_favorites')
      .insert({
        shop_id: shopId,
        user_id: user.id
      });

    if (error) throw error;
    return true;
  }

  async removeShopFromFavorites(shopId: string): Promise<boolean> {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('shop_favorites')
      .delete()
      .eq('shop_id', shopId)
      .eq('user_id', user.id);

    if (error) throw error;
    return true;
  }

  async getFavoriteShops(): Promise<Shop[]> {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('shop_favorites')
      .select('shop_id')
      .eq('user_id', user.id);

    if (error) throw error;

    if (data.length === 0) return [];

    const shopIds = data.map(fav => fav.shop_id);

    const { data: shops, error: shopsError } = await supabase
      .from('shops')
      .select('*, profiles(*)')
      .in('id', shopIds);

    if (shopsError) throw shopsError;
    return shops.map(this.mapShopFromDB);
  }

  // Additional methods for IShopRepository implementation
  async getShopOrders(shopId: string): Promise<Order[]> {
    return this.getOrdersByShop(shopId);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.getOrdersByCustomer(userId);
  }

  async addFavoriteShop(userId: string, shopId: string): Promise<boolean> {
    return this.addShopToFavorites(shopId);
  }

  async removeFavoriteShop(userId: string, shopId: string): Promise<boolean> {
    return this.removeShopFromFavorites(shopId);
  }

  async isFavoriteShop(userId: string, shopId: string): Promise<boolean> {
    return this.isShopFavorited(shopId);
  }

  async getUserShop(userId: string): Promise<Shop | null> {
    return this.getShopByUserId(userId);
  }
}
