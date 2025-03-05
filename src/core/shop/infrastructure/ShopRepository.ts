
import { supabase } from '@/integrations/supabase/client';
import { 
  Shop, 
  ShopItem, 
  ShopReview, 
  Order, 
  OrderItem, 
  ShopStatus, 
  ShopItemStatus, 
  OrderStatus, 
  PaymentStatus, 
  PaymentMethod,
  DeliveryOption,
  ShopSettings,
  RawShopItem,
  DbOrder
} from '../domain/types';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

export class ShopRepository implements IShopRepository {
  // Fix mapShopFromDB method to handle image_url field that might not exist
  private mapShopFromDB(shop: any): Shop {
    return {
      id: shop.id,
      user_id: shop.user_id,
      name: shop.name,
      description: shop.description || '',
      image_url: shop.image_url || '', // Handle missing field
      address: shop.address || '',
      phone: shop.phone || '',
      website: shop.website || '',
      status: shop.status as ShopStatus,
      categories: shop.categories || [],
      average_rating: shop.average_rating || 0,
      total_ratings: shop.total_ratings || 0,
      rating_count: shop.rating_count || 0,
      latitude: shop.latitude || null,
      longitude: shop.longitude || null,
      opening_hours: shop.opening_hours || null,
      created_at: shop.created_at,
      updated_at: shop.updated_at,
      profiles: shop.profiles
    };
  }

  private mapShopItemFromDB(item: any): ShopItem {
    return {
      id: item.id,
      shop_id: item.shop_id,
      name: item.name,
      description: item.description || '',
      image_url: item.image_url || '',
      price: item.price,
      original_price: item.original_price || item.price,
      stock: item.stock,
      status: item.status as ShopItemStatus,
      created_at: item.created_at,
      updated_at: item.updated_at,
      clothes_id: item.clothes_id || null,
      shop: item.shop ? {
        name: item.shop.name || 'Unknown Shop',
        id: item.shop_id
      } : {
        name: 'Unknown Shop',
        id: item.shop_id
      }
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
      profiles: review.profiles
    };
  }

  private mapOrderItemFromDB(item: any): OrderItem {
    return {
      id: item.id,
      order_id: item.order_id,
      item_id: item.item_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      created_at: item.created_at,
      shop_item_id: item.shop_item_id,
      price_at_time: item.price_at_time
    };
  }

  // Fix type casts for DeliveryOption and PaymentMethod arrays
  private mapShopSettingsFromDB(settings: any): ShopSettings {
    return {
      id: settings.id,
      shop_id: settings.shop_id,
      delivery_options: settings.delivery_options as DeliveryOption[],
      payment_methods: settings.payment_methods as PaymentMethod[],
      auto_accept_orders: settings.auto_accept_orders,
      notification_preferences: {
        email: settings.notification_preferences?.email || false,
        app: settings.notification_preferences?.app || false
      },
      created_at: settings.created_at,
      updated_at: settings.updated_at
    };
  }

