import { supabase } from '@/integrations/supabase/client';
import { 
  Shop, 
  ShopItem, 
  ShopStatus, 
  ShopItemStatus, 
  Order, 
  ShopReview,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  CartItem,
  DbOrder,
  OrderItem,
  RawShopItem
} from '@/core/shop/domain/types';
import { IShopRepository } from '@/core/shop/domain/interfaces/IShopRepository';

export class ShopRepository implements IShopRepository {
  // Shop operations
  async getShopById(id: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select('*, profiles(username, full_name)')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error("Error fetching shop by ID:", error);
      return null;
    }

    return this.mapShopData(data);
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select('*, profiles(username, full_name)')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      console.error("Error fetching shop by user ID:", error);
      return null;
    }

    return this.mapShopData(data);
  }

  async createShop(shop: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop | null> {
    // Ensure required fields are present
    if (!shop.name || !shop.user_id) {
      console.error("Missing required fields for shop creation");
      return null;
    }

    // Convert status to string for database compatibility
    const shopData = {
      ...shop,
      status: shop.status as string,
    };

    const { data, error } = await supabase
      .from('shops')
      .insert(shopData)
      .select('*, profiles(username, full_name)')
      .single();

    if (error || !data) {
      console.error("Error creating shop:", error);
      return null;
    }

    return this.mapShopData(data);
  }

  async updateShop(id: string, shopUpdates: Partial<Shop>): Promise<Shop | null> {
    // Don't attempt to update if nothing to update
    if (Object.keys(shopUpdates).length === 0) {
      return this.getShopById(id);
    }

    // Convert status to string for database compatibility if present
    const shopData = {
      ...shopUpdates,
      status: shopUpdates.status as string,
    };

    const { data, error } = await supabase
      .from('shops')
      .update(shopData)
      .eq('id', id)
      .select('*, profiles(username, full_name)')
      .single();

    if (error) {
      console.error("Error updating shop:", error);
      return null;
    }

    return this.mapShopData(data);
  }

  async getShopsByStatus(status: ShopStatus): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select('*, profiles(username, full_name)')
      .eq('status', status as string);

    if (error) {
      console.error("Error fetching shops by status:", error);
      return [];
    }

    return data.map(this.mapShopData);
  }

  // ShopItem operations
  async addShopItems(shopId: string, items: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>[]): Promise<boolean> {
    // Make sure each item has the required properties
    const processedItems = items.map(item => ({
      ...item,
      shop_id: shopId,
      status: item.status as string,
      // Ensure required fields have defaults if not provided
      clothes_id: item.clothes_id || null,
      stock: item.stock || 0
    }));

    let { error } = await supabase
      .from('shop_items')
      .insert(processedItems);

    if (error) {
      console.error("Error adding shop items:", error);
      return false;
    }

    return true;
  }

  async getShopItems(shopId: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*, shop:shops(name)')
      .eq('shop_id', shopId);

    if (error) {
      console.error("Error fetching shop items:", error);
      return [];
    }

    return data.map(this.mapShopItemData);
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*, shop:shops(name)')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error("Error fetching shop item by ID:", error);
      return null;
    }

    return this.mapShopItemData(data);
  }

  async updateShopItem(id: string, itemUpdates: Partial<ShopItem>): Promise<ShopItem | null> {
    // Don't attempt to update if nothing to update
    if (Object.keys(itemUpdates).length === 0) {
      return this.getShopItemById(id);
    }

    // Convert status to string for database compatibility if present
    const itemData = {
      ...itemUpdates,
      status: itemUpdates.status as string,
    };

    const { data, error } = await supabase
      .from('shop_items')
      .update(itemData)
      .eq('id', id)
      .select('*, shop:shops(name)')
      .single();

    if (error) {
      console.error("Error updating shop item:", error);
      return null;
    }

    return this.mapShopItemData(data);
  }

  async updateShopItemStatus(id: string, status: ShopItemStatus): Promise<boolean> {
    const { error } = await supabase
      .from('shop_items')
      .update({ status: status as string })
      .eq('id', id);

    if (error) {
      console.error("Error updating shop item status:", error);
      return false;
    }

    return true;
  }

  // Order operations
  async getShopOrders(shopId: string): Promise<Order[]> {
    const { data: dbOrders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('seller_id', shopId);

    if (error) {
      console.error("Error fetching shop orders:", error);
      return [];
    }

    // Map DB orders to domain orders
    const orders: Order[] = [];
    for (const dbOrder of dbOrders) {
      const order = await this.mapOrderData(dbOrder as DbOrder);
      if (order) {
        orders.push(order);
      }
    }

    return orders;
  }

  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | null> {
    // Extract items to create them separately
    const { items, ...orderMain } = orderData;

    // Prepare order data for DB
    const dbOrderData = {
      shop_id: orderMain.shop_id,
      customer_id: orderMain.customer_id,
      status: orderMain.status as string,
      total_amount: orderMain.total_amount,
      delivery_fee: orderMain.delivery_fee || 0,
      payment_status: orderMain.payment_status as string,
      payment_method: orderMain.payment_method,
      delivery_address: orderMain.delivery_address || {},
    };

    // Insert order
    const { data: newOrder, error: orderError } = await supabase
      .from('shop_orders')
      .insert(dbOrderData)
      .select()
      .single();

    if (orderError || !newOrder) {
      console.error("Error creating order:", orderError);
      return null;
    }

    // Insert order items
    if (items && items.length > 0) {
      const orderItems = items.map(item => ({
        order_id: newOrder.id,
        shop_item_id: item.shop_item_id || item.item_id, // Handle different naming
        price_at_time: item.price_at_time || item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('shop_order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error("Error creating order items:", itemsError);
        // Consider rolling back the order or marking it as problematic
      }
    }

    // Return the mapped order
    return this.mapOrderData(newOrder as DbOrder);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    const { error } = await supabase
      .from('shop_orders')
      .update({ status: status as string })
      .eq('id', orderId);

    if (error) {
      console.error("Error updating order status:", error);
      return false;
    }

    return true;
  }

  // Favorites operations
  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_favorite_shops')
      .select('*')
      .eq('user_id', userId)
      .eq('shop_id', shopId)
      .single();

    if (error || !data) {
      return false;
    }

    return true;
  }

  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_favorite_shops')
      .insert({
        user_id: userId,
        shop_id: shopId,
      });

    if (error) {
      console.error("Error adding shop to favorites:", error);
      return false;
    }

    return true;
  }

  async removeShopFromFavorites(userId: string, shopId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_favorite_shops')
      .delete()
      .eq('user_id', userId)
      .eq('shop_id', shopId);

    if (error) {
      console.error("Error removing shop from favorites:", error);
      return false;
    }

    return true;
  }

  async getFavoriteShops(userId: string): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('user_favorite_shops')
      .select('shop_id, shops:shop_id(*, profiles(username, full_name))')
      .eq('user_id', userId);

    if (error) {
      console.error("Error fetching favorite shops:", error);
      return [];
    }

    return data.map(item => this.mapShopData(item.shops));
  }

  // Shop reviews
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .select('*, profiles(username, full_name)')
      .eq('shop_id', shopId);

    if (error) {
      console.error("Error fetching shop reviews:", error);
      return [];
    }

    return data.map(this.mapShopReviewData);
  }

  // Cart operations
  async addToCart(userId: string, itemId: string, quantity: number): Promise<boolean> {
    // Check if the item already exists in cart
    const { data: existingCartItem, error: checkError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('shop_item_id', itemId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Error checking cart:", checkError);
      return false;
    }

    // If item exists, update quantity
    if (existingCartItem) {
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existingCartItem.quantity + quantity })
        .eq('id', existingCartItem.id);

      if (updateError) {
        console.error("Error updating cart item:", updateError);
        return false;
      }
    } else {
      // Otherwise add new item
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          shop_item_id: itemId,
          quantity: quantity
        });

      if (insertError) {
        console.error("Error adding to cart:", insertError);
        return false;
      }
    }

    return true;
  }

  // Helper methods for mapping data
  private mapShopData(data: any): Shop {
    if (!data) return null;
    
    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description || '',
      image_url: data.image_url,
      address: data.address,
      phone: data.phone,
      website: data.website,
      status: data.status as ShopStatus,
      categories: data.categories || [],
      average_rating: data.average_rating || 0,
      total_ratings: data.total_ratings || 0,
      rating_count: data.rating_count || 0,
      latitude: data.latitude,
      longitude: data.longitude,
      opening_hours: data.opening_hours,
      created_at: data.created_at,
      updated_at: data.updated_at,
      profiles: data.profiles
    };
  }

  private mapShopItemData(data: RawShopItem): ShopItem {
    if (!data) return null;
    
    return {
      id: data.id,
      shop_id: data.shop_id,
      name: data.name || '',
      description: data.description || '',
      image_url: data.image_url,
      price: data.price,
      original_price: data.original_price,
      stock: data.stock,
      status: data.status as ShopItemStatus,
      created_at: data.created_at,
      updated_at: data.updated_at,
      clothes_id: data.clothes_id,
      shop: data.shop
    };
  }

  private mapShopReviewData(data: any): ShopReview {
    if (!data) return null;
    
    return {
      id: data.id,
      shop_id: data.shop_id,
      user_id: data.user_id,
      rating: data.rating,
      comment: data.comment,
      created_at: data.created_at,
      updated_at: data.updated_at,
      profiles: data.profiles
    };
  }

  private async mapOrderData(data: any): Promise<Order | null> {
    if (!data) return null;
    
    // Get order items
    let orderItems: OrderItem[] = [];
    if (data.order_items && Array.isArray(data.order_items)) {
      // Items are already included in the query
      orderItems = await this.mapOrderItemsData(data.order_items);
    } else {
      // Need to fetch items separately
      const { data: itemsData, error: itemsError } = await supabase
        .from('shop_order_items')
        .select('*')
        .eq('order_id', data.id);
        
      if (!itemsError && itemsData) {
        orderItems = await this.mapOrderItemsData(itemsData);
      }
    }
    
    // If this is from orders table
    const shopId = data.seller_id || data.shop_id;
    
    // Mapping from database structure to domain model
    return {
      id: data.id,
      shop_id: shopId,
      customer_id: data.buyer_id || data.customer_id,
      status: data.status as OrderStatus,
      total_amount: data.total_amount,
      delivery_fee: data.shipping_cost || data.delivery_fee || 0,
      payment_status: data.payment_status as PaymentStatus,
      payment_method: data.payment_method || 'card',
      delivery_address: data.shipping_address || data.delivery_address || {
        street: '',
        city: '',
        postal_code: '',
        country: ''
      },
      created_at: data.created_at,
      updated_at: data.updated_at || data.created_at,
      items: orderItems,
    };
  }

  private async mapOrderItemsData(itemsData: any[]): Promise<OrderItem[]> {
    if (!itemsData || !Array.isArray(itemsData)) return [];
    
    const orderItems: OrderItem[] = [];
    
    for (const item of itemsData) {
      // If we need to fetch additional details
      if (item.shop_item_id && (!item.name || !item.price)) {
        const { data: shopItem, error } = await supabase
          .from('shop_items')
          .select('*, clothes(name)')
          .eq('id', item.shop_item_id)
          .single();
          
        if (!error && shopItem) {
          orderItems.push({
            id: item.id,
            order_id: item.order_id,
            item_id: item.shop_item_id,
            shop_item_id: item.shop_item_id,
            name: shopItem.clothes?.name || shopItem.name || 'Unknown item',
            price: item.price_at_time || shopItem.price,
            price_at_time: item.price_at_time || shopItem.price,
            quantity: item.quantity,
            created_at: item.created_at
          });
        }
      } else {
        // Already have all the necessary data
        orderItems.push({
          id: item.id,
          order_id: item.order_id,
          item_id: item.shop_item_id || item.item_id,
          shop_item_id: item.shop_item_id || item.item_id,
          name: item.name || 'Unknown item',
          price: item.price_at_time || item.price,
          price_at_time: item.price_at_time || item.price,
          quantity: item.quantity,
          created_at: item.created_at
        });
      }
    }
    
    return orderItems;
  }
}
