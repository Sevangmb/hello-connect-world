
import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { 
  Shop, ShopItem, ShopReview, ShopSettings, Order,
  mapShopFromDB, mapShopItem, mapShopItems, mapOrder, mapOrders, mapSettings
} from '../domain/types';

export class ShopRepository implements IShopRepository {
  async createShop(data: Partial<Shop>): Promise<Shop> {
    const { data: shop, error } = await supabase
      .from('shops')
      .insert({
        name: data.name,
        user_id: data.user_id,
        description: data.description,
        status: data.status || 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return mapShopFromDB(shop);
  }

  async createShopItem(data: Partial<ShopItem>): Promise<ShopItem> {
    const { data: item, error } = await supabase
      .from('shop_items')
      .insert({
        clothes_id: data.clothes_id,
        shop_id: data.shop_id,
        price: data.price,
        name: data.name,
        description: data.description,
        image_url: data.image_url,
        stock: data.stock || 1,
        status: data.status || 'available'
      })
      .select()
      .single();

    if (error) throw error;
    return mapShopItem(item);
  }

  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    const { data, error } = await supabase
      .from('shop_settings')
      .select('*')
      .eq('shop_id', shopId)
      .single();

    if (error) return null;
    return mapSettings(data);
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings> {
    // Ensure shop_id is set for the update
    const updateData = { ...settings, shop_id: shopId };
    
    const { data, error } = await supabase
      .from('shop_settings')
      .update(updateData)
      .eq('shop_id', shopId)
      .select()
      .single();

    if (error) throw error;
    return mapSettings(data);
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', userId);

    if (error) throw error;
    return mapOrders(data || []);
  }

  async getShopById(id: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select('*, profiles(username, full_name)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching shop by ID:', error);
      return null;
    }

    return mapShopFromDB(data);
  }

  async updateShop(id: string, data: Partial<Shop>): Promise<Shop> {
    const { data: shop, error } = await supabase
      .from('shops')
      .update(data)
      .eq('id', id)
      .select('*, profiles(username, full_name)')
      .single();

    if (error) throw error;
    return mapShopFromDB(shop);
  }

  async getUserShop(userId: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select('*, profiles(username, full_name)')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user shop:', error);
      return null;
    }

    return mapShopFromDB(data);
  }

  async getShopItems(shopId: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*, shop:shops(name, id)')
      .eq('shop_id', shopId);

    if (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }

    return mapShopItems(data || []);
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*, shop:shops(name, id)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching shop item by ID:', error);
      return null;
    }

    return mapShopItem(data);
  }

  async updateShopItem(id: string, data: Partial<ShopItem>): Promise<ShopItem> {
    const { data: item, error } = await supabase
      .from('shop_items')
      .update(data)
      .eq('id', id)
      .select('*, shop:shops(name, id)')
      .single();

    if (error) throw error;
    return mapShopItem(item);
  }

  async getOrdersByShopId(shopId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          id, shop_item_id, quantity, price_at_time,
          shop_items(name, image_url)
        )
      `)
      .eq('shop_id', shopId);

    if (error) {
      console.error('Error fetching orders by shop ID:', error);
      return [];
    }

    return mapOrders(data || []);
  }

  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .select('*, profiles:profiles(username, full_name)')
      .eq('shop_id', shopId);

    if (error) {
      console.error('Error fetching shop reviews:', error);
      return [];
    }

    return data.map(review => ({
      ...review,
      profiles: review.profiles || { username: 'Anonymous' }
    }));
  }

  async createShopReview(data: Partial<ShopReview>): Promise<ShopReview> {
    // Validate required fields
    if (!data.shop_id || !data.user_id || !data.rating) {
      throw new Error('Missing required fields for shop review');
    }
    
    const { data: review, error } = await supabase
      .from('shop_reviews')
      .insert([{
        shop_id: data.shop_id,
        user_id: data.user_id,
        rating: data.rating,
        comment: data.comment
      }])
      .select('*, profiles:profiles(username, full_name)')
      .single();

    if (error) throw error;
    
    return {
      ...review,
      profiles: review.profiles || { username: 'Anonymous' }
    };
  }
}
