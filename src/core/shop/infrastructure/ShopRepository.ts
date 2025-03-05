
import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/repository/IShopRepository';
import { Shop, ShopItem, ShopReview, Order, ShopStatus, ShopItemStatus, OrderStatus, PaymentStatus, DeliveryOption, PaymentMethod } from '../domain/types';
import { Json } from '@/integrations/supabase/types';

export class ShopRepository implements IShopRepository {
  // Shop operations
  async getShopById(id: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select('*, profiles(username, full_name)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching shop:', error);
      return null;
    }

    return data as Shop;
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select('*, profiles(username, full_name)')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching shop by user ID:', error);
      return null;
    }

    return data as Shop;
  }

  async getShops(): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select('*, profiles(username, full_name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shops:', error);
      return [];
    }

    return data as Shop[];
  }

  async getShopsByStatus(status: ShopStatus): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select('*, profiles(username, full_name)')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching shops with status ${status}:`, error);
      return [];
    }

    return data as Shop[];
  }

  async createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop> {
    const { data, error } = await supabase
      .from('shops')
      .insert(shopData)
      .select('*, profiles(username, full_name)')
      .single();

    if (error) {
      console.error('Error creating shop:', error);
      throw new Error(`Failed to create shop: ${error.message}`);
    }

    return data as Shop;
  }

  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop> {
    const { data, error } = await supabase
      .from('shops')
      .update(shopData)
      .eq('id', id)
      .select('*, profiles(username, full_name)')
      .single();

    if (error) {
      console.error('Error updating shop:', error);
      throw new Error(`Failed to update shop: ${error.message}`);
    }

    return data as Shop;
  }

  // Shop items operations
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*, shop:shops(name)')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }

    return data.map(item => ({
      ...item,
      status: item.status as ShopItemStatus,
      shop: { name: item.shop?.name || '' }
    }));
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*, shop:shops(name)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching shop item:', error);
      return null;
    }

    return {
      ...data,
      status: data.status as ShopItemStatus,
      shop: { name: data.shop?.name || '' }
    };
  }

  async getShopItemsByIds(ids: string[]): Promise<ShopItem[]> {
    if (ids.length === 0) return [];

    const { data, error } = await supabase
      .from('shop_items')
      .select('*, shop:shops(name)')
      .in('id', ids);

    if (error) {
      console.error('Error fetching shop items by IDs:', error);
      return [];
    }

    return data.map(item => ({
      ...item,
      status: item.status as ShopItemStatus,
      shop: { name: item.shop?.name || '' }
    }));
  }

  async createShopItem(itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem> {
    // Cast the data to ensure it's the correct shape for the database
    const dbData = {
      shop_id: itemData.shop_id,
      name: itemData.name,
      description: itemData.description,
      price: itemData.price,
      original_price: itemData.original_price,
      stock: itemData.stock,
      image_url: itemData.image_url,
      clothes_id: itemData.clothes_id,
      status: itemData.status || 'available'
    };

    const { data, error } = await supabase
      .from('shop_items')
      .insert(dbData)
      .select('*, shop:shops(name)')
      .single();

    if (error) {
      console.error('Error creating shop item:', error);
      throw new Error(`Failed to create shop item: ${error.message}`);
    }

    return {
      ...data,
      status: data.status as ShopItemStatus,
      shop: { name: data.shop?.name || '' }
    };
  }

  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem> {
    const { data, error } = await supabase
      .from('shop_items')
      .update(itemData)
      .eq('id', id)
      .select('*, shop:shops(name)')
      .single();

    if (error) {
      console.error('Error updating shop item:', error);
      throw new Error(`Failed to update shop item: ${error.message}`);
    }

    return {
      ...data,
      status: data.status as ShopItemStatus,
      shop: { name: data.shop?.name || '' }
    };
  }

  async deleteShopItem(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('shop_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting shop item:', error);
      return false;
    }

    return true;
  }

  // Shop review operations
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .select('*, profiles(username, full_name)')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shop reviews:', error);
      return [];
    }

    return data as ShopReview[];
  }

  async createShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .insert(review)
      .select('*, profiles(username, full_name)')
      .single();

    if (error) {
      console.error('Error creating shop review:', error);
      throw new Error(`Failed to create shop review: ${error.message}`);
    }

    return data as ShopReview;
  }

  async updateShopReview(id: string, reviewData: Partial<ShopReview>): Promise<ShopReview> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .update(reviewData)
      .eq('id', id)
      .select('*, profiles(username, full_name)')
      .single();

    if (error) {
      console.error('Error updating shop review:', error);
      throw new Error(`Failed to update shop review: ${error.message}`);
    }

    return data as ShopReview;
  }

  async deleteShopReview(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('shop_reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting shop review:', error);
      return false;
    }

    return true;
  }

  // Order operations
  async getOrders(shopId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('shop_orders')
      .select(`
        *,
        items:shop_order_items(*)
      `)
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shop orders:', error);
      return [];
    }

    // Transform database data to match the domain model
    return data.map(order => ({
      id: order.id,
      shop_id: order.shop_id,
      customer_id: order.customer_id,
      status: order.status as OrderStatus,
      total_amount: order.total_amount,
      delivery_fee: order.delivery_fee,
      payment_status: order.payment_status as PaymentStatus,
      payment_method: 'card', // Default value since it's not in the database
      delivery_address: order.delivery_address as any, // Handle the JSON conversion
      created_at: order.created_at,
      updated_at: order.updated_at,
      items: order.items || []
    }));
  }

  async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('shop_orders')
      .select(`
        *,
        items:shop_order_items(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return {
      id: data.id,
      shop_id: data.shop_id,
      customer_id: data.customer_id,
      status: data.status as OrderStatus,
      total_amount: data.total_amount,
      delivery_fee: data.delivery_fee,
      payment_status: data.payment_status as PaymentStatus,
      payment_method: 'card', // Default value since it's not in the database
      delivery_address: data.delivery_address as any, // Handle the JSON conversion
      created_at: data.created_at,
      updated_at: data.updated_at,
      items: data.items || []
    };
  }

  async createOrder(orderData: any): Promise<Order> {
    // Insert the order
    const { data: orderResult, error: orderError } = await supabase
      .from('shop_orders')
      .insert({
        shop_id: orderData.shop_id,
        customer_id: orderData.customer_id,
        status: orderData.status,
        total_amount: orderData.total_amount,
        delivery_fee: orderData.delivery_fee,
        payment_status: orderData.payment_status,
        delivery_address: orderData.delivery_address
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    // Insert order items
    if (orderData.items && orderData.items.length > 0) {
      const orderItems = orderData.items.map((item: any) => ({
        order_id: orderResult.id,
        item_id: item.item_id,
        quantity: item.quantity,
        price_at_time: item.price
      }));

      const { error: itemsError } = await supabase
        .from('shop_order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        throw new Error(`Failed to create order items: ${itemsError.message}`);
      }
    }

    // Return the full order with items
    return this.getOrderById(orderResult.id) as Promise<Order>;
  }

  async updateOrder(id: string, orderData: any): Promise<Order> {
    const { error } = await supabase
      .from('shop_orders')
      .update({
        status: orderData.status,
        payment_status: orderData.payment_status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating order:', error);
      throw new Error(`Failed to update order: ${error.message}`);
    }

    return this.getOrderById(id) as Promise<Order>;
  }

  // Favorites operations
  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_favorite_shops')
      .insert({ user_id: userId, shop_id: shopId });

    if (error) {
      console.error('Error adding shop to favorites:', error);
      return false;
    }

    return true;
  }

  async removeShopFromFavorites(userId: string, shopId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_favorite_shops')
      .delete()
      .eq('user_id', userId)
      .eq('shop_id', shopId);

    if (error) {
      console.error('Error removing shop from favorites:', error);
      return false;
    }

    return true;
  }

  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_favorite_shops')
      .select()
      .eq('user_id', userId)
      .eq('shop_id', shopId)
      .maybeSingle();

    if (error) {
      console.error('Error checking if shop is favorited:', error);
      return false;
    }

    return !!data;
  }

  async getUserFavoriteShops(userId: string): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('user_favorite_shops')
      .select('shops:shop_id(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user favorite shops:', error);
      return [];
    }

    return data.map((item: any) => item.shops) as Shop[];
  }
}