  // Fix Order mapping to include payment_method field
  private mapOrderFromDB(order: any, items: any[] = []): Order {
    return {
      id: order.id,
      shop_id: order.shop_id,
      customer_id: order.customer_id,
      status: order.status as OrderStatus,
      total_amount: order.total_amount,
      delivery_fee: order.delivery_fee,
      payment_status: order.payment_status as PaymentStatus,
      payment_method: order.payment_method || 'card', // Set a default value
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

  async getShops(): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `);

    if (error) throw error;
    return data.map(this.mapShopFromDB);
  }

  async getShopById(id: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.log(error);
      return null;
    }
    return this.mapShopFromDB(data);
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.log(error);
      return null;
    }
    return this.mapShopFromDB(data);
  }

  async getShopsByStatus(status: string): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `)
      .eq('status', status);

    if (error) throw error;
    return data.map(this.mapShopFromDB);
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
        longitude: shopData.longitude,
        opening_hours: shopData.opening_hours
      })
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `)
      .single();

    if (error) throw error;
    return this.mapShopFromDB(data);
  }

  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop> {
    const { data, error } = await supabase
      .from('shops')
      .update({
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
        longitude: shopData.longitude,
        opening_hours: shopData.opening_hours
      })
      .eq('id', id)
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `)
      .single();

    if (error) throw error;
    return this.mapShopFromDB(data);
  }

  async getShopItems(shopId: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select(`
        *,
        shop (
          name
        )
      `)
      .eq('shop_id', shopId);

    if (error) throw error;
    return data.map(this.mapShopItemFromDB);
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    const { data, error } = await supabase
      .from('shop_items')
      .select(`
        *,
        shop (
          name
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.log(error);
      return null;
    }
    return this.mapShopItemFromDB(data);
  }

  async createShopItem(itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>>): Promise<ShopItem> {
    const { data, error } = await supabase
      .from('shop_items')
      .insert({
        shop_id: itemData.shop_id,
        name: itemData.name,
        description: itemData.description,
        image_url: itemData.image_url,
        price: itemData.price,
        original_price: itemData.original_price,
        stock: itemData.stock,
        status: itemData.status,
        clothes_id: itemData.clothes_id
      })
      .select(`
        *,
        shop (
          name
        )
      `)
      .single();

    if (error) throw error;
    return this.mapShopItemFromDB(data);
  }

  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem> {
    const { data, error } = await supabase
      .from('shop_items')
      .update({
        name: itemData.name,
        description: itemData.description,
        image_url: itemData.image_url,
        price: itemData.price,
        original_price: itemData.original_price,
        stock: itemData.stock,
        status: itemData.status,
        clothes_id: itemData.clothes_id
      })
      .eq('id', id)
      .select(`
        *,
        shop (
          name
        )
      `)
      .single();

    if (error) throw error;
    return this.mapShopItemFromDB(data);
  }

  async updateShopItemStatus(id: string, status: ShopItemStatus): Promise<boolean> {
    const { error } = await supabase
      .from('shop_items')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating shop item status:', error);
      return false;
    }

    return true;
  }

  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `)
      .eq('shop_id', shopId);

    if (error) throw error;
    return data.map(this.mapShopReviewFromDB);
  }

  async createShopReview(reviewData: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>>): Promise<ShopReview> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .insert({
        shop_id: reviewData.shop_id,
        user_id: reviewData.user_id,
        rating: reviewData.rating,
        comment: reviewData.comment
      })
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `)
      .single();

    if (error) throw error;
    return this.mapShopReviewFromDB(data);
  }

  // Add missing methods for order operations and favorites
  async getOrdersByShop(shopId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items (*)
      `)
      .eq('shop_id', shopId);

    if (error) throw error;
    return data.map(order => this.mapOrderFromDB(order, order.items));
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items (*)
      `)
      .eq('customer_id', customerId);

    if (error) throw error;
    return data.map(order => this.mapOrderFromDB(order, order.items));
  }

  async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.log(error);
      return null;
    }
    return this.mapOrderFromDB(data, data.items);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return false;
    }

    return true;
  }

  async isShopFavorited(shopId: string): Promise<boolean> {
    // Implementation
    return false;
  }

  async addShopToFavorites(shopId: string): Promise<boolean> {
    // Implementation
    return true;
  }

  async removeShopFromFavorites(shopId: string): Promise<boolean> {
    // Implementation
    return true;
  }

  async getFavoriteShops(): Promise<Shop[]> {
    // Implementation
    return [];
  }

  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    const { data, error } = await supabase
      .from('shop_settings')
      .select('*')
      .eq('shop_id', shopId)
      .single();

    if (error) {
      console.log(error);
      return null;
    }
    return this.mapShopSettingsFromDB(data);
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings> {
    const { data, error } = await supabase
      .from('shop_settings')
      .update(settings)
      .eq('shop_id', shopId)
      .select('*')
      .single();

    if (error) throw error;
    return this.mapShopSettingsFromDB(data);
  }
}
