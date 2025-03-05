
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopItem, ShopReview, ShopSettings, Order } from '../domain/types';

export class ShopRepository {
  /**
   * Récupère la boutique d'un utilisateur
   */
  async getUserShop(userId: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération de la boutique:', error);
      return null;
    }

    return data;
  }

  /**
   * Crée une nouvelle boutique
   */
  async createShop(shop: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'average_rating'>): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .insert([{ 
        ...shop, 
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création de la boutique:', error);
      return null;
    }

    return data;
  }

  /**
   * Met à jour une boutique
   */
  async updateShop(shopId: string, shopData: Partial<Shop>): Promise<boolean> {
    const { error } = await supabase
      .from('shops')
      .update({ 
        ...shopData, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', shopId);

    if (error) {
      console.error('Erreur lors de la mise à jour de la boutique:', error);
      return false;
    }

    return true;
  }

  /**
   * Récupère toutes les boutiques
   */
  async getAllShops(status?: string): Promise<Shop[]> {
    let query = supabase
      .from('shops')
      .select('*, profiles:user_id (username, full_name)');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des boutiques:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Récupère les articles d'une boutique
   */
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Ajoute un article à une boutique
   */
  async createShopItem(item: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem | null> {
    const { data, error } = await supabase
      .from('shop_items')
      .insert([{
        ...item,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      return null;
    }

    return data;
  }

  /**
   * Récupère les commandes d'une boutique
   */
  async getShopOrders(shopId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items(*)
      `)
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Récupère les avis d'une boutique
   */
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .select(`
        *,
        profiles:user_id (username, full_name, avatar_url)
      `)
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des avis:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Récupère les paramètres d'une boutique
   */
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    const { data, error } = await supabase
      .from('shop_settings')
      .select('*')
      .eq('shop_id', shopId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Erreur lors de la récupération des paramètres de la boutique:', error);
      return null;
    }

    return data;
  }
}

export const shopRepository = new ShopRepository();
