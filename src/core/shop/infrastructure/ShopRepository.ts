import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { 
  Shop, 
  ShopItem, 
  ShopReview, 
  ShopSettings, 
  DeliveryOption, 
  PaymentMethod, 
  Order, 
  OrderStatus,
  mapShopFromDB,
  mapDeliveryOptions,
  mapPaymentMethods,
  mapSettings,
  isShopItemStatus,
  ShopItemStatus,
  mapShopItems,
  CartItem,
  DbCartItem,
  mapOrders
} from '../domain/types';

export class ShopRepository implements IShopRepository {
  async getShopByUserId(userId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles(username, full_name)
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching shop by user ID:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      return mapShopFromDB(data);
    } catch (error) {
      console.error('Error fetching shop by user ID:', error);
      return null;
    }
  }

  async createShop(shopData: Partial<Shop>): Promise<Shop> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .insert([shopData])
        .select()
        .single();

      if (error) {
        console.error('Error creating shop:', error);
        throw new Error(error.message);
      }

      return mapShopFromDB(data);
    } catch (error) {
      console.error('Error creating shop:', error);
      throw error;
    }
  }

  async updateShop(shopId: string, shopData: Partial<Shop>): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .update(shopData)
        .eq('id', shopId)
        .select()
        .single();

      if (error) {
        console.error('Error updating shop:', error);
        return null;
      }

      return mapShopFromDB(data);
    } catch (error) {
      console.error('Error updating shop:', error);
      return null;
    }
  }

  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop:shops(name, id)
        `)
        .eq('shop_id', shopId);

      if (error) {
        console.error('Error fetching shop items:', error);
        return [];
      }

      return mapShopItems(data);
    } catch (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }
  }

  async getAllShopItems(): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop:shops(name, id)
        `);

      if (error) {
        console.error('Error fetching all shop items:', error);
        return [];
      }

      return mapShopItems(data);
    } catch (error) {
      console.error('Error fetching all shop items:', error);
      return [];
    }
  }

  async createShopItem(item: Partial<ShopItem>): Promise<ShopItem> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert([item])
        .select(`
          *,
          shop:shops(name, id)
        `)
        .single();

      if (error) {
        console.error('Error creating shop item:', error);
        throw new Error(error.message);
      }

      return {
        ...data,
        shop: data.shop || { name: 'Unknown' },
        status: isShopItemStatus(data.status) ? data.status : 'available'
      };
    } catch (error) {
      console.error('Error creating shop item:', error);
      throw error;
    }
  }

  async getShopItemById(itemId: string): Promise<ShopItem | null> {
  try {
    const { data, error } = await supabase
      .from('shop_items')
      .select(`
        *,
        shop:shops(name, id)
      `)
      .eq('id', itemId)
      .single();

    if (error) throw error;
    if (!data) return null;

    // Manually map the data to avoid deep type instantiation
    const shopItem: ShopItem = {
      id: data.id,
      shop_id: data.shop_id,
      name: data.name,
      description: data.description || '',
      image_url: data.image_url,
      price: data.price,
      original_price: data.original_price,
      stock: data.stock,
      status: isShopItemStatus(data.status) ? data.status : 'available',
      created_at: data.created_at,
      updated_at: data.updated_at,
      clothes_id: data.clothes_id,
      shop: { 
        name: data.shop?.name || 'Unknown',
        id: data.shop?.id || 'unknown'
      }
    };

    return shopItem;
  } catch (error) {
    console.error('Error fetching shop item:', error);
    return null;
  }
}

  async updateShopItem(itemId: string, itemData: Partial<ShopItem>): Promise<ShopItem | null> {
  try {
    const { data, error } = await supabase
      .from('shop_items')
      .update(itemData)
      .eq('id', itemId)
      .select(`
        *,
        shop:shops(name, id)
      `)
      .single();

    if (error) throw error;
    if (!data) return null;

    // Manually map the data to avoid deep type instantiation
    const shopItem: ShopItem = {
      id: data.id,
      shop_id: data.shop_id,
      name: data.name,
      description: data.description || '',
      image_url: data.image_url,
      price: data.price,
      original_price: data.original_price,
      stock: data.stock,
      status: isShopItemStatus(data.status) ? data.status : 'available',
      created_at: data.created_at,
      updated_at: data.updated_at,
      clothes_id: data.clothes_id,
      shop: { 
        name: data.shop?.name || 'Unknown',
        id: data.shop?.id || 'unknown'
      }
    };

    return shopItem;
  } catch (error) {
    console.error('Error updating shop item:', error);
    return null;
  }
}

  async deleteShopItem(itemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error('Error deleting shop item:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting shop item:', error);
      return false;
    }
  }

  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select(`
          *,
          profiles(username, full_name)
        `)
        .eq('shop_id', shopId);

      if (error) {
        console.error('Error fetching shop reviews:', error);
        return [];
      }

      return data as ShopReview[];
    } catch (error) {
      console.error('Error fetching shop reviews:', error);
      return [];
    }
  }

  async createShopReview(review: Partial<ShopReview>): Promise<ShopReview> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert([review])
        .select(`
          *,
          profiles(username, full_name)
        `)
        .single();

      if (error) {
        console.error('Error creating shop review:', error);
        throw new Error(error.message);
      }

      return data as ShopReview;
    } catch (error) {
      console.error('Error creating shop review:', error);
      throw error;
    }
  }

  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('shop_id', shopId)
        .single();

      if (error) {
        console.error('Error fetching shop settings:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      return mapSettings(data);
    } catch (error) {
      console.error('Error fetching shop settings:', error);
      return null;
    }
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .update(settings)
        .eq('shop_id', shopId)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating shop settings:', error);
        return null;
      }

      return mapSettings(data);
    } catch (error) {
      console.error('Error updating shop settings:', error);
      return null;
    }
  }

  async getAllShops(): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles(username, full_name)
        `);

      if (error) {
        console.error('Error fetching all shops:', error);
        return [];
      }

      return data.map(mapShopFromDB);
    } catch (error) {
      console.error('Error fetching all shops:', error);
      return [];
    }
  }

  async getShopById(shopId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles(username, full_name)
        `)
        .eq('id', shopId)
        .single();

      if (error) {
        console.error('Error fetching shop by ID:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      return mapShopFromDB(data);
    } catch (error) {
      console.error('Error fetching shop by ID:', error);
      return null;
    }
  }

  async addShopItems(items: Partial<ShopItem>[]): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert(items)
        .select(`
          *,
          shop:shops(name, id)
        `);

      if (error) {
        console.error('Error adding shop items:', error);
        throw new Error(error.message);
      }

      return mapShopItems(data);
    } catch (error) {
      console.error('Error adding shop items:', error);
      throw error;
    }
  }

  async updateShopItemStatus(itemId: string, status: string): Promise<boolean> {
    try {
      if (!isShopItemStatus(status)) {
        console.error('Invalid shop item status:', status);
        return false;
      }

      const { error } = await supabase
        .from('shop_items')
        .update({ status })
        .eq('id', itemId);

      if (error) {
        console.error('Error updating shop item status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating shop item status:', error);
      return false;
    }
  }

  async getShopOrders(shopId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('shop_id', shopId);

      if (error) {
        console.error('Error fetching shop orders:', error);
        return [];
      }

      return mapOrders(data);
    } catch (error) {
      console.error('Error fetching shop orders:', error);
      return [];
    }
  }

  async getOrdersByShopId(shopId: string, status?: OrderStatus): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .eq('shop_id', shopId);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        console.error(`Error fetching orders for shop ${shopId} with status ${status}:`, error);
        return [];
      }

      return mapOrders(data);
    } catch (error) {
      console.error(`Error fetching orders for shop ${shopId} with status ${status}:`, error);
      return [];
    }
  }

  async getUserOrders(userId: string, status?: OrderStatus): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .eq('customer_id', userId);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        console.error(`Error fetching orders for user ${userId} with status ${status}:`, error);
        return [];
      }

      return mapOrders(data);
    } catch (error) {
      console.error(`Error fetching orders for user ${userId} with status ${status}:`, error);
      return [];
    }
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        throw new Error(error.message);
      }

      return data as Order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  async getUserFavoriteShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select(`
          shop:shops(
            *,
            profiles(username, full_name)
          )
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching favorite shops:', error);
        return [];
      }

      if (!data) {
        return [];
      }

      // Extract shop data from the nested structure
      const favoriteShops = data.map(item => item.shop).filter(shop => shop !== null);

      return favoriteShops.map(mapShopFromDB);
    } catch (error) {
      console.error('Error fetching favorite shops:', error);
      return [];
    }
  }

  async isShopFavorited(shopId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select('*')
        .eq('shop_id', shopId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error checking if shop is favorited:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking if shop is favorited:', error);
      return false;
    }
  }

  async toggleShopFavorite(shopId: string, userId: string): Promise<boolean> {
    try {
      const isFavorited = await this.isShopFavorited(shopId, userId);

      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorite_shops')
          .delete()
          .eq('shop_id', shopId)
          .eq('user_id', userId);

        if (error) {
          console.error('Error removing shop from favorites:', error);
          return false;
        }

        return true;
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorite_shops')
          .insert([{ shop_id, user_id: userId }]);

        if (error) {
          console.error('Error adding shop to favorites:', error);
          return false;
        }

        return true;
      }
    } catch (error) {
      console.error('Error toggling shop favorite:', error);
      return false;
    }
  }

  async addToCart(userId: string, shopItemId: string, quantity: number): Promise<boolean> {
    try {
      // Check if the item is already in the cart
      const { data: existingCartItem, error: selectError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('shop_item_id', shopItemId)
        .single();

      if (selectError && selectError.code !== 'PGRST116') { // Ignore "no data found" error
        console.error('Error checking existing cart item:', selectError);
        return false;
      }

      if (existingCartItem) {
        // If the item exists, update the quantity
        const newQuantity = existingCartItem.quantity + quantity;

        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('user_id', userId)
          .eq('shop_item_id', shopItemId);

        if (updateError) {
          console.error('Error updating cart item quantity:', updateError);
          return false;
        }
      } else {
        // If the item doesn't exist, add it to the cart
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert([{ user_id: userId, shop_item_id: shopItemId, quantity }]);

        if (insertError) {
          console.error('Error adding item to cart:', insertError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  }

  async createShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
  try {
    const { data, error } = await supabase
      .from('shop_settings')
      .insert({
        shop_id: shopId,
        delivery_options: settings.delivery_options || ['pickup'],
        payment_methods: settings.payment_methods || ['card'],
        auto_accept_orders: settings.auto_accept_orders || false,
        notification_preferences: settings.notification_preferences || {
          email: true,
          app: true
        }
      })
      .select()
      .single();

    if (error) throw error;
    return mapSettings(data);
  } catch (error) {
    console.error('Error creating shop settings:', error);
    return null;
  }
}
}
