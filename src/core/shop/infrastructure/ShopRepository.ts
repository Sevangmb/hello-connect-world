
import { supabase } from '@/integrations/supabase/client';
import { 
  Shop, ShopItem, ShopStatus, ShopItemStatus, 
  Order, OrderItem, OrderStatus, PaymentStatus,
  ShopReview, DeliveryOption, PaymentMethod, 
  ShopSettings, RawShopItem, DbOrder 
} from '@/core/shop/domain/types';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

export class ShopRepository implements IShopRepository {
  // Get all shops
  async getAllShops(): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select('*, profiles(username, full_name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shops:', error);
      return [];
    }

    return data || [];
  }

  // Get a shop by ID
  async getShopById(id: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select('*, profiles(username, full_name)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching shop:', error);
      return null;
    }

    return data as Shop;
  }

  // Get a shop by user ID
  async getShopByUserId(userId: string): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .select('*, profiles(username, full_name)')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No shop found for this user
      }
      console.error('Error fetching shop by user ID:', error);
      return null;
    }

    return data as Shop;
  }

  // Create a new shop
  async createShop(shop: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .insert([
        {
          user_id: shop.user_id,
          name: shop.name,
          description: shop.description || '',
          image_url: shop.image_url,
          address: shop.address,
          phone: shop.phone,
          website: shop.website,
          status: shop.status || 'pending',
          categories: shop.categories,
          average_rating: 0,
          rating_count: 0
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating shop:', error);
      return null;
    }

    return data as Shop;
  }

  // Update a shop
  async updateShop(id: string, shop: Partial<Shop>): Promise<Shop | null> {
    const { data, error } = await supabase
      .from('shops')
      .update(shop)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating shop:', error);
      return null;
    }

    return data as Shop;
  }

  // Get shops by status
  async getShopsByStatus(status: ShopStatus): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select('*, profiles(username, full_name)')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shops by status:', error);
      return [];
    }

    return data || [];
  }

  // Add items to a shop
  async addShopItems(shopId: string, items: Array<Omit<ShopItem, "id" | "created_at" | "updated_at">>): Promise<ShopItem[]> {
    // Assurez-vous que chaque élément a le shop_id
    const preparedItems = items.map(item => ({
      ...item,
      shop_id: shopId,
    }));

    const { data, error } = await supabase
      .from('shop_items')
      .insert(preparedItems)
      .select();

    if (error) {
      console.error('Error adding shop items:', error);
      return [];
    }

    return data as ShopItem[];
  }

  // Get shop items
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*, shop:shops(name)')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }

    return data.map((item): ShopItem => ({
      id: item.id,
      shop_id: item.shop_id,
      name: item.name,
      description: item.description,
      image_url: item.image_url,
      price: item.price,
      original_price: item.original_price,
      stock: item.stock,
      status: item.status as ShopItemStatus,
      created_at: item.created_at,
      updated_at: item.updated_at,
      clothes_id: item.clothes_id,
      shop: item.shop
    }));
  }

  // Update shop item
  async updateShopItem(id: string, item: Partial<ShopItem>): Promise<ShopItem | null> {
    const { data, error } = await supabase
      .from('shop_items')
      .update(item)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating shop item:', error);
      return null;
    }

    return data as ShopItem;
  }

  // Update shop item status
  async updateShopItemStatus(id: string, status: ShopItemStatus): Promise<ShopItem | null> {
    const { data, error } = await supabase
      .from('shop_items')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating shop item status:', error);
      return null;
    }

    return data as ShopItem;
  }

  // Get shop item by ID
  async getShopItemById(id: string): Promise<ShopItem | null> {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*, shop:shops(name)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching shop item:', error);
      return null;
    }

    return data as ShopItem;
  }

  // Create a new order
  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | null> {
    try {
      // Insérer la commande principale
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: order.customer_id,
          seller_id: order.shop_id,
          status: order.status as string,
          total_amount: order.total_amount,
          payment_status: order.payment_status as string,
          payment_method: order.payment_method,
          delivery_address: order.delivery_address && typeof order.delivery_address === 'object' ? 
            order.delivery_address : 
            { street: '', city: '', postal_code: '', country: '' },
          delivery_fee: order.delivery_fee
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        return null;
      }

      // Insérer les articles de la commande
      const orderItems = order.items.map(item => ({
        order_id: orderData.id,
        id: item.id,
        item_id: item.item_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        shop_item_id: item.shop_item_id || null,
        price_at_time: item.price_at_time || item.price,
        created_at: new Date().toISOString()
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        return null;
      }

      // Récupérer la commande complète avec les articles
      const dbOrder = await this.getOrderById(orderData.id);
      
      if (!dbOrder) {
        console.error('Error fetching created order');
        return null;
      }
      
      return dbOrder;
    } catch (error) {
      console.error('Unexpected error creating order:', error);
      return null;
    }
  }

  // Get order by ID
  async getOrderById(id: string): Promise<Order | null> {
    try {
      // Récupérer la commande
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (orderError) {
        console.error('Error fetching order:', orderError);
        return null;
      }

      // Récupérer les articles de la commande
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id);

      if (itemsError) {
        console.error('Error fetching order items:', itemsError);
        return null;
      }

      // Convertir au format Order
      const order: Order = {
        id: orderData.id,
        shop_id: orderData.seller_id,
        customer_id: orderData.buyer_id,
        status: orderData.status as OrderStatus,
        total_amount: orderData.total_amount,
        delivery_fee: orderData.delivery_fee || 0,
        payment_status: orderData.payment_status as PaymentStatus,
        payment_method: orderData.payment_method,
        delivery_address: orderData.delivery_address as { 
          street: string; 
          city: string; 
          postal_code: string; 
          country: string; 
        },
        created_at: orderData.created_at,
        updated_at: orderData.updated_at || orderData.created_at,
        items: itemsData.map((item): OrderItem => ({
          id: item.id,
          order_id: item.order_id,
          item_id: item.shop_item_id || '',
          name: item.name,
          price: item.price_at_time || item.price,
          quantity: item.quantity,
          created_at: item.created_at
        }))
      };

      return order;
    } catch (error) {
      console.error('Unexpected error fetching order:', error);
      return null;
    }
  }

  // Get orders by shop
  async getOrdersByShop(shopId: string): Promise<Order[]> {
    try {
      // Récupérer les commandes de la boutique
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', shopId)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching shop orders:', ordersError);
        return [];
      }

      // Récupérer les articles pour chaque commande
      const orders: Order[] = [];
      
      for (const orderData of ordersData) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderData.id);

        if (itemsError) {
          console.error(`Error fetching items for order ${orderData.id}:`, itemsError);
          continue;
        }

        // Créer l'objet Order complet
        const order: Order = {
          id: orderData.id,
          shop_id: orderData.seller_id,
          customer_id: orderData.buyer_id,
          status: orderData.status as OrderStatus,
          total_amount: orderData.total_amount,
          delivery_fee: orderData.delivery_fee || 0,
          payment_status: orderData.payment_status as PaymentStatus,
          payment_method: orderData.payment_method,
          delivery_address: orderData.delivery_address as { 
            street: string; 
            city: string; 
            postal_code: string; 
            country: string; 
          },
          created_at: orderData.created_at,
          updated_at: orderData.updated_at || orderData.created_at,
          items: itemsData.map((item): OrderItem => ({
            id: item.id,
            order_id: item.order_id,
            item_id: item.shop_item_id || '',
            name: item.name,
            price: item.price_at_time || item.price,
            quantity: item.quantity,
            created_at: item.created_at
          }))
        };

        orders.push(order);
      }

      return orders;
    } catch (error) {
      console.error('Unexpected error fetching shop orders:', error);
      return [];
    }
  }

  // Update order status
  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      return null;
    }

    return this.getOrderById(id);
  }

  // Get shop reviews
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .select('*, profiles(username, full_name)')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shop reviews:', error);
      return [];
    }

    return data as ShopReview[];
  }

  // Create a shop review
  async createShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview | null> {
    const { data, error } = await supabase
      .from('shop_reviews')
      .insert([review])
      .select()
      .single();

    if (error) {
      console.error('Error creating shop review:', error);
      return null;
    }

    return data as ShopReview;
  }

  // Check if user has favorited a shop
  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_favorite_shops')
      .select('*')
      .eq('user_id', userId)
      .eq('shop_id', shopId)
      .maybeSingle();

    if (error) {
      console.error('Error checking if shop is favorited:', error);
      return false;
    }

    return !!data;
  }

  // Add shop to favorites
  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_favorite_shops')
      .insert([
        { user_id: userId, shop_id: shopId }
      ]);

    if (error) {
      console.error('Error adding shop to favorites:', error);
      return false;
    }

    return true;
  }

  // Remove shop from favorites
  async removeShopFromFavorites(userId: string, shopId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_favorite_shops')
      .delete()
      .eq('user_id', userId)
      .eq('shop_id', shopId);

    if (error) {
      console.error('Error removing shop from favorites:', error);
      return false;
    }

    return true;
  }

  // Get user's favorite shops
  async getFavoriteShops(userId: string): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('user_favorite_shops')
      .select('shop_id, shops!inner(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching favorite shops:', error);
      return [];
    }

    // Transformer les données pour obtenir uniquement les boutiques
    return data.map(item => item.shops) as Shop[];
  }
}
