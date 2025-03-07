
import { supabase } from '@/integrations/supabase/client';
import { IShopItemRepository } from '../../domain/interfaces/IShopItemRepository';
import { 
  ShopItem,
  mapShopItem,
  mapShopItems,
  isShopItemStatus
} from '../../domain/types';

/**
 * Implémentation du repository pour les articles de boutique
 */
export class ShopItemRepository implements IShopItemRepository {
  /**
   * Récupère les articles d'une boutique
   */
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop:shop_id (
            name,
            id
          )
        `)
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error(`Error fetching items for shop ${shopId}:`, error);
        return [];
      }
      
      return mapShopItems(data || []);
    } catch (error) {
      console.error(`Error in getShopItems for ${shopId}:`, error);
      return [];
    }
  }
  
  /**
   * Récupère un article par son ID
   */
  async getShopItemById(itemId: string): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop:shop_id (
            name,
            id
          )
        `)
        .eq('id', itemId)
        .single();
      
      if (error) {
        console.error(`Error fetching item ${itemId}:`, error);
        return null;
      }
      
      return mapShopItem(data);
    } catch (error) {
      console.error(`Error in getShopItemById for ${itemId}:`, error);
      return null;
    }
  }
  
  /**
   * Crée un nouvel article de boutique
   */
  async createShopItem(item: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem | null> {
    try {
      if (!item.shop_id || !item.price) {
        console.error('Required fields missing for shop item creation');
        return null;
      }
      
      // Validation - s'assurer que les champs requis sont présents
      const insertData = {
        shop_id: item.shop_id,
        name: item.name || 'Untitled Item',
        price: item.price,
        stock: item.stock || 0,
        status: isShopItemStatus(item.status) ? item.status : 'available',
        description: item.description,
        image_url: item.image_url,
        original_price: item.original_price,
        clothes_id: item.clothes_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('shop_items')
        .insert(insertData)
        .select(`
          *,
          shop:shop_id (
            name, 
            id
          )
        `)
        .single();
      
      if (error) {
        console.error('Error creating shop item:', error);
        return null;
      }
      
      return mapShopItem(data);
    } catch (error) {
      console.error('Error in createShopItem:', error);
      return null;
    }
  }
  
  /**
   * Met à jour un article de boutique
   */
  async updateShopItem(itemId: string, updates: Partial<ShopItem>): Promise<ShopItem | null> {
    try {
      // Validation et préparation des données
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      // Si status est fourni, vérifier qu'il est valide
      if (updates.status && !isShopItemStatus(updates.status)) {
        console.error(`Invalid item status: ${updates.status}`);
        return null;
      }
      
      const { data, error } = await supabase
        .from('shop_items')
        .update(updateData)
        .eq('id', itemId)
        .select(`
          *,
          shop:shop_id (
            name,
            id
          )
        `)
        .single();
      
      if (error) {
        console.error(`Error updating shop item ${itemId}:`, error);
        return null;
      }
      
      return mapShopItem(data);
    } catch (error) {
      console.error(`Error in updateShopItem for ${itemId}:`, error);
      return null;
    }
  }
  
  /**
   * Supprime un article de boutique
   */
  async deleteShopItem(itemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_items')
        .delete()
        .eq('id', itemId);
      
      if (error) {
        console.error(`Error deleting shop item ${itemId}:`, error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Error in deleteShopItem for ${itemId}:`, error);
      return false;
    }
  }
}
