
import { supabase } from "@/integrations/supabase/client";
import { 
  Shop, 
  ShopItem, 
  ShopStatus,
  ShopReview,
  Order,
  ShopSettings
} from "../domain/types";

export class ShopRepository {
  
  /**
   * Récupère une boutique par son ID
   */
  async getShopById(id: string): Promise<Shop | null> {
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
    
    if (error) {
      console.error("Erreur lors de la récupération de la boutique:", error);
      return null;
    }
    
    return {
      ...data,
      status: data.status as ShopStatus,
      average_rating: data.average_rating || 0
    } as Shop;
  }
  
  /**
   * Récupère la boutique d'un utilisateur
   */
  async getUserShop(userId: string): Promise<Shop | null> {
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
      if (error.code === 'PGRST116') {
        // Aucune boutique trouvée
        return null;
      }
      console.error("Erreur lors de la récupération de la boutique:", error);
      return null;
    }
    
    return {
      ...data,
      status: data.status as ShopStatus,
      average_rating: data.average_rating || 0
    } as Shop;
  }
  
  /**
   * Récupère toutes les boutiques
   */
  async getAllShops(): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles:user_id (
          username,
          full_name
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Erreur lors de la récupération des boutiques:", error);
      return [];
    }
    
    return data.map(shop => ({
      ...shop,
      status: shop.status as ShopStatus,
      average_rating: shop.average_rating || 0
    })) as Shop[];
  }
  
  /**
   * Récupère les articles d'une boutique
   */
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select(`
        *,
        shops (
          name
        )
      `)
      .eq('shop_id', shopId);
    
    if (error) {
      console.error("Erreur lors de la récupération des articles:", error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      shop_id: item.shop_id,
      name: item.name || 'Article sans nom', // Valeur par défaut
      description: item.description,
      image_url: item.image_url,
      price: item.price,
      original_price: item.original_price,
      stock: item.stock || 1, // Valeur par défaut
      status: item.status as any || 'available',
      created_at: item.created_at,
      updated_at: item.updated_at,
      clothes_id: item.clothes_id,
      shop: item.shops
    })) as ShopItem[];
  }
  
  /**
   * Crée une nouvelle boutique
   */
  async createShop(shop: Omit<Shop, "id" | "created_at" | "updated_at" | "average_rating">): Promise<Shop> {
    const { data, error } = await supabase
      .from('shops')
      .insert({
        user_id: shop.user_id,
        name: shop.name,
        description: shop.description,
        image_url: shop.image_url,
        status: shop.status || 'pending',
        categories: shop.categories || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error("Erreur lors de la création de la boutique:", error);
      throw error;
    }
    
    return {
      ...data,
      status: data.status as ShopStatus,
      average_rating: 0
    } as Shop;
  }
  
  /**
   * Met à jour une boutique
   */
  async updateShop(id: string, shop: Partial<Shop>): Promise<Shop> {
    const { data, error } = await supabase
      .from('shops')
      .update({
        name: shop.name,
        description: shop.description,
        image_url: shop.image_url,
        status: shop.status,
        categories: shop.categories,
        address: shop.address,
        phone: shop.phone,
        website: shop.website,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Erreur lors de la mise à jour de la boutique:", error);
      throw error;
    }
    
    return {
      ...data,
      status: data.status as ShopStatus,
      average_rating: data.average_rating || 0
    } as Shop;
  }
  
  /**
   * Crée un nouvel article
   */
  async createShopItem(item: Omit<ShopItem, "id" | "created_at" | "updated_at">): Promise<ShopItem> {
    const { data, error } = await supabase
      .from('shop_items')
      .insert({
        shop_id: item.shop_id,
        clothes_id: item.clothes_id,
        name: item.name,
        description: item.description,
        image_url: item.image_url,
        price: item.price,
        original_price: item.original_price,
        stock: item.stock,
        status: item.status || 'available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error("Erreur lors de la création de l'article:", error);
      throw error;
    }
    
    return {
      ...data,
      name: data.name || 'Article sans nom',
      stock: data.stock || 1,
      status: data.status as any
    } as ShopItem;
  }
  
  /**
   * Récupère les commandes d'une boutique
   */
  async getShopOrders(shopId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('seller_id', shopId);
    
    if (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      return [];
    }
    
    return data.map(order => ({
      id: order.id,
      shop_id: order.seller_id,
      customer_id: order.buyer_id,
      status: order.status,
      total_amount: order.total_amount,
      delivery_fee: order.shipping_cost || 0,
      payment_status: order.payment_status as any,
      payment_method: order.payment_method,
      delivery_address: order.shipping_address ? {
        street: order.shipping_address.street || '',
        city: order.shipping_address.city || '',
        postal_code: order.shipping_address.postal_code || '',
        country: order.shipping_address.country || ''
      } : {
        street: '',
        city: '',
        postal_code: '',
        country: ''
      },
      created_at: order.created_at,
      updated_at: order.updated_at || order.created_at,
      items: order.order_items.map((item: any) => ({
        id: item.id,
        order_id: item.order_id,
        item_id: item.shop_item_id,
        name: 'Article', // Ce champ serait à récupérer en jointure
        price: item.price_at_time,
        quantity: item.quantity,
        created_at: item.created_at
      }))
    })) as Order[];
  }
  
  /**
   * Récupère les avis d'une boutique
   */
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .select(`
        *,
        profiles:user_id (
          username,
          full_name
        )
      `)
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Erreur lors de la récupération des avis:", error);
      return [];
    }
    
    return data as ShopReview[];
  }
  
  /**
   * Récupère les paramètres d'une boutique
   */
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    // Cette méthode sera implémentée lorsque la table shop_settings sera créée
    // Pour l'instant, retournons des paramètres par défaut
    return {
      id: '',
      shop_id: shopId,
      delivery_options: ['pickup'],
      payment_methods: ['card', 'paypal'],
      auto_accept_orders: false,
      notification_preferences: {
        email: true,
        app: true
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
  
  /**
   * Met à jour le statut d'une boutique
   */
  async updateShopStatus(id: string, status: ShopStatus): Promise<Shop> {
    const { data, error } = await supabase
      .from('shops')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      throw error;
    }
    
    return {
      ...data,
      status: data.status as ShopStatus,
      average_rating: data.average_rating || 0
    } as Shop;
  }
}
