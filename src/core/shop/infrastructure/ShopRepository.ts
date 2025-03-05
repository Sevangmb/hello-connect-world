
import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { Shop, ShopItem, ShopReview, Order, ShopStatus, ShopItemStatus, OrderStatus, PaymentStatus, OrderItem } from '../domain/types';

export class ShopRepository implements IShopRepository {
  // Shop operations
  async getShopById(id: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles (username, full_name)
      `)
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
      .select(`
        *,
        profiles (username, full_name)
      `)
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
      .select(`
        *,
        profiles (username, full_name)
      `)
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
      .select(`
        *,
        profiles (username, full_name)
      `)
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
        average_rating: shopData.average_rating || 0,
        total_ratings: shopData.total_ratings || 0,
        rating_count: shopData.rating_count || 0,
        latitude: shopData.latitude,
        longitude: shopData.longitude,
        opening_hours: shopData.opening_hours
      })
      .select()
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
      .select()
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
      .select(`
        *,
        shop:shops (name)
      `)
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }
    
    // Map the raw data to the ShopItem type
    return data.map(item => ({
      id: item.id,
      shop_id: item.shop_id,
      name: item.name,
      description: item.description,
      image_url: item.image_url,
      price: item.price,
      original_price: item.original_price,
      stock: item.stock,
      status: item.status as ShopItemStatus,
      created_at: item.created_at,
      updated_at: item.updated_at,
      clothes_id: item.clothes_id,
      shop: { name: item.shop?.name || '' }
    }));
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    const { data, error } = await supabase
      .from('shop_items')
      .select(`
        *,
        shop:shops (name)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching shop item:', error);
      return null;
    }
    
    return {
      id: data.id,
      shop_id: data.shop_id,
      name: data.name,
      description: data.description,
      image_url: data.image_url,
      price: data.price,
      original_price: data.original_price,
      stock: data.stock,
      status: data.status as ShopItemStatus,
      created_at: data.created_at,
      updated_at: data.updated_at,
      clothes_id: data.clothes_id,
      shop: { name: data.shop?.name || '' }
    };
  }

  async getShopItemsByIds(ids: string[]): Promise<ShopItem[]> {
    if (!ids.length) return [];
    
    const { data, error } = await supabase
      .from('shop_items')
      .select(`
        *,
        shop:shops (name)
      `)
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
      image_url: item.image_url,
      price: item.price,
      original_price: item.original_price,
      stock: item.stock,
      status: item.status as ShopItemStatus,
      created_at: item.created_at,
      updated_at: item.updated_at,
      clothes_id: item.clothes_id,
      shop: { name: item.shop?.name || '' }
    }));
  }

  async createShopItem(itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem> {
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
        clothes_id: itemData.clothes_id || null
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating shop item:', error);
      throw new Error(`Failed to create shop item: ${error.message}`);
    }
    
    return {
      ...data,
      shop: { name: '' } // Default shop name, will be populated when retrieved with getShopItemById
    } as ShopItem;
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
      .select()
      .single();
    
    if (error) {
      console.error('Error updating shop item:', error);
      throw new Error(`Failed to update shop item: ${error.message}`);
    }
    
    return {
      ...data,
      shop: { name: '' } // Default shop name, will be populated when retrieved with getShopItemById
    } as ShopItem;
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
  
  // Shop reviews operations
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .select(`
        *,
        profiles (username, full_name)
      `)
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
      throw new Error(`Failed to create shop review: ${error.message}`);
    }
    
    return data as ShopReview;
  }

  async updateShopReview(id: string, reviewData: Partial<ShopReview>): Promise<ShopReview> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .update(reviewData)
      .eq('id', id)
      .select()
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
      items: this.mapOrderItems(order.items || [])
    }));
  }

  // Helper method to map order items
  private mapOrderItems(items: any[]): OrderItem[] {
    return items.map(item => ({
      id: item.id,
      order_id: item.order_id,
      item_id: item.item_id,
      name: item.name || 'Product',
      price: item.price_at_time,
      quantity: item.quantity,
      created_at: item.created_at,
      shop_item_id: item.item_id,
      price_at_time: item.price_at_time
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
      items: this.mapOrderItems(data.items || [])
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
        price_at_time: item.price || 0,
        name: item.name || 'Product'
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
        delivery_address: orderData.delivery_address,
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating order:', error);
      throw new Error(`Failed to update order: ${error.message}`);
    }
    
    return this.getOrderById(id) as Promise<Order>;
  }
  
  // Favorites
  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_favorite_shops')
      .insert({
        user_id: userId,
        shop_id: shopId
      });
    
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
      .select('*')
      .eq('user_id', userId)
      .eq('shop_id', shopId)
      .single();
    
    if (error) {
      return false;
    }
    
    return !!data;
  }

  async getUserFavoriteShops(userId: string): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('user_favorite_shops')
      .select(`
        shop_id,
        shops (*)
      `)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching favorite shops:', error);
      return [];
    }
    
    return data.map(item => item.shops) as Shop[];
  }
}
