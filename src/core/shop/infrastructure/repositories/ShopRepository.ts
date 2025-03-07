
import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../../domain/interfaces/IShopRepository';
import { 
  Shop, 
  ShopItem, 
  ShopSettings, 
  ShopReview, 
  Order,
  mapShop,
  mapShopItem,
  mapShopItems,
  mapSettings,
  mapOrder,
  mapOrders,
  isShopStatus
} from '../../domain/types';

/**
 * Implémentation du repository de boutique utilisant Supabase
 */
export class ShopRepository implements IShopRepository {
  /**
   * Récupère une boutique par son ID
   */
  async getShopById(shopId: string): Promise<Shop | null> {
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
        .eq('id', shopId)
        .single();
      
      if (error) {
        console.error(`Error fetching shop ${shopId}:`, error);
        return null;
      }
      
      return mapShop(data);
    } catch (error) {
      console.error(`Error in getShopById for ${shopId}:`, error);
      return null;
    }
  }
  
  /**
   * Récupère une boutique par l'ID de l'utilisateur
   */
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
      
      if (error) {
        console.error(`Error fetching shop for user ${userId}:`, error);
        return null;
      }
      
      return mapShop(data);
    } catch (error) {
      console.error(`Error in getShopByUserId for ${userId}:`, error);
      return null;
    }
  }
  
  /**
   * Récupère les paramètres d'une boutique
   */
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();
      
      if (error) {
        console.error(`Error fetching settings for shop ${shopId}:`, error);
        return null;
      }
      
      return mapSettings(data);
    } catch (error) {
      console.error(`Error in getShopSettings for ${shopId}:`, error);
      return null;
    }
  }
  
  /**
   * Crée ou met à jour les paramètres d'une boutique
   */
  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    try {
      // Validation - s'assurer que shop_id est présent
      const updateData = {
        ...settings,
        shop_id: shopId,
        updated_at: new Date().toISOString()
      };
      
      // Vérifier si les paramètres existent déjà
      const { data: existingSettings } = await supabase
        .from('shop_settings')
        .select('id')
        .eq('shop_id', shopId)
        .single();
      
      let result;
      
      if (existingSettings?.id) {
        // Mise à jour des paramètres existants
        result = await supabase
          .from('shop_settings')
          .update(updateData)
          .eq('id', existingSettings.id)
          .select()
          .single();
      } else {
        // Création de nouveaux paramètres
        result = await supabase
          .from('shop_settings')
          .insert({
            ...updateData,
            created_at: new Date().toISOString()
          })
          .select()
          .single();
      }
      
      if (result.error) {
        console.error(`Error updating settings for shop ${shopId}:`, result.error);
        return null;
      }
      
      return mapSettings(result.data);
    } catch (error) {
      console.error(`Error in updateShopSettings for ${shopId}:`, error);
      return null;
    }
  }
  
  /**
   * Met à jour une boutique
   */
  async updateShop(shopId: string, shopData: Partial<Shop>): Promise<Shop | null> {
    try {
      // Validation - s'assurer que les champs requis sont présents
      const updateData = {
        ...shopData,
        updated_at: new Date().toISOString()
      };
      
      // Si status est fourni, vérifier qu'il est valide
      if (shopData.status && !isShopStatus(shopData.status)) {
        console.error(`Invalid shop status: ${shopData.status}`);
        return null;
      }
      
      const { data, error } = await supabase
        .from('shops')
        .update(updateData)
        .eq('id', shopId)
        .select(`
          *,
          profiles:user_id (
            username,
            full_name
          )
        `)
        .single();
      
      if (error) {
        console.error(`Error updating shop ${shopId}:`, error);
        return null;
      }
      
      return mapShop(data);
    } catch (error) {
      console.error(`Error in updateShop for ${shopId}:`, error);
      return null;
    }
  }
}
