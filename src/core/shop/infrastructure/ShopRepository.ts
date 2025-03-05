
import { supabase } from '@/integrations/supabase/client';
import { 
  Shop, 
  ShopItem, 
  ShopStatus, 
  ShopItemStatus, 
  CartItem, 
  Order, 
  OrderItem, 
  ShopReview,
  ShopSettings,
  DeliveryOption,
  PaymentMethod,
  OrderStatus,
  PaymentStatus
} from '../domain/types';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

export class ShopRepository implements IShopRepository {
  // Boutiques
  async createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'average_rating'>): Promise<Shop> {
    const { data, error } = await supabase
      .from('shops')
      .insert({
        user_id: shopData.user_id,
        name: shopData.name,
        description: shopData.description,
        image_url: shopData.image_url,
        status: shopData.status || 'pending',
        average_rating: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) throw error;

    // Cast supabase data to Shop type, handling string to ShopStatus conversion
    return {
      ...data,
      status: data.status as ShopStatus
    } as Shop;
  }

  async updateShop(shopData: Partial<Shop> & { id: string }): Promise<Shop> {
    const { data, error } = await supabase
      .from('shops')
      .update({
        ...shopData,
        updated_at: new Date().toISOString()
      })
      .eq('id', shopData.id)
      .select('*')
      .single();

    if (error) throw error;

    return {
      ...data,
      status: data.status as ShopStatus
    } as Shop;
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw error;
    }

    return {
      ...data,
      status: data.status as ShopStatus,
      profiles: data.profiles
    } as Shop;
  }

  async getShopById(shopId: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `)
      .eq('id', shopId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return {
      ...data,
      status: data.status as ShopStatus,
      profiles: data.profiles
    } as Shop;
  }

  async getAllShops(): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(shop => ({
      ...shop,
      status: shop.status as ShopStatus,
      profiles: shop.profiles
    })) as Shop[];
  }

  // Articles de boutique
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select(`
        *,
        shops (name)
      `)
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform the data to match ShopItem interface
    return data.map(item => ({
      id: item.id,
      shop_id: item.shop_id,
      name: item.name || '',
      description: item.description || '',
      price: item.price,
      original_price: item.original_price,
      stock: item.stock || 0,
      status: item.status as ShopItemStatus,
      image_url: item.image_url,
      created_at: item.created_at,
      updated_at: item.updated_at,
      clothes_id: item.clothes_id,
      shop: {
        name: item.shops?.name || ''
      }
    })) as ShopItem[];
  }

  async createShopItem(itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem> {
    const { data, error } = await supabase
      .from('shop_items')
      .insert({
        shop_id: itemData.shop_id,
        name: itemData.name,
        description: itemData.description,
        price: itemData.price,
        original_price: itemData.original_price,
        stock: itemData.stock,
        status: itemData.status || 'available',
        image_url: itemData.image_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      status: data.status as ShopItemStatus,
      name: data.name || '',
      description: data.description || '',
      stock: data.stock || 0
    } as ShopItem;
  }

  async getShopItemById(itemId: string): Promise<ShopItem | null> {
    const { data, error } = await supabase
      .from('shop_items')
      .select(`
        *,
        shops (name)
      `)
      .eq('id', itemId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return {
      id: data.id,
      shop_id: data.shop_id,
      name: data.name || '',
      description: data.description || '',
      price: data.price,
      original_price: data.original_price,
      stock: data.stock || 0,
      status: data.status as ShopItemStatus,
      image_url: data.image_url,
      created_at: data.created_at,
      updated_at: data.updated_at,
      clothes_id: data.clothes_id,
      shop: {
        name: data.shops?.name || ''
      }
    } as ShopItem;
  }

  async updateShopItem(itemData: Partial<ShopItem> & { id: string }): Promise<ShopItem> {
    const { data, error } = await supabase
      .from('shop_items')
      .update({
        ...itemData,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemData.id)
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      status: data.status as ShopItemStatus,
      name: data.name || '',
      stock: data.stock || 0
    } as ShopItem;
  }

  async deleteShopItem(itemId: string): Promise<void> {
    const { error } = await supabase
      .from('shop_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
  }

  // Commandes
  async getShopOrders(shopId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform data to match Order interface
    return data.map(order => {
      const deliveryAddress = typeof order.delivery_address === 'object' ? order.delivery_address : {
        street: '',
        city: '',
        postal_code: '',
        country: ''
      };
      
      return {
        id: order.id,
        shop_id: order.shop_id,
        customer_id: order.buyer_id,
        status: order.status as OrderStatus,
        total_amount: order.total_amount,
        delivery_fee: order.shipping_fee || 0,
        payment_status: order.payment_status as PaymentStatus,
        payment_method: order.payment_method || '',
        delivery_address: {
          street: deliveryAddress.street || '',
          city: deliveryAddress.city || '',
          postal_code: deliveryAddress.postal_code || '',
          country: deliveryAddress.country || ''
        },
        created_at: order.created_at,
        updated_at: order.updated_at || order.created_at,
        items: (order.order_items || []).map((item: any) => ({
          id: item.id,
          order_id: item.order_id,
          item_id: item.shop_item_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          created_at: item.created_at
        }))
      } as Order;
    });
  }

  // Paramètres de boutique
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    const { data, error } = await supabase
      .from('shop_settings')
      .select('*')
      .eq('shop_id', shopId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Pas de paramètres, créer des paramètres par défaut
        return this.createShopSettings({
          shop_id: shopId,
          delivery_options: ['pickup'],
          payment_methods: ['card'],
          auto_accept_orders: false,
          notification_preferences: {
            email: true,
            app: true
          }
        });
      }
      throw error;
    }

    return {
      id: data.id,
      shop_id: data.shop_id,
      delivery_options: data.delivery_options as DeliveryOption[],
      payment_methods: data.payment_methods as PaymentMethod[],
      auto_accept_orders: data.auto_accept_orders,
      notification_preferences: data.notification_preferences,
      created_at: data.created_at,
      updated_at: data.updated_at
    } as ShopSettings;
  }

  async createShopSettings(settings: Omit<ShopSettings, 'id' | 'created_at' | 'updated_at'>): Promise<ShopSettings> {
    const { data, error } = await supabase
      .from('shop_settings')
      .insert({
        shop_id: settings.shop_id,
        delivery_options: settings.delivery_options,
        payment_methods: settings.payment_methods,
        auto_accept_orders: settings.auto_accept_orders,
        notification_preferences: settings.notification_preferences,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      shop_id: data.shop_id,
      delivery_options: data.delivery_options as DeliveryOption[],
      payment_methods: data.payment_methods as PaymentMethod[],
      auto_accept_orders: data.auto_accept_orders,
      notification_preferences: data.notification_preferences,
      created_at: data.created_at,
      updated_at: data.updated_at
    } as ShopSettings;
  }

  async updateShopSettings(settings: Partial<ShopSettings> & { shop_id: string }): Promise<ShopSettings> {
    // Vérifier si les paramètres existent
    const existing = await this.getShopSettings(settings.shop_id);
    
    if (!existing) {
      // Créer de nouveaux paramètres
      return this.createShopSettings({
        shop_id: settings.shop_id,
        delivery_options: settings.delivery_options || ['pickup'],
        payment_methods: settings.payment_methods || ['card'],
        auto_accept_orders: settings.auto_accept_orders || false,
        notification_preferences: settings.notification_preferences || {
          email: true,
          app: true
        }
      });
    }
    
    // Mettre à jour les paramètres existants
    const { data, error } = await supabase
      .from('shop_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString()
      })
      .eq('shop_id', settings.shop_id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      shop_id: data.shop_id,
      delivery_options: data.delivery_options as DeliveryOption[],
      payment_methods: data.payment_methods as PaymentMethod[],
      auto_accept_orders: data.auto_accept_orders,
      notification_preferences: data.notification_preferences,
      created_at: data.created_at,
      updated_at: data.updated_at
    } as ShopSettings;
  }

  // Avis
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
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(review => ({
      ...review,
      profiles: review.profiles
    })) as ShopReview[];
  }
}
