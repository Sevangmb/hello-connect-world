
import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { 
  Shop, 
  ShopItem, 
  ShopStatus, 
  ShopItemStatus, 
  Order, 
  ShopReview,
  OrderItem,
  OrderStatus,
  PaymentStatus
} from '@/core/shop/domain/types';

export class ShopRepository implements IShopRepository {
  // Get shop by ID
  async getShopById(id: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id(username, full_name)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Shop;
    } catch (error) {
      console.error('Error fetching shop by ID:', error);
      return null;
    }
  }

  // Get shop by user ID
  async getShopByUserId(userId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id(username, full_name)
        `)
        .eq('user_id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No shop found
        }
        throw error;
      }
      return data as Shop;
    } catch (error) {
      console.error('Error fetching shop by user ID:', error);
      return null;
    }
  }

  // Create a new shop
  async createShop(shop: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .insert(shop)
        .select()
        .single();
      
      if (error) throw error;
      return data as Shop;
    } catch (error) {
      console.error('Error creating shop:', error);
      return null;
    }
  }

  // Update a shop
  async updateShop(id: string, shop: Partial<Shop>): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .update(shop)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Shop;
    } catch (error) {
      console.error('Error updating shop:', error);
      return null;
    }
  }

  // Get shops by status
  async getShopsByStatus(status: ShopStatus): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id(username, full_name)
        `)
        .eq('status', status);
      
      if (error) throw error;
      return data as Shop[];
    } catch (error) {
      console.error('Error fetching shops by status:', error);
      return [];
    }
  }

  // Add shop items
  async addShopItems(shopId: string, items: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>[]): Promise<boolean> {
    try {
      // Process each item to ensure clothes_id is handled properly
      const processedItems = items.map(item => {
        // Make sure each item has the shop_id property and required fields
        return {
          ...item,
          shop_id: shopId,
          // Provide sensible defaults or placeholders for required fields
          clothes_id: item.clothes_id || '00000000-0000-0000-0000-000000000000', // Default UUID if missing
          price: item.price || 0,
          stock: item.stock || 0,
          status: item.status || 'available',
        };
      });
      
      const { error } = await supabase
        .from('shop_items')
        .insert(processedItems);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding shop items:', error);
      return false;
    }
  }

  // Get shop items for a shop
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop:shop_id(name)
        `)
        .eq('shop_id', shopId);
      
      if (error) throw error;
      return data as ShopItem[];
    } catch (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }
  }

  // Get shop item by ID
  async getShopItemById(id: string): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop:shop_id(name)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as ShopItem;
    } catch (error) {
      console.error('Error fetching shop item by ID:', error);
      return null;
    }
  }

  // Update shop item
  async updateShopItem(id: string, item: Partial<ShopItem>): Promise<ShopItem | null> {
    try {
      // Remove shop field if present as it's a relation
      const { shop, ...itemData } = item as any;
      
      const { data, error } = await supabase
        .from('shop_items')
        .update(itemData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as ShopItem;
    } catch (error) {
      console.error('Error updating shop item:', error);
      return null;
    }
  }

  // Update shop item status
  async updateShopItemStatus(id: string, status: ShopItemStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_items')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating shop item status:', error);
      return false;
    }
  }

  // Get shop orders
  async getShopOrders(shopId: string): Promise<Order[]> {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', shopId);
      
      if (ordersError) throw ordersError;
      
      const orders: Order[] = [];
      
      for (const orderData of ordersData) {
        // Map the order data to match the Order type
        const order: Order = {
          id: orderData.id,
          shop_id: shopId,
          customer_id: orderData.buyer_id,
          status: orderData.status as OrderStatus,
          total_amount: orderData.total_amount,
          delivery_fee: orderData.shipping_cost || 0,
          payment_status: orderData.payment_status as PaymentStatus,
          payment_method: orderData.payment_method || 'card',
          delivery_address: orderData.shipping_address || { street: '', city: '', postal_code: '', country: '' },
          created_at: orderData.created_at,
          updated_at: orderData.updated_at || orderData.created_at,
          items: [] // Will be filled below
        };
        
        // Fetch the order items
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderData.id);
        
        if (itemsError) {
          console.error('Error fetching order items:', itemsError);
          continue;
        }
        
        // Process each order item
        const processedItems: OrderItem[] = itemsData.map(item => ({
          id: item.id,
          order_id: item.order_id,
          item_id: item.shop_item_id,
          name: '', // This field may not be in the database
          price: item.price_at_time,
          quantity: item.quantity,
          shop_item_id: item.shop_item_id
        }));
        
        order.items = processedItems;
        orders.push(order);
      }
      
      return orders;
    } catch (error) {
      console.error('Error fetching shop orders:', error);
      return [];
    }
  }

  // Create an order
  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | null> {
    try {
      // Separate order items for insertion
      const { items, ...order } = orderData;
      
      // Map the Order type to match the database schema
      const dbOrder = {
        seller_id: order.shop_id,
        buyer_id: order.customer_id,
        status: order.status,
        total_amount: order.total_amount,
        shipping_cost: order.delivery_fee,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        shipping_address: order.delivery_address
      };
      
      // Insert order
      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert(dbOrder)
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Insert order items if they exist
      if (items && items.length > 0) {
        const orderItems = items.map(item => ({
          order_id: orderResult.id,
          shop_item_id: item.shop_item_id || item.item_id,
          price_at_time: item.price,
          quantity: item.quantity
        }));
        
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);
        
        if (itemsError) throw itemsError;
      }
      
      // Map the result back to Order type
      const result: Order = {
        id: orderResult.id,
        shop_id: orderResult.seller_id,
        customer_id: orderResult.buyer_id,
        status: orderResult.status as OrderStatus,
        total_amount: orderResult.total_amount,
        delivery_fee: orderResult.shipping_cost || 0,
        payment_status: orderResult.payment_status as PaymentStatus,
        payment_method: orderResult.payment_method || 'card',
        delivery_address: orderResult.shipping_address || { street: '', city: '', postal_code: '', country: '' },
        created_at: orderResult.created_at,
        updated_at: orderResult.updated_at || orderResult.created_at,
        items: items || []
      };
      
      return result;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  // Check if a shop is favorited by a user
  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select('*')
        .eq('user_id', userId)
        .eq('shop_id', shopId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return false; // Not favorited
        }
        throw error;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error checking if shop is favorited:', error);
      return false;
    }
  }

  // Add a shop to favorites
  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_favorite_shops')
        .insert({
          user_id: userId,
          shop_id: shopId
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding shop to favorites:', error);
      return false;
    }
  }

  // Remove a shop from favorites
  async removeShopFromFavorites(userId: string, shopId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_favorite_shops')
        .delete()
        .eq('user_id', userId)
        .eq('shop_id', shopId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing shop from favorites:', error);
      return false;
    }
  }

  // Get favorite shops for a user
  async getFavoriteShops(userId: string): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_shops')
        .select(`
          shop_id,
          shops:shop_id(*)
        `)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      const shops = data.map(item => item.shops);
      return shops as Shop[];
    } catch (error) {
      console.error('Error fetching favorite shops:', error);
      return [];
    }
  }
  
  // Get shop reviews
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .select(`
          *,
          profiles:user_id(username, full_name)
        `)
        .eq('shop_id', shopId);
      
      if (error) throw error;
      return data as ShopReview[];
    } catch (error) {
      console.error('Error fetching shop reviews:', error);
      return [];
    }
  }
  
  // Add to cart
  async addToCart(userId: string, itemId: string, quantity: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          shop_item_id: itemId,
          quantity
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return false;
    }
  }
}
