import { supabase } from '@/integrations/supabase/client';
import { Shop, mapShop } from '../../domain/types';
import { IShopRepository } from '../../domain/interfaces/IShopRepository';

export class ShopRepository implements IShopRepository {
  // Shop operations
  async getShopById(id: string): Promise<Shop | null> {
    try {
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

      if (error) throw error;
      
      return mapShop(data);
    } catch (error) {
      console.error('Error fetching shop by ID:', error);
      return null;
    }
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    try {
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

      if (error) throw error;
      
      return mapShop(data);
    } catch (error) {
      console.error('Error fetching shop by user ID:', error);
      return null;
    }
  }

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
      
      return mapShop(data);
    } catch (error) {
      console.error('Error updating shop:', error);
      return null;
    }
  }

  async createShop(shop: Partial<Shop>): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .insert({
          ...shop,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: shop.status || 'pending',
          average_rating: 0
        })
        .select()
        .single();

      if (error) throw error;
      
      return mapShop(data);
    } catch (error) {
      console.error('Error creating shop:', error);
      return null;
    }
  }

  // Shop settings operations
  async getShopSettings(shopId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching shop settings:', error);
      return null;
    }
  }

  async updateShopSettings(shopId: string, settings: any): Promise<any> {
    try {
      // Check if settings already exist
      const { data: existingSettings } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();

      if (existingSettings) {
        // Update existing settings
        const { data, error } = await supabase
          .from('shop_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString()
          })
          .eq('shop_id', shopId)
          .select()
          .single();

        if (error) throw error;
        
        return data;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('shop_settings')
          .insert({
            ...settings,
            shop_id: shopId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        
        return data;
      }
    } catch (error) {
      console.error('Error updating shop settings:', error);
      return null;
    }
  }

  // Additional methods that need to be implemented to satisfy the interface
  async getShopsByStatus(status: string): Promise<Shop[]> {
    try {
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

      if (error) throw error;
      
      return data.map(shop => mapShop(shop)).filter(Boolean) as Shop[];
    } catch (error) {
      console.error('Error fetching shops by status:', error);
      return [];
    }
  }

  async deleteShop(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shops')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting shop:', error);
      return false;
    }
  }

  // Other required methods from interface that will be implemented in their specific repositories
  async getUserShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      return data.map(shop => mapShop(shop)).filter(Boolean) as Shop[];
    } catch (error) {
      console.error('Error fetching user shops:', error);
      return [];
    }
  }
}
