import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { 
  Shop, ShopItem, CartItem, Order, ShopStatus, 
  ShopItemStatus, OrderStatus, PaymentStatus, OrderItem as OrderItemType
} from '../domain/types';

export class ShopRepository implements IShopRepository {
  async createShop(shop: Partial<Shop>): Promise<Shop | null> {
    // Ensure required fields
    const shopData = {
      ...shop,
      name: shop.name || '',
      user_id: shop.user_id || '',  
      status: shop.status || 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('shops')
      .insert([shopData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async createShopItem(item: Partial<ShopItem>): Promise<ShopItem | null> {
    if (!item.shop_id || !item.clothes_id || !item.price) {
      throw new Error('Missing required fields for shop item');
    }

    const itemData = {
      ...item,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('shop_items')
      .insert([itemData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async createOrder(order: Partial<Order>): Promise<Order | null> {
    if (!order.shop_id || !order.customer_id || !order.items) {
      throw new Error('Missing required fields for order');
    }

    const orderData = {
      ...order,
      payment_method: order.payment_method || 'card',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getShopById(id: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching shop by ID:', error);
        return null;
      }

      return data as Shop;
    } catch (error) {
      console.error('Unexpected error fetching shop by ID:', error);
      return null;
    }
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching shop by user ID:', error);
        return null;
      }

      return data as Shop;
    } catch (error) {
      console.error('Unexpected error fetching shop by user ID:', error);
      return null;
    }
  }

  async updateShop(shop: Partial<Shop>): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .update({
          address: shop.address,
          average_rating: shop.average_rating,
          categories: shop.categories,
          created_at: shop.created_at,
          description: shop.description,
          latitude: shop.latitude,
          longitude: shop.longitude,
          name: shop.name,
          opening_hours: shop.opening_hours,
          phone: shop.phone,
          status: shop.status,
          updated_at: new Date().toISOString(),
          website: shop.website,
        })
        .eq('id', shop.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating shop:', error);
        return null;
      }

      return data as Shop;
    } catch (error) {
      console.error('Unexpected error updating shop:', error);
      return null;
    }
  }

  async deleteShop(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shops')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting shop:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error deleting shop:', error);
      return false;
    }
  }

  async getShopItemsByShopId(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('shop_id', shopId);

      if (error) {
        console.error('Error fetching shop items by shop ID:', error);
        return [];
      }

      return data as ShopItem[];
    } catch (error) {
      console.error('Unexpected error fetching shop items by shop ID:', error);
      return [];
    }
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching shop item by ID:', error);
        return null;
      }

      return data as ShopItem;
    } catch (error) {
      console.error('Unexpected error fetching shop item by ID:', error);
      return null;
    }
  }

  async updateShopItem(item: Partial<ShopItem>): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .update({
          description: item.description,
          image_url: item.image_url,
          price: item.price,
          original_price: item.original_price,
          stock: item.stock,
          status: item.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating shop item:', error);
        return null;
      }

      return data as ShopItem;
    } catch (error) {
      console.error('Unexpected error updating shop item:', error);
      return null;
    }
  }

  async deleteShopItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting shop item:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error deleting shop item:', error);
      return false;
    }
  }

  async getCartItemsByUserId(userId: string): Promise<CartItem[]> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          user_id,
          shop_item_id,
          quantity,
          created_at,
          updated_at,
          shop_items (
            id,
            name,
            price,
            image_url,
            shop_id,
            clothes_id,
            created_at,
            description,
            original_price,
            status,
            updated_at
          ),
          shop:shop_items (
            id,
            name
          )
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching cart items by user ID:', error);
        return [];
      }

      return data.map(item => ({
        ...(item as any),
        shop_id: item.shop_items.shop_id,
        item_id: item.shop_item_id,
        updated_at: item.updated_at
      })) as CartItem[];
    } catch (error) {
      console.error('Unexpected error fetching cart items by user ID:', error);
      return [];
    }
  }

  async addCartItem(userId: string, shopItemId: string, quantity: number): Promise<CartItem | null> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .insert([
          {
            user_id: userId,
            shop_item_id: shopItemId,
            quantity: quantity,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select(`
          id,
          user_id,
          shop_item_id,
          quantity,
          created_at,
          updated_at,
          shop_items (
            id,
            name,
            price,
            image_url,
            shop_id,
            clothes_id,
            created_at,
            description,
            original_price,
            status,
            updated_at
          ),
          shop:shop_items (
            id,
            name
          )
        `)
        .single();

      if (error) {
        console.error('Error adding cart item:', error);
        return null;
      }

      return {
        ...(data as any),
        shop_id: data.shop_items.shop_id,
        item_id: data.shop_item_id,
        updated_at: data.updated_at
      } as CartItem;
    } catch (error) {
      console.error('Unexpected error adding cart item:', error);
      return null;
    }
  }

  async updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | null> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', id)
        .select(`
          id,
          user_id,
          shop_item_id,
          quantity,
          created_at,
          updated_at,
          shop_items (
            id,
            name,
            price,
            image_url,
            shop_id,
            clothes_id,
            created_at,
            description,
            original_price,
            status,
            updated_at
          ),
          shop:shop_items (
            id,
            name
          )
        `)
        .single();

      if (error) {
        console.error('Error updating cart item quantity:', error);
        return null;
      }

      return {
        ...(data as any),
        shop_id: data.shop_items.shop_id,
        item_id: data.shop_item_id,
        updated_at: data.updated_at
      } as CartItem;
    } catch (error) {
      console.error('Unexpected error updating cart item quantity:', error);
      return null;
    }
  }

  async removeCartItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing cart item:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error removing cart item:', error);
      return false;
    }
  }

  async clearCart(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Error clearing cart:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error clearing cart:', error);
      return false;
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching order by ID:', error);
        return null;
      }

      return data as Order;
    } catch (error) {
      console.error('Unexpected error fetching order by ID:', error);
      return null;
    }
  }

  async getOrdersByShopId(shopId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('shop_id', shopId);

      if (error) {
        console.error('Error fetching orders by shop ID:', error);
        return [];
      }

      return data as Order[];
    } catch (error) {
      console.error('Unexpected error fetching orders by shop ID:', error);
      return [];
    }
  }

  async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', customerId);

      if (error) {
        console.error('Error fetching orders by customer ID:', error);
        return [];
      }

      return data as Order[];
    } catch (error) {
      console.error('Unexpected error fetching orders by customer ID:', error);
      return [];
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    try {
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

      return data as Order;
    } catch (error) {
      console.error('Unexpected error updating order status:', error);
      return null;
    }
  }

  async updateOrderPaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ payment_status: paymentStatus })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating order payment status:', error);
        return null;
      }

      return data as Order;
    } catch (error) {
      console.error('Unexpected error updating order payment status:', error);
      return null;
    }
  }

  async addOrderItems(orderId: string, items: any[]): Promise<boolean> {
    try {
      const orderItems = items.map(item => ({
        order_id: orderId,
        item_id: item.item_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        created_at: item.created_at,
      }));
  
      const { error } = await supabase
        .from('order_items')
        .insert(orderItems);
  
      if (error) {
        console.error('Error adding order items:', error);
        return false;
      }
  
      return true;
    } catch (error) {
      console.error('Unexpected error adding order items:', error);
      return false;
    }
  }

  async getOrderItemsByOrderId(orderId: string): Promise<OrderItemType[]> {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (error) {
        console.error('Error fetching order items by order ID:', error);
        return [];
      }

      return data as OrderItemType[];
    } catch (error) {
      console.error('Unexpected error fetching order items by order ID:', error);
      return [];
    }
  }
}
