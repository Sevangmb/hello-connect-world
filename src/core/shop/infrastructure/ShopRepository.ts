import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { Shop, ShopItem, ShopSettings, Order, ShopReview, mapShopFromDB, mapShopItem, mapSettings, mapOrder } from '../domain/types';

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
          profiles:user_id (
            username, full_name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return mapShopFromDB(data);
    } catch (error) {
      console.error('Error fetching shop:', error);
      return null;
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
        .eq('shop_id', shopId);

      if (error) throw error;
      return data.map(mapShopItem);
    } catch (error) {
      console.error('Error fetching shop items:', error);
      return [];
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
      return mapSettings(data);
    } catch (error) {
      console.error('Error fetching shop settings:', error);
      return null;
    }
  }

  /**
   * Update shop settings
   */
  async updateShopSettings(settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    if (!settings.shop_id) {
      throw new Error('Shop ID is required to update settings');
    }
    
    try {
      // Ensure shop_id is set
      const { data, error } = await supabase
        .from('shop_settings')
        .update({
          auto_accept_orders: settings.auto_accept_orders,
          delivery_options: settings.delivery_options,
          payment_methods: settings.payment_methods,
          notification_preferences: settings.notification_preferences,
          updated_at: new Date().toISOString()
        })
        .eq('shop_id', settings.shop_id)
        .select()
        .single();

      if (error) throw error;
      return mapSettings(data);
    } catch (error) {
      console.error('Error updating shop settings:', error);
      return null;
    }
  }

  /**
   * Create shop
   */
  async createShop(shop: Partial<Shop>): Promise<Shop | null> {
    if (!shop.name || !shop.user_id) {
      throw new Error('Shop name and user ID are required to create a shop');
    }
    
    try {
      const { data, error } = await supabase
        .from('shops')
        .insert({
          name: shop.name,
          user_id: shop.user_id,
          description: shop.description || '',
          status: shop.status || 'pending',
          address: shop.address,
          phone: shop.phone,
          website: shop.website,
          categories: shop.categories,
          latitude: shop.latitude,
          longitude: shop.longitude,
          average_rating: 0,
          rating_count: 0,
          total_ratings: 0
        })
        .select()
        .single();

      if (error) throw error;
      return mapShopFromDB(data);
    } catch (error) {
      console.error('Error creating shop:', error);
      return null;
    }
  }

  /**
   * Update shop
   */
  async updateShop(id: string, shop: Partial<Shop>): Promise<Shop | null> {
    try {
      const updates: any = {};
      
      // Only include fields that are provided
      if (shop.name !== undefined) updates.name = shop.name;
      if (shop.description !== undefined) updates.description = shop.description;
      if (shop.status !== undefined) updates.status = shop.status;
      if (shop.address !== undefined) updates.address = shop.address;
      if (shop.phone !== undefined) updates.phone = shop.phone;
      if (shop.website !== undefined) updates.website = shop.website;
      if (shop.categories !== undefined) updates.categories = shop.categories;
      if (shop.latitude !== undefined) updates.latitude = shop.latitude;
      if (shop.longitude !== undefined) updates.longitude = shop.longitude;
      
      updates.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('shops')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapShopFromDB(data);
    } catch (error) {
      console.error('Error updating shop:', error);
      return null;
    }
  }

  /**
   * Create shop item
   */
  async createShopItem(item: Partial<ShopItem>): Promise<ShopItem | null> {
    if (!item.shop_id || !item.clothes_id || item.price === undefined) {
      throw new Error('Shop ID, clothes ID, and price are required to create a shop item');
    }
    
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert({
          shop_id: item.shop_id,
          clothes_id: item.clothes_id,
          name: item.name,
          description: item.description,
          price: item.price,
          original_price: item.original_price,
          stock: item.stock || 1,
          status: item.status || 'available',
          image_url: item.image_url
        })
        .select()
        .single();

      if (error) throw error;
      return mapShopItem(data);
    } catch (error) {
      console.error('Error creating shop item:', error);
      return null;
    }
  }

  /**
   * Update shop item
   */
  async updateShopItem(id: string, item: Partial<ShopItem>): Promise<ShopItem | null> {
    try {
      const updates: any = {};
      
      // Only include fields that are provided
      if (item.name !== undefined) updates.name = item.name;
      if (item.description !== undefined) updates.description = item.description;
      if (item.price !== undefined) updates.price = item.price;
      if (item.original_price !== undefined) updates.original_price = item.original_price;
      if (item.stock !== undefined) updates.stock = item.stock;
      if (item.status !== undefined) updates.status = item.status;
      if (item.image_url !== undefined) updates.image_url = item.image_url;
      
      updates.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('shop_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapShopItem(data);
    } catch (error) {
      console.error('Error updating shop item:', error);
      return null;
    }
  }

  /**
   * Create shop review
   */
  async createShopReview(review: Partial<ShopReview>): Promise<ShopReview | null> {
    if (!review.shop_id || !review.user_id || review.rating === undefined) {
      throw new Error('Shop ID, user ID, and rating are required to create a review');
    }
    
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
      return null;
    }
  }

  /**
   * Get shop orders
   */
  async getOrders(shopId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', shopId);

      if (error) throw error;
      return data.map(mapOrder);
    } catch (error) {
      console.error('Error fetching shop orders:', error);
      return [];
    }
  }

  /**
   * Create order
   */
  async createOrder(order: Partial<Order>): Promise<Order | null> {
    if (!order.buyer_id || !order.seller_id || !order.total_amount) {
      throw new Error('Buyer ID, seller ID, and total amount are required to create an order');
    }
    
    try {
      // Create the base order with required fields
      const orderData = {
        buyer_id: order.buyer_id,
        seller_id: order.seller_id,
        total_amount: order.total_amount,
        payment_status: order.payment_status || 'pending',
        status: order.status || 'pending',
        payment_method: order.payment_method || 'card',
        delivery_address: order.delivery_address || null,
        shipping_required: order.shipping_required || false,
        delivery_type: order.delivery_type || 'in_person',
        shipping_cost: order.shipping_cost || 0,
        transaction_type: order.transaction_type || 'p2p',
        commission_amount: order.commission_amount || 0
      };
      
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;
      return mapOrder(data);
    } catch (error) {
      console.error('Error creating order:', error);
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
          profiles:user_id (
            username, full_name
          )
        `)
        .eq('shop_id', shopId);

      if (error) throw error;
      return data as ShopReview[];
    } catch (error) {
      console.error('Error fetching shop reviews:', error);
      return [];
    }
  }

  /**
   * Get featured shops
   */
  async getFeaturedShops(): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (
            username, full_name
          )
        `)
        .eq('status', 'approved')
        .order('average_rating', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data.map(mapShopFromDB);
    } catch (error) {
      console.error('Error fetching featured shops:', error);
      return [];
    }
  }

  /**
   * Get shops by category
   */
  async getShopsByCategory(category: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (
            username, full_name
          )
        `)
        .contains('categories', [category]);

      if (error) throw error;
      return data.map(mapShopFromDB);
    } catch (error) {
      console.error(`Error fetching shops by category ${category}:`, error);
      return [];
    }
  }
}
