
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopItem, Order, ShopSettings, ShopReview, ShopStatus } from '../domain/types';

export class ShopRepository {
  /**
   * Récupérer une boutique par son ID
   */
  async getShopById(shopId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (username, full_name)
        `)
        .eq('id', shopId)
        .single();

      if (error) throw error;
      if (!data) return null;

      // Convert string status to ShopStatus
      const status = data.status as ShopStatus;
      
      return {
        ...data,
        status,
      } as Shop;
    } catch (error) {
      console.error('Error fetching shop:', error);
      return null;
    }
  }

  /**
   * Récupérer une boutique par l'ID de l'utilisateur
   */
  async getShopByUserId(userId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (username, full_name)
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        // Si l'erreur est "No rows found", c'est normal si l'utilisateur n'a pas de boutique
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      // Convert string status to ShopStatus
      const status = data.status as ShopStatus;
      
      return {
        ...data,
        status,
      } as Shop;
    } catch (error) {
      console.error('Error fetching shop by user ID:', error);
      return null;
    }
  }

  /**
   * Récupérer toutes les boutiques
   */
  async getAllShops(): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (username, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert string statuses to ShopStatus
      return (data || []).map(shop => ({
        ...shop,
        status: shop.status as ShopStatus
      })) as Shop[];
    } catch (error) {
      console.error('Error fetching all shops:', error);
      return [];
    }
  }

  /**
   * Récupérer les articles d'une boutique
   */
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('shop_id', shopId);

      if (error) throw error;

      // Convert database items to ShopItem with required fields
      return (data || []).map(item => ({
        ...item,
        name: item.name || `Item ${item.id}`,
        stock: item.stock || 0,
        status: (item.status as 'available' | 'sold_out' | 'archived') || 'available'
      })) as ShopItem[];
    } catch (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }
  }

  /**
   * Créer un nouvel article dans la boutique
   */
  async createShopItem(item: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert({
          shop_id: item.shop_id,
          name: item.name,
          description: item.description,
          price: item.price,
          original_price: item.original_price,
          stock: item.stock,
          image_url: item.image_url,
          status: item.status,
          clothes_id: item.clothes_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return data as unknown as ShopItem;
    } catch (error) {
      console.error('Error creating shop item:', error);
      return null;
    }
  }

  /**
   * Récupérer les commandes d'une boutique
   */
  async getShopOrders(shopId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert database orders to domain Orders
      return (data || []).map(order => ({
        id: order.id,
        shop_id: order.shop_id,
        customer_id: order.buyer_id,
        status: order.status as 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned',
        total_amount: order.total_amount,
        delivery_fee: order.shipping_fee || 0,
        payment_status: order.payment_status as 'pending' | 'paid' | 'refunded' | 'failed',
        delivery_address: {
          street: order.shipping_address?.street || '',
          city: order.shipping_address?.city || '',
          postal_code: order.shipping_address?.postal_code || '',
          country: order.shipping_address?.country || '',
        },
        delivery_method: order.shipping_method || '',
        created_at: order.created_at,
        updated_at: order.updated_at,
        items: order.order_items || [],
        buyer_id: order.buyer_id
      }));
    } catch (error) {
      console.error('Error fetching shop orders:', error);
      return [];
    }
  }

  /**
   * Récupérer les paramètres d'une boutique
   */
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    try {
      // Check if the shop_settings table exists
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();

      if (error) {
        // If it's just "not found", return default settings
        if (error.code === 'PGRST116') {
          return {
            shop_id: shopId,
            delivery_options: [],
            payment_methods: [{ id: 'card', name: 'Carte bancaire', is_enabled: true }],
            auto_accept_orders: false,
            notification_preferences: {
              new_order: true,
              order_status_change: true,
              low_stock: true,
              email: true,
              in_app: true
            },
            updated_at: new Date().toISOString()
          };
        }
        throw error;
      }

      return data as unknown as ShopSettings;
    } catch (error) {
      console.error('Error fetching shop settings:', error);
      // Return default settings on error
      return {
        shop_id: shopId,
        delivery_options: [],
        payment_methods: [{ id: 'card', name: 'Carte bancaire', is_enabled: true }],
        auto_accept_orders: false,
        notification_preferences: {
          new_order: true,
          order_status_change: true,
          low_stock: true,
          email: true,
          in_app: true
        },
        updated_at: new Date().toISOString()
      };
    }
  }

  /**
   * Créer une nouvelle boutique
   */
  async createShop(shop: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'average_rating'>): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .insert({
          name: shop.name,
          description: shop.description,
          user_id: shop.user_id,
          image_url: shop.image_url,
          status: shop.status || 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
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
   * Mettre à jour le statut d'une boutique
   */
  async updateShopStatus(shopId: string, status: ShopStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shops')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', shopId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating shop status:', error);
      return false;
    }
  }

  /**
   * Récupérer les avis d'une boutique
   */
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select(`
          *,
          profiles:user_id (username, full_name)
        `)
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as unknown as ShopReview[];
    } catch (error) {
      console.error('Error fetching shop reviews:', error);
      return [];
    }
  }
}

// Exporter une instance unique pour toute l'application
export const shopRepository = new ShopRepository();
