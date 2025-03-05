
import { supabase } from "@/integrations/supabase/client";
import { 
  Shop, 
  ShopItem, 
  ShopStatus, 
  Order, 
  ShopReview,
  ShopSettings
} from "../domain/types";
import { IShopRepository } from "../domain/interfaces/IShopRepository";

/**
 * Implémentation du repository de boutique avec Supabase
 * Couche Infrastructure de la Clean Architecture
 */
export class ShopRepository implements IShopRepository {
  /**
   * Récupère toutes les boutiques
   */
  async getAllShops(): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .order('name');

      if (error) throw error;

      return (data || []).map(shop => ({
        ...shop,
        profiles: shop.profiles || {}
      })) as Shop[];
    } catch (error) {
      console.error("Error fetching shops:", error);
      return [];
    }
  }

  /**
   * Récupère une boutique par son ID
   */
  async getShopById(id: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        throw error;
      }

      return {
        ...data,
        profiles: data.profiles || {}
      } as Shop;
    } catch (error) {
      console.error(`Error fetching shop with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Récupère une boutique par l'ID de son propriétaire
   */
  async getShopByUserId(userId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*, profiles(username, full_name)')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        profiles: data.profiles || {}
      } as Shop;
    } catch (error) {
      console.error(`Error fetching shop for user ${userId}:`, error);
      return null;
    }
  }

  /**
   * Crée une nouvelle boutique
   */
  async createShop(shopData: Omit<Shop, "id" | "created_at" | "updated_at">): Promise<Shop> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .insert({
          name: shopData.name,
          description: shopData.description,
          user_id: shopData.user_id,
          image_url: shopData.image_url,
          status: shopData.status || 'pending',
          address: shopData.address,
          phone: shopData.phone,
          website: shopData.website,
          categories: shopData.categories
        })
        .select()
        .single();

      if (error) throw error;

      return data as Shop;
    } catch (error) {
      console.error("Error creating shop:", error);
      throw error;
    }
  }

  /**
   * Met à jour une boutique
   */
  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .update(shopData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data as Shop;
    } catch (error) {
      console.error("Error updating shop:", error);
      throw error;
    }
  }

  /**
   * Modifie le statut d'une boutique
   */
  async updateShopStatus(id: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shops')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error updating shop status:", error);
      return false;
    }
  }

  /**
   * Supprime une boutique
   */
  async deleteShop(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shops')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error deleting shop:", error);
      return false;
    }
  }

  /**
   * Récupère tous les articles d'une boutique
   */
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*, shops(name)')
        .eq('shop_id', shopId)
        .order('name');

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        shop_id: item.shop_id,
        clothes_id: item.clothes_id,
        name: item.name || '',
        description: item.description || '',
        price: item.price,
        original_price: item.original_price,
        stock: item.stock || 0,
        status: item.status,
        image_url: item.image_url || '',
        created_at: item.created_at,
        updated_at: item.updated_at,
        shop: {
          name: item.shops?.name || ''
        }
      })) as ShopItem[];
    } catch (error) {
      console.error("Error fetching shop items:", error);
      return [];
    }
  }

  /**
   * Récupère un article par son ID
   */
  async getShopItemById(id: string): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return {
        id: data.id,
        shop_id: data.shop_id,
        clothes_id: data.clothes_id,
        name: data.name || '',
        description: data.description || '',
        price: data.price,
        original_price: data.original_price,
        stock: data.stock || 0,
        status: data.status,
        image_url: data.image_url || '',
        created_at: data.created_at,
        updated_at: data.updated_at
      } as ShopItem;
    } catch (error) {
      console.error(`Error fetching shop item with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Crée un nouvel article dans une boutique
   */
  async createShopItem(item: Omit<ShopItem, "id" | "created_at" | "updated_at">): Promise<ShopItem> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert({
          shop_id: item.shop_id,
          clothes_id: item.clothes_id,
          name: item.name,
          description: item.description,
          price: item.price,
          original_price: item.original_price,
          stock: item.stock,
          status: item.status || 'available',
          image_url: item.image_url
        })
        .select()
        .single();

      if (error) throw error;

      return data as ShopItem;
    } catch (error) {
      console.error("Error creating shop item:", error);
      throw error;
    }
  }

  /**
   * Met à jour un article de boutique
   */
  async updateShopItem(id: string, item: Partial<ShopItem>): Promise<ShopItem> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .update(item)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        shop_id: data.shop_id,
        clothes_id: data.clothes_id,
        name: data.name || '',
        description: data.description || '',
        price: data.price,
        original_price: data.original_price,
        stock: data.stock || 0,
        status: data.status,
        image_url: data.image_url || '',
        created_at: data.created_at,
        updated_at: data.updated_at
      } as ShopItem;
    } catch (error) {
      console.error("Error updating shop item:", error);
      throw error;
    }
  }

  /**
   * Supprime un article de boutique
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
      console.error("Error deleting shop item:", error);
      return false;
    }
  }

  /**
   * Met à jour le statut d'un article
   */
  async updateShopItemStatus(id: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_items')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error updating shop item status:", error);
      return false;
    }
  }

  /**
   * Récupère les commandes d'une boutique
   */
  async getShopOrders(shopId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          buyer:buyer_id(username, full_name),
          order_items(*)
        `)
        .eq('seller_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(order => ({
        id: order.id,
        shop_id: order.seller_id, // Mapping seller_id to shop_id
        customer_id: order.buyer_id,
        status: order.status,
        total_amount: order.total_amount,
        delivery_fee: order.shipping_cost || 0,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        delivery_address: order.shipping_address ? {
          street: '',
          city: '',
          postal_code: '',
          country: ''
        } : undefined,
        created_at: order.created_at,
        updated_at: order.created_at, // Using created_at as a fallback
        items: order.order_items || []
      })) as Order[];
    } catch (error) {
      console.error("Error fetching shop orders:", error);
      return [];
    }
  }

  /**
   * Récupère les commandes d'un utilisateur
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          seller:seller_id(id, name),
          order_items(*)
        `)
        .eq('buyer_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(order => ({
        id: order.id,
        shop_id: order.seller_id,
        customer_id: order.buyer_id,
        status: order.status,
        total_amount: order.total_amount,
        delivery_fee: order.shipping_cost || 0,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        delivery_address: order.shipping_address ? {
          street: '',
          city: '',
          postal_code: '',
          country: ''
        } : undefined,
        created_at: order.created_at,
        updated_at: order.created_at,
        items: order.order_items || []
      })) as Order[];
    } catch (error) {
      console.error("Error fetching user orders:", error);
      return [];
    }
  }

  /**
   * Récupère une commande par son ID
   */
  async getOrderById(id: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          buyer:buyer_id(username, full_name),
          seller:seller_id(id, name),
          order_items(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return {
        id: data.id,
        shop_id: data.seller_id,
        customer_id: data.buyer_id,
        status: data.status,
        total_amount: data.total_amount,
        delivery_fee: data.shipping_cost || 0,
        payment_status: data.payment_status,
        payment_method: data.payment_method,
        delivery_address: data.shipping_address ? {
          street: '',
          city: '',
          postal_code: '',
          country: ''
        } : undefined,
        created_at: data.created_at,
        updated_at: data.created_at,
        items: data.order_items || []
      } as Order;
    } catch (error) {
      console.error(`Error fetching order with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Crée une nouvelle commande
   */
  async createOrder(order: Omit<Order, "id" | "created_at" | "updated_at">): Promise<Order> {
    try {
      // Insert the order
      const { data, error } = await supabase
        .from('orders')
        .insert({
          buyer_id: order.customer_id,
          seller_id: order.shop_id,
          status: order.status,
          total_amount: order.total_amount,
          shipping_cost: order.delivery_fee,
          payment_status: order.payment_status,
          payment_method: order.payment_method,
          shipping_address: order.delivery_address
        })
        .select()
        .single();

      if (error) throw error;

      // Insert order items if provided
      if (order.items && order.items.length > 0) {
        const orderItems = order.items.map(item => ({
          order_id: data.id,
          item_id: item.item_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      return {
        ...data,
        items: order.items || [],
        shop_id: data.seller_id,
        customer_id: data.buyer_id,
        delivery_fee: data.shipping_cost || 0,
      } as Order;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  /**
   * Met à jour le statut d'une commande
   */
  async updateOrderStatus(id: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      return false;
    }
  }

  /**
   * Récupère les avis d'une boutique
   */
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select('*, profiles:user_id(username, full_name)')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(review => ({
        ...review,
        profiles: review.profiles || {}
      })) as ShopReview[];
    } catch (error) {
      console.error("Error fetching shop reviews:", error);
      return [];
    }
  }

  /**
   * Ajoute un avis sur une boutique
   */
  async addShopReview(review: Omit<ShopReview, "id" | "created_at" | "updated_at">): Promise<ShopReview> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert(review)
        .select()
        .single();

      if (error) throw error;

      return data as ShopReview;
    } catch (error) {
      console.error("Error adding shop review:", error);
      throw error;
    }
  }

  /**
   * Récupère les paramètres d'une boutique
   */
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    try {
      // Check if table exists first, since we just created it
      const { data: settingsData, error } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .maybeSingle();

      if (error) {
        // It's possible the table doesn't exist yet
        console.error("Error fetching shop settings:", error);
        return null;
      }

      if (!settingsData) {
        // Create default settings
        const defaultSettings = {
          shop_id: shopId,
          delivery_options: ['pickup', 'delivery', 'both'],
          payment_methods: ['card', 'paypal', 'bank_transfer', 'cash'],
          auto_accept_orders: false,
          notification_preferences: {
            email: true,
            app: true
          }
        };

        try {
          const { data: newSettings, error: createError } = await supabase
            .from('shop_settings')
            .insert(defaultSettings)
            .select()
            .single();

          if (createError) throw createError;

          return newSettings as ShopSettings;
        } catch (createErr) {
          console.error("Error creating default shop settings:", createErr);
          // Return the default settings anyway
          return {
            id: 'temp-' + Date.now(),
            ...defaultSettings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        }
      }

      return settingsData as ShopSettings;
    } catch (error) {
      console.error("Error getting shop settings:", error);
      return null;
    }
  }

  /**
   * Crée les paramètres d'une boutique
   */
  async createShopSettings(settings: Omit<ShopSettings, "id" | "created_at" | "updated_at">): Promise<ShopSettings> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .insert(settings)
        .select()
        .single();

      if (error) throw error;

      return data as ShopSettings;
    } catch (error) {
      console.error("Error creating shop settings:", error);
      throw error;
    }
  }

  /**
   * Met à jour les paramètres d'une boutique
   */
  async updateShopSettings(id: string, settings: Partial<ShopSettings>): Promise<boolean> {
    try {
      // Create a copy to remove the id to avoid PGRST116 error
      const settingsCopy = { ...settings };
      delete settingsCopy.id;

      const { error } = await supabase
        .from('shop_settings')
        .update(settingsCopy)
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error updating shop settings:", error);
      return false;
    }
  }
}
