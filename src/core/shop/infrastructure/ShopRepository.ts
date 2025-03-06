import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { Shop, ShopItem, ShopReview, ShopSettings, Order } from '../domain/types';

export class ShopRepository implements IShopRepository {
  async createShop(data: Partial<Shop>): Promise<Shop> {
    const { data: shop, error } = await supabase
      .from('shops')
      .insert([{
        name: data.name,
        user_id: data.user_id,
        description: data.description,
        status: data.status || 'pending'
      }])
      .select()
      .single();

    if (error) throw error;
    return shop;
  }

  async createShopItem(data: Partial<ShopItem>): Promise<ShopItem> {
    const { data: item, error } = await supabase
      .from('shop_items')
      .insert([{
        clothes_id: data.clothes_id,
        shop_id: data.shop_id,
        price: data.price,
        name: data.name,
        stock: data.stock || 1
      }])
      .select()
      .single();

    if (error) throw error;
    return item;
  }

  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    const { data, error } = await supabase
      .from('shop_settings')
      .select('*')
      .eq('shop_id', shopId)
      .single();

    if (error) return null;
    return data;
  }

  async createShopSettings(settings: Partial<ShopSettings>): Promise<ShopSettings> {
    const { data, error } = await supabase
      .from('shop_settings')
      .insert([settings])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings> {
    const { data, error } = await supabase
      .from('shop_settings')
      .update(settings)
      .eq('shop_id', shopId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', userId);

    if (error) throw error;
    return data;
  }

  async getShopById(id: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching shop by ID:', error);
      return null;
    }

    return data;
  }

  async updateShop(id: string, data: Partial<Shop>): Promise<Shop> {
    const { data: shop, error } = await supabase
      .from('shops')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return shop;
  }

  async getUserShop(userId: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user shop:', error);
      return null;
    }

    return data;
  }

  async getShopItems(shopId: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .eq('shop_id', shopId);

    if (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }

    return data;
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching shop item by ID:', error);
      return null;
    }

    return data;
  }

  async updateShopItem(id: string, data: Partial<ShopItem>): Promise<ShopItem> {
    const { data: item, error } = await supabase
      .from('shop_items')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return item;
  }

  async getOrdersByShopId(shopId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('shop_id', shopId);

    if (error) {
      console.error('Error fetching orders by shop ID:', error);
      return [];
    }

    return data;
  }

  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .select('*')
      .eq('shop_id', shopId);

    if (error) {
      console.error('Error fetching shop reviews:', error);
      return [];
    }

    return data;
  }

  async createShopReview(data: Partial<ShopReview>): Promise<ShopReview> {
    const { data: review, error } = await supabase
      .from('shop_reviews')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return review;
  }
}
