
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopItem, ShopReview, CartItem, RawShopItem, DbOrder, Order, ShopSettings } from '../domain/types';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

export class ShopRepository implements IShopRepository {
  /**
   * Get shop by ID
   */
  async getShopById(id: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Shop;
    } catch (error) {
      console.error('Error fetching shop:', error);
      return null;
    }
  }

  /**
   * Get shop by user ID
   */
  async getShopByUserId(userId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, not an error
          return null;
        }
        throw error;
      }
      return data as Shop;
    } catch (error) {
      console.error('Error fetching shop by user ID:', error);
      return null;
    }
  }

  /**
   * Create a shop
   */
  async createShop(shopData: Partial<Shop>): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .insert([{
          ...shopData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data as Shop;
    } catch (error) {
      console.error('Error creating shop:', error);
      return null;
    }
  }

  /**
   * Update shop information
   */
  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .update({
          ...shopData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Shop;
    } catch (error) {
      console.error('Error updating shop:', error);
      return null;
    }
  }

  /**
   * Get all shop items
   */
  async getAllShopItems(): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shops(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }
  }

  /**
   * Get shop items by shop ID
   */
  async getShopItemsByShopId(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error fetching shop items by shop ID:', error);
      return [];
    }
  }

  /**
   * Create shop item
   */
  async createShopItem(itemData: Partial<ShopItem>): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert([{
          ...itemData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data as ShopItem;
    } catch (error) {
      console.error('Error creating shop item:', error);
      return null;
    }
  }

  /**
   * Update shop item
   */
  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .update({
          ...itemData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ShopItem;
    } catch (error) {
      console.error('Error updating shop item:', error);
      return null;
    }
  }

  /**
   * Delete shop item
   */
  async deleteShopItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting shop item:', error);
      return false;
    }
  }

  /**
   * Get shop item by ID
   */
  async getShopItemById(id: string): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shop:shops(name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as ShopItem;
    } catch (error) {
      console.error('Error fetching shop item:', error);
      return null;
    }
  }

  /**
   * Get shop reviews by shop ID
   */
  async getShopReviewsByShopId(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select('*, profiles(username, full_name)')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ShopReview[];
    } catch (error) {
      console.error('Error fetching shop reviews:', error);
      return [];
    }
  }

  /**
   * Create shop review
   */
  async createShopReview(reviewData: Partial<ShopReview>): Promise<ShopReview | null> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert([{
          ...reviewData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
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
   * Get shop settings
   */
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No settings found
          return null;
        }
        throw error;
      }
      return data as ShopSettings;
    } catch (error) {
      console.error('Error fetching shop settings:', error);
      return null;
    }
  }

  /**
   * Update shop settings
   */
  async updateShopSettings(shopId: string, settingsData: Partial<ShopSettings>): Promise<ShopSettings | null> {
    try {
      // Check if settings exist first
      const existingSettings = await this.getShopSettings(shopId);
      
      if (existingSettings) {
        // Update existing settings
        const { data, error } = await supabase
          .from('shop_settings')
          .update({
            ...settingsData,
            updated_at: new Date().toISOString()
          })
          .eq('shop_id', shopId)
          .select()
          .single();
          
        if (error) throw error;
        return data as ShopSettings;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('shop_settings')
          .insert([{
            shop_id: shopId,
            ...settingsData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();
          
        if (error) throw error;
        return data as ShopSettings;
      }
    } catch (error) {
      console.error('Error updating shop settings:', error);
      return null;
    }
  }
}
