
import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { 
  Shop, 
  ShopItem, 
  ShopReview, 
  Order, 
  ShopStatus, 
  ShopItemStatus,
  OrderStatus, 
  ShopSettings, 
  PaymentStatus,
  DbOrder
} from '../domain/types';

export class ShopRepository implements IShopRepository {
  
  // Shop operations
  async getShopById(id: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles:user_id (
          username,
          full_name
        )
      `)
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('Error getting shop by ID:', error);
      return null;
    }
    
    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description || '',
      image_url: data.image_url || '',
      address: data.address || '',
      phone: data.phone || '',
      website: data.website || '',
      status: data.status as ShopStatus,
      categories: data.categories || [],
      average_rating: data.average_rating || 0,
      total_ratings: data.total_ratings || 0,
      rating_count: data.rating_count || 0,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      opening_hours: data.opening_hours || null,
      created_at: data.created_at,
      updated_at: data.updated_at,
      profiles: data.profiles
    };
  }
  
  async getShopByUserId(userId: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles:user_id (
          username,
          full_name
        )
      `)
      .eq('user_id', userId)
      .single();
    
    if (error || !data) {
      console.error('Error getting shop by user ID:', error);
      return null;
    }
    
    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description || '',
      image_url: data.image_url || '',
      address: data.address || '',
      phone: data.phone || '',
      website: data.website || '',
      status: data.status as ShopStatus,
      categories: data.categories || [],
      average_rating: data.average_rating || 0,
      total_ratings: data.total_ratings || 0,
      rating_count: data.rating_count || 0,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      opening_hours: data.opening_hours || null,
      created_at: data.created_at,
      updated_at: data.updated_at,
      profiles: data.profiles
    };
  }
  
  async getShops(): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles:user_id (
          username,
          full_name
        )
      `)
      .eq('status', 'approved');
    
    if (error || !data) {
      console.error('Error getting shops:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      user_id: item.user_id,
      name: item.name,
      description: item.description || '',
      image_url: item.image_url || '',
      address: item.address || '',
      phone: item.phone || '',
      website: item.website || '',
      status: item.status as ShopStatus,
      categories: item.categories || [],
      average_rating: item.average_rating || 0,
      total_ratings: item.total_ratings || 0,
      rating_count: item.rating_count || 0,
      latitude: item.latitude || null,
      longitude: item.longitude || null,
      opening_hours: item.opening_hours || null,
      created_at: item.created_at,
      updated_at: item.updated_at,
      profiles: item.profiles
    }));
  }
  
  async getShopsByStatus(status: ShopStatus): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles:user_id (
          username,
          full_name
        )
      `)
      .eq('status', status);
    
    if (error || !data) {
      console.error('Error getting shops by status:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      user_id: item.user_id,
      name: item.name,
      description: item.description || '',
      image_url: item.image_url || '',
      address: item.address || '',
      phone: item.phone || '',
      website: item.website || '',
      status: item.status as ShopStatus,
      categories: item.categories || [],
      average_rating: item.average_rating || 0,
      total_ratings: item.total_ratings || 0,
      rating_count: item.rating_count || 0,
      latitude: item.latitude || null,
      longitude: item.longitude || null,
      opening_hours: item.opening_hours || null,
      created_at: item.created_at,
      updated_at: item.updated_at,
      profiles: item.profiles
    }));
  }
  
  async createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'average_rating'>): Promise<Shop> {
    const { data, error } = await supabase
      .from('shops')
      .insert({
        user_id: shopData.user_id,
        name: shopData.name,
        description: shopData.description,
        address: shopData.address,
        phone: shopData.phone,
        website: shopData.website,
        status: shopData.status,
        categories: shopData.categories,
        latitude: shopData.latitude,
        longitude: shopData.longitude,
        opening_hours: shopData.opening_hours,
      })
      .select(`
        *,
        profiles:user_id (
          username,
          full_name
        )
      `)
      .single();
    
    if (error || !data) {
      console.error('Error creating shop:', error);
      throw error;
    }
    
    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description || '',
      image_url: data.image_url || '',
      address: data.address || '',
      phone: data.phone || '',
      website: data.website || '',
      status: data.status as ShopStatus,
      categories: data.categories || [],
      average_rating: data.average_rating || 0,
      total_ratings: data.total_ratings || 0,
      rating_count: data.rating_count || 0,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      opening_hours: data.opening_hours || null,
      created_at: data.created_at,
      updated_at: data.updated_at,
      profiles: data.profiles
    };
  }
  
  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop> {
    // Remove properties that should not be updated
    const { id: _, created_at, updated_at, profiles, average_rating, ...updateData } = shopData as any;
    
    const { data, error } = await supabase
      .from('shops')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        profiles:user_id (
          username,
          full_name
        )
      `)
      .single();
    
    if (error || !data) {
      console.error('Error updating shop:', error);
      throw error;
    }
    
    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description || '',
      image_url: data.image_url || '',
      address: data.address || '',
      phone: data.phone || '',
      website: data.website || '',
      status: data.status as ShopStatus,
      categories: data.categories || [],
      average_rating: data.average_rating || 0,
      total_ratings: data.total_ratings || 0,
      rating_count: data.rating_count || 0,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      opening_hours: data.opening_hours || null,
      created_at: data.created_at,
      updated_at: data.updated_at,
      profiles: data.profiles
    };
  }
  
  async deleteShop(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting shop:', error);
      return false;
    }
    
    return true;
  }
  
  // Shop items operations
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*, shop:shop_id(name)')
      .eq('shop_id', shopId);
    
    if (error) {
      console.error('Error getting shop items:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      shop_id: item.shop_id,
      name: item.name || '',
      description: item.description || '',
      price: item.price,
      original_price: item.original_price,
      stock: item.stock,
      status: item.status as ShopItemStatus,
      image_url: item.image_url || '',
      clothes_id: item.clothes_id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      shop: item.shop
    }));
  }
  
  async getShopItemById(id: string): Promise<ShopItem | null> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*, shop:shop_id(name)')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('Error getting shop item by ID:', error);
      return null;
    }
    
    return {
      id: data.id,
      shop_id: data.shop_id,
      name: data.name || '',
      description: data.description || '',
      price: data.price,
      original_price: data.original_price,
      stock: data.stock,
      status: data.status as ShopItemStatus,
      image_url: data.image_url || '',
      clothes_id: data.clothes_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      shop: data.shop
    };
  }
  
  async createShopItem(itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem> {
    // Extract required properties for the database
    const shopItemData = {
      shop_id: itemData.shop_id,
      name: itemData.name,
      description: itemData.description,
      price: itemData.price,
      original_price: itemData.original_price,
      stock: itemData.stock,
      status: itemData.status,
      image_url: itemData.image_url,
      clothes_id: itemData.clothes_id || null
    };
    
    const { data, error } = await supabase
      .from('shop_items')
      .insert(shopItemData)
      .select('*, shop:shop_id(name)')
      .single();
    
    if (error || !data) {
      console.error('Error creating shop item:', error);
      throw error;
    }
    
    return {
      id: data.id,
      shop_id: data.shop_id,
      name: data.name || '',
      description: data.description || '',
      price: data.price,
      original_price: data.original_price,
      stock: data.stock,
      status: data.status as ShopItemStatus,
      image_url: data.image_url || '',
      clothes_id: data.clothes_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      shop: data.shop
    };
  }
  
  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem> {
    // Remove properties that should not be updated
    const { id: _, created_at, updated_at, shop, ...updateData } = itemData as any;
    
    const { data, error } = await supabase
      .from('shop_items')
      .update(updateData)
      .eq('id', id)
      .select('*, shop:shop_id(name)')
      .single();
    
    if (error || !data) {
      console.error('Error updating shop item:', error);
      throw error;
    }
    
    return {
      id: data.id,
      shop_id: data.shop_id,
      name: data.name || '',
      description: data.description || '',
      price: data.price,
      original_price: data.original_price,
      stock: data.stock,
      status: data.status as ShopItemStatus,
      image_url: data.image_url || '',
      clothes_id: data.clothes_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      shop: data.shop
    };
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
  
  // Shop orders operations
  async getShopOrders(shopId: string): Promise<Order[]> {
    const { data: ordersData, error } = await supabase
      .from('shop_orders')
      .select(`
        *,
        items:shop_order_items(*)
      `)
      .eq('shop_id', shopId);
    
    if (error) {
      console.error('Error getting shop orders:', error);
      return [];
    }
    
    return ordersData.map(order => {
      return {
        id: order.id,
        shop_id: order.shop_id,
        customer_id: order.customer_id,
        status: order.status as OrderStatus,
        total_amount: order.total_amount,
        delivery_fee: order.delivery_fee,
        payment_status: order.payment_status as PaymentStatus,
        payment_method: order.payment_method || 'card',
        delivery_address: this.parseDeliveryAddress(order.delivery_address),
        created_at: order.created_at,
        updated_at: order.updated_at,
        items: this.mapOrderItems(order.items)
      };
    });
  }
  
  async getUserOrders(userId: string): Promise<Order[]> {
    const { data: ordersData, error } = await supabase
      .from('shop_orders')
      .select(`
        *,
        items:shop_order_items(*)
      `)
      .eq('customer_id', userId);
    
    if (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
    
    return ordersData.map(order => {
      return {
        id: order.id,
        shop_id: order.shop_id,
        customer_id: order.customer_id,
        status: order.status as OrderStatus,
        total_amount: order.total_amount,
        delivery_fee: order.delivery_fee,
        payment_status: order.payment_status as PaymentStatus,
        payment_method: order.payment_method || 'card',
        delivery_address: this.parseDeliveryAddress(order.delivery_address),
        created_at: order.created_at,
        updated_at: order.updated_at,
        items: this.mapOrderItems(order.items)
      };
    });
  }
  
  async getOrderById(id: string): Promise<Order | null> {
    const { data: order, error } = await supabase
      .from('shop_orders')
      .select(`
        *,
        items:shop_order_items(*)
      `)
      .eq('id', id)
      .single();
    
    if (error || !order) {
      console.error('Error getting order by ID:', error);
      return null;
    }
    
    return {
      id: order.id,
      shop_id: order.shop_id,
      customer_id: order.customer_id,
      status: order.status as OrderStatus,
      total_amount: order.total_amount,
      delivery_fee: order.delivery_fee,
      payment_status: order.payment_status as PaymentStatus,
      payment_method: order.payment_method || 'card',
      delivery_address: this.parseDeliveryAddress(order.delivery_address),
      created_at: order.created_at,
      updated_at: order.updated_at,
      items: this.mapOrderItems(order.items)
    };
  }
  
  async createOrder(orderData: any): Promise<Order> {
    // First, create the order
    const { data: order, error } = await supabase
      .from('shop_orders')
      .insert({
        shop_id: orderData.shop_id,
        customer_id: orderData.customer_id,
        status: orderData.status || 'pending',
        total_amount: orderData.total_amount,
        delivery_fee: orderData.delivery_fee || 0,
        payment_status: orderData.payment_status || 'pending',
        delivery_address: orderData.delivery_address
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }
    
    // Then, create the order items
    const orderItems = orderData.items.map((item: any) => ({
      order_id: order.id,
      item_id: item.item_id,
      quantity: item.quantity,
      price_at_time: item.price_at_time
    }));
    
    const { data: items, error: itemsError } = await supabase
      .from('shop_order_items')
      .insert(orderItems)
      .select();
    
    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw itemsError;
    }
    
    return {
      id: order.id,
      shop_id: order.shop_id,
      customer_id: order.customer_id,
      status: order.status as OrderStatus,
      total_amount: order.total_amount,
      delivery_fee: order.delivery_fee,
      payment_status: order.payment_status as PaymentStatus,
      payment_method: 'card', // Default payment method
      delivery_address: this.parseDeliveryAddress(order.delivery_address),
      created_at: order.created_at,
      updated_at: order.updated_at,
      items: this.mapOrderItems(items)
    };
  }
  
  async updateOrder(id: string, orderData: any): Promise<Order> {
    // Update the order
    const { data: order, error } = await supabase
      .from('shop_orders')
      .update({
        status: orderData.status,
        payment_status: orderData.payment_status,
        // Add other fields as needed
      })
      .eq('id', id)
      .select(`
        *,
        items:shop_order_items(*)
      `)
      .single();
    
    if (error) {
      console.error('Error updating order:', error);
      throw error;
    }
    
    return {
      id: order.id,
      shop_id: order.shop_id,
      customer_id: order.customer_id,
      status: order.status as OrderStatus,
      total_amount: order.total_amount,
      delivery_fee: order.delivery_fee,
      payment_status: order.payment_status as PaymentStatus,
      payment_method: 'card', // Default payment method
      delivery_address: this.parseDeliveryAddress(order.delivery_address),
      created_at: order.created_at,
      updated_at: order.updated_at,
      items: this.mapOrderItems(order.items)
    };
  }
  
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    const { error } = await supabase
      .from('shop_orders')
      .update({ status })
      .eq('id', orderId);
    
    if (error) {
      console.error('Error updating order status:', error);
      return false;
    }
    
    return true;
  }
  
  // Shop review operations
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .select(`
        *,
        profiles:user_id (
          username,
          full_name
        )
      `)
      .eq('shop_id', shopId);
    
    if (error) {
      console.error('Error getting shop reviews:', error);
      return [];
    }
    
    return data.map(review => ({
      id: review.id,
      shop_id: review.shop_id,
      user_id: review.user_id,
      rating: review.rating,
      comment: review.comment || '',
      created_at: review.created_at,
      updated_at: review.updated_at,
      profiles: review.profiles
    }));
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
      .select(`
        *,
        profiles:user_id (
          username,
          full_name
        )
      `)
      .single();
    
    if (error) {
      console.error('Error creating shop review:', error);
      throw error;
    }
    
    return {
      id: data.id,
      shop_id: data.shop_id,
      user_id: data.user_id,
      rating: data.rating,
      comment: data.comment || '',
      created_at: data.created_at,
      updated_at: data.updated_at,
      profiles: data.profiles
    };
  }
  
  async updateShopReview(id: string, reviewData: Partial<ShopReview>): Promise<ShopReview> {
    const { id: _, created_at, updated_at, profiles, ...updateData } = reviewData as any;
    
    const { data, error } = await supabase
      .from('shop_reviews')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        profiles:user_id (
          username,
          full_name
        )
      `)
      .single();
    
    if (error) {
      console.error('Error updating shop review:', error);
      throw error;
    }
    
    return {
      id: data.id,
      shop_id: data.shop_id,
      user_id: data.user_id,
      rating: data.rating,
      comment: data.comment || '',
      created_at: data.created_at,
      updated_at: data.updated_at,
      profiles: data.profiles
    };
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
  
  // Shop settings operations
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    const { data, error } = await supabase
      .from('shop_settings')
      .select('*')
      .eq('shop_id', shopId)
      .single();
    
    if (error) {
      console.error('Error getting shop settings:', error);
      return null;
    }
    
    return {
      id: data.id,
      shop_id: data.shop_id,
      delivery_options: data.delivery_options,
      payment_methods: data.payment_methods,
      auto_accept_orders: data.auto_accept_orders,
      notification_preferences: {
        email: data.notification_preferences?.email || true,
        app: data.notification_preferences?.app || true
      },
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }
  
  async updateShopSettings(shopId: string, settingsData: Partial<ShopSettings>): Promise<ShopSettings> {
    const { id: _, created_at, updated_at, ...updateData } = settingsData as any;
    
    // Check if settings exist
    const { data: existingSettings } = await supabase
      .from('shop_settings')
      .select('id')
      .eq('shop_id', shopId)
      .single();
    
    let data;
    let error;
    
    if (existingSettings) {
      // Update existing settings
      const result = await supabase
        .from('shop_settings')
        .update(updateData)
        .eq('shop_id', shopId)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    } else {
      // Create new settings
      const result = await supabase
        .from('shop_settings')
        .insert({
          shop_id: shopId,
          ...updateData
        })
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    }
    
    if (error) {
      console.error('Error updating shop settings:', error);
      throw error;
    }
    
    return {
      id: data.id,
      shop_id: data.shop_id,
      delivery_options: data.delivery_options,
      payment_methods: data.payment_methods,
      auto_accept_orders: data.auto_accept_orders,
      notification_preferences: {
        email: data.notification_preferences?.email || true,
        app: data.notification_preferences?.app || true
      },
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }
  
  // Favorites operations
  async getFavoriteShops(userId: string): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('favorite_shops')
      .select(`
        shop_id,
        shops:shop_id (
          *,
          profiles:user_id (
            username,
            full_name
          )
        )
      `)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error getting favorite shops:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.shops.id,
      user_id: item.shops.user_id,
      name: item.shops.name,
      description: item.shops.description || '',
      image_url: item.shops.image_url || '',
      address: item.shops.address || '',
      phone: item.shops.phone || '',
      website: item.shops.website || '',
      status: item.shops.status as ShopStatus,
      categories: item.shops.categories || [],
      average_rating: item.shops.average_rating || 0,
      total_ratings: item.shops.total_ratings || 0,
      rating_count: item.shops.rating_count || 0,
      latitude: item.shops.latitude || null,
      longitude: item.shops.longitude || null,
      opening_hours: item.shops.opening_hours || null,
      created_at: item.shops.created_at,
      updated_at: item.shops.updated_at,
      profiles: item.shops.profiles
    }));
  }
  
  async addFavoriteShop(userId: string, shopId: string): Promise<boolean> {
    const { error } = await supabase
      .from('favorite_shops')
      .insert({
        user_id: userId,
        shop_id: shopId
      });
    
    if (error) {
      console.error('Error adding favorite shop:', error);
      return false;
    }
    
    return true;
  }
  
  async removeFavoriteShop(userId: string, shopId: string): Promise<boolean> {
    const { error } = await supabase
      .from('favorite_shops')
      .delete()
      .eq('user_id', userId)
      .eq('shop_id', shopId);
    
    if (error) {
      console.error('Error removing favorite shop:', error);
      return false;
    }
    
    return true;
  }
  
  async checkIfFavorited(userId: string, shopId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorite_shops')
      .select('id')
      .eq('user_id', userId)
      .eq('shop_id', shopId)
      .single();
    
    if (error) {
      return false;
    }
    
    return !!data;
  }
  
  // Helper methods
  private mapOrderItems(items: any[]): any[] {
    if (!items) return [];
    
    return items.map(item => ({
      id: item.id,
      order_id: item.order_id,
      item_id: item.item_id,
      name: item.name || '',
      price: item.price_at_time,
      quantity: item.quantity,
      created_at: item.created_at,
      shop_item_id: item.item_id,
      price_at_time: item.price_at_time
    }));
  }
  
  private parseDeliveryAddress(addressJson: any): any {
    try {
      if (typeof addressJson === 'string') {
        return JSON.parse(addressJson);
      }
      
      return {
        street: addressJson?.street || '',
        city: addressJson?.city || '',
        postal_code: addressJson?.postal_code || '',
        country: addressJson?.country || ''
      };
    } catch (e) {
      console.error('Error parsing delivery address:', e);
      return {
        street: '',
        city: '',
        postal_code: '',
        country: ''
      };
    }
  }
}
