
import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/repository/IShopRepository';
import { Shop, ShopItem, ShopReview, Order, ShopStatus, DbOrder, RawShopItem } from '../domain/types';

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
        profiles:user_id (
          username,
          full_name
        )
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
        profiles:user_id (
          username,
          full_name
        )
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
        profiles:user_id (
          username,
          full_name
        )
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
      .insert(shopData)
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
      .select('*, shop:shop_id(name)')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }

    // Apply type casting to handle the database response
    return data.map(item => ({
      ...item,
      status: item.status as ShopItemStatus,
      shop: { name: item.shop?.name || 'Unknown Shop' }
    })) as ShopItem[];
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*, shop:shop_id(name)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching shop item by ID:', error);
      return null;
    }

    // Apply type casting to handle the database response
    return {
      ...data,
      status: data.status as ShopItemStatus,
      shop: { name: data.shop?.name || 'Unknown Shop' }
    } as ShopItem;
  }

  async getShopItemsByIds(ids: string[]): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*, shop:shop_id(name)')
      .in('id', ids);

    if (error) {
      console.error('Error fetching shop items by IDs:', error);
      return [];
    }

    // Apply type casting to handle the database response
    return data.map(item => ({
      ...item,
      status: item.status as ShopItemStatus,
      shop: { name: item.shop?.name || 'Unknown Shop' }
    })) as ShopItem[];
  }

  async createShopItem(itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem> {
    // Ensure clothes_id is properly handled
    const { data, error } = await supabase
      .from('shop_items')
      .insert({
        name: itemData.name,
        description: itemData.description,
        image_url: itemData.image_url,
        price: itemData.price,
        original_price: itemData.original_price,
        shop_id: itemData.shop_id,
        status: itemData.status,
        stock: itemData.stock,
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
      status: data.status as ShopItemStatus
    } as ShopItem;
  }

  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem> {
    const { data, error } = await supabase
      .from('shop_items')
      .update(itemData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating shop item:', error);
      throw new Error(`Failed to update shop item: ${error.message}`);
    }

    return {
      ...data,
      status: data.status as ShopItemStatus
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
    const { data: ordersData, error: ordersError } = await supabase
      .from('shop_orders')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return [];
    }

    // For each order, get its items
    const orders: Order[] = [];
    for (const orderData of ordersData) {
      const { data: itemsData, error: itemsError } = await supabase
        .from('shop_order_items')
        .select('*')
        .eq('order_id', orderData.id);

      if (itemsError) {
        console.error(`Error fetching items for order ${orderData.id}:`, itemsError);
        continue;
      }

      // Convert DB order to domain Order
      const order: Order = {
        id: orderData.id,
        shop_id: orderData.shop_id,
        customer_id: orderData.customer_id,
        status: orderData.status as OrderStatus,
        total_amount: orderData.total_amount,
        delivery_fee: orderData.delivery_fee,
        payment_status: orderData.payment_status as PaymentStatus,
        payment_method: orderData.payment_method || 'unknown',
        delivery_address: orderData.delivery_address,
        created_at: orderData.created_at,
        updated_at: orderData.updated_at,
        items: itemsData.map(item => ({
          id: item.id,
          order_id: item.order_id,
          item_id: item.item_id,
          name: 'Product', // This should be fetched from shop_items
          price: item.price_at_time,
          quantity: item.quantity,
          created_at: item.created_at
        }))
      };

      orders.push(order);
    }

    return orders;
  }

  async getOrderById(id: string): Promise<Order | null> {
    const { data: orderData, error: orderError } = await supabase
      .from('shop_orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderError) {
      console.error(`Error fetching order ${id}:`, orderError);
      return null;
    }

    const { data: itemsData, error: itemsError } = await supabase
      .from('shop_order_items')
      .select('*')
      .eq('order_id', id);

    if (itemsError) {
      console.error(`Error fetching items for order ${id}:`, itemsError);
      return null;
    }

    // Convert DB order to domain Order
    const order: Order = {
      id: orderData.id,
      shop_id: orderData.shop_id,
      customer_id: orderData.customer_id,
      status: orderData.status as OrderStatus,
      total_amount: orderData.total_amount,
      delivery_fee: orderData.delivery_fee,
      payment_status: orderData.payment_status as PaymentStatus,
      payment_method: orderData.payment_method || 'unknown',
      delivery_address: orderData.delivery_address,
      created_at: orderData.created_at,
      updated_at: orderData.updated_at,
      items: itemsData.map(item => ({
        id: item.id,
        order_id: item.order_id,
        item_id: item.item_id,
        name: 'Product', // This should be fetched from shop_items
        price: item.price_at_time,
        quantity: item.quantity,
        created_at: item.created_at
      }))
    };

    return order;
  }

  async createOrder(orderData: any): Promise<Order> {
    // Extract items from the order data
    const { items, ...orderDetails } = orderData;

    // Insert order
    const { data: newOrder, error: orderError } = await supabase
      .from('shop_orders')
      .insert(orderDetails)
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    // Prepare items for insertion with price_at_time field
    const orderItems = items.map((item: any) => ({
      order_id: newOrder.id,
      item_id: item.item_id,
      quantity: item.quantity,
      price_at_time: item.price
    }));

    // Insert order items
    const { error: itemsError } = await supabase
      .from('shop_order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      
      // Attempt to delete the order to maintain consistency
      await supabase.from('shop_orders').delete().eq('id', newOrder.id);
      
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    // Return the created order with its items
    return this.getOrderById(newOrder.id) as Promise<Order>;
  }

  async updateOrder(id: string, orderData: any): Promise<Order> {
    const { data, error } = await supabase
      .from('shop_orders')
      .update(orderData)
      .eq('id', id)
      .select()
      .single();

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
      .select('*')
      .eq('user_id', userId)
      .eq('shop_id', shopId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return false;
      }
      console.error('Error checking if shop is favorited:', error);
      return false;
    }

    return !!data;
  }

  async getUserFavoriteShops(userId: string): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('user_favorite_shops')
      .select(`
        shop_id,
        shops:shop_id (*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user favorite shops:', error);
      return [];
    }

    // Extract shops from the nested structure
    const shops = data.map(item => item.shops);
    return shops as Shop[];
  }
}
