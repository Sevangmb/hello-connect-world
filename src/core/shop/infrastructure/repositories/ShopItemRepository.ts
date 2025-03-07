
import { supabase } from '@/integrations/supabase/client';
import { ShopItem, mapShopItem, mapShopItems } from '../../domain/types';

export class ShopItemRepository {
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*, shops:shop_id(name,id)')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }

    return mapShopItems(data || []);
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*, shops:shop_id(name,id)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching shop item:', error);
      return null;
    }

    return mapShopItem(data);
  }

  async createShopItem(item: Omit<ShopItem, "id" | "created_at" | "updated_at">): Promise<ShopItem | null> {
    const { data, error } = await supabase
      .from('shop_items')
      .insert({
        shop_id: item.shop_id,
        name: item.name,
        description: item.description,
        image_url: item.image_url,
        price: item.price,
        original_price: item.original_price,
        stock: item.stock,
        status: item.status
      })
      .select('*, shops:shop_id(name,id)')
      .single();

    if (error) {
      console.error('Error creating shop item:', error);
      return null;
    }

    return mapShopItem(data);
  }

  async updateShopItem(id: string, updates: Partial<ShopItem>): Promise<ShopItem | null> {
    const { data, error } = await supabase
      .from('shop_items')
      .update(updates)
      .eq('id', id)
      .select('*, shops:shop_id(name,id)')
      .single();

    if (error) {
      console.error('Error updating shop item:', error);
      return null;
    }

    return mapShopItem(data);
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
}
