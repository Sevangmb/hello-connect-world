import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { Shop, ShopItem, ShopSettings, ShopReview, Order, CartItem } from '../domain/types';

export class ShopRepository implements IShopRepository {
  async createShop(shopData: Partial<Shop>): Promise<Shop | null> {
    // Ensure required fields are present
    if (!shopData.name || !shopData.user_id) {
      throw new Error('Required shop fields missing');
    }

    const { data, error } = await supabase
      .from('shops')
      .insert([shopData])
      .select()
      .single();

    if (error) throw error;
    return data as Shop;
  }

  async updateShop(id: string, shopData: Partial<Shop>): Promise<boolean> {
    const { error } = await supabase
      .from('shops')
      .update(shopData)
      .eq('id', id);

    return !error;
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
      console.error('Error fetching shop by ID:', error);
      return null;
    }

    return data as Shop;
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

    if (error) {
      console.error('Error fetching shops:', error);
      return [];
    }

    return data as Shop[];
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

    if (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }

    return data as ShopItem[];
  }

  async createShopItem(shopItemData: Partial<ShopItem>): Promise<ShopItem | null> {
    // Ensure required fields are present
    if (!shopItemData.shop_id || !shopItemData.price) {
      throw new Error('Required shop item fields missing');
    }

    const { data, error } = await supabase
      .from('shop_items')
      .insert([shopItemData])
      .select()
      .single();

    if (error) throw error;
    return data as ShopItem;
  }

  async updateShopItem(id: string, shopItemData: Partial<ShopItem>): Promise<boolean> {
    const { error } = await supabase
      .from('shop_items')
      .update(shopItemData)
      .eq('id', id);

    return !error;
  }

  async deleteShopItem(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('shop_items')
      .delete()
      .eq('id', id);

    return !error;
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
      console.error('Error fetching shop item by ID:', error);
      return null;
    }

    return data as ShopItem;
  }

  async getShopItemsByCategory(shopId: string, category: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .eq('shop_id', shopId)
      .like('name', `%${category}%`);

    if (error) {
      console.error(`Error fetching shop items by category ${category}:`, error);
      return [];
    }

    return data as ShopItem[];
  }

  async getShopItemsByClothesId(clothesId: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .eq('clothes_id', clothesId);

    if (error) {
      console.error(`Error fetching shop items by clothes_id ${clothesId}:`, error);
      return [];
    }

    return data as ShopItem[];
  }

  async createShopItems(shopItems: any[]): Promise<boolean> {
    const { error } = await supabase
      .from('shop_items')
      .insert(shopItems);

    return !error;
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

    if (error) {
      console.error('Error fetching shop reviews:', error);
      return [];
    }

    return data as ShopReview[];
  }

  async createShopReview(shopReview: any): Promise<ShopReview | null> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .insert([shopReview])
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `)
      .single();

    if (error) throw error;
    return data as ShopReview;
  }

  async updateShopReview(id: string, shopReview: Partial<ShopReview>): Promise<boolean> {
    const { error } = await supabase
      .from('shop_reviews')
      .update(shopReview)
      .eq('id', id);

    return !error;
  }

  async deleteShopReview(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('shop_reviews')
      .delete()
      .eq('id', id);

    return !error;
  }

  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    const { data, error } = await supabase
      .from('shop_settings')
      .select('*')
      .eq('shop_id', shopId)
      .single();

    if (error) {
      console.error('Error fetching shop settings:', error);
      return null;
    }

    return data as ShopSettings;
  }

  async createShopSettings(shopSettings: any): Promise<ShopSettings | null> {
    const { data, error } = await supabase
      .from('shop_settings')
      .insert([shopSettings])
      .select()
      .single();

    if (error) throw error;
    return data as ShopSettings;
  }

  async updateShopSettings(shopId: string, shopSettings: any): Promise<boolean> {
    const { error } = await supabase
      .from('shop_settings')
      .update(shopSettings)
      .eq('shop_id', shopId);

    return !error;
  }

  async getFeaturedShops(): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `)
      .order('average_rating', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching featured shops:', error);
      return [];
    }

    return data as Shop[];
  }

  async getShopsBySearch(searchTerm: string): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `)
      .like('name', `%${searchTerm}%`);

    if (error) {
      console.error('Error fetching shops by search term:', error);
      return [];
    }

    return data as Shop[];
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        shop_items (
          name,
          price,
          image_url,
          id
        ),
        shop (
          name,
          id
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data as CartItem[];
  }

  async removeFromCart(itemId: string): Promise<boolean> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    return !error;
  }

  async updateCartItemQuantity(itemId: string, quantity: number): Promise<boolean> {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    return !error;
  }

  async clearCart(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    return !error;
  }

  async addToCart(userId: string, shopItemId: string, quantity: number = 1): Promise<CartItem> {
    const { data, error } = await supabase
      .from('cart_items')
      .insert({
        user_id: userId,
        shop_item_id: shopItemId,
        quantity
      })
      .select(`
        *,
        shop_items (
          name,
          price,
          image_url,
          id
        ),
        shop (
          name,
          id
        )
      `)
      .single();

    if (error) throw error;
    return data as CartItem;
  }

  async getShopsByUserId(userId: string): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data as Shop[];
  }

  async getShopOrders(shopId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('shop_id', shopId);

    if (error) throw error;
    return data as Order[];
  }
}
