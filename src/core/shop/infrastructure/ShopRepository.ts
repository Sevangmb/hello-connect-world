import { supabase } from '@/integrations/supabase/client';
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { 
  Shop, ShopItem, ShopItemStatus, ShopStatus, 
  CartItem, Order, OrderItem, OrderStatus, 
  ShopReview, PaymentStatus, PaymentMethod, DeliveryOption 
} from '../domain/types';
import { Json } from '@/integrations/supabase/types';

export class ShopRepository implements IShopRepository {
  async getShops(): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles(username, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting shops:', error);
        throw error;
      }

      return data as Shop[];
    } catch (error) {
      console.error('Error getting shops:', error);
      throw error;
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
        console.error('Error getting shop by ID:', error);
        throw error;
      }

      return data as Shop | null;
    } catch (error) {
      console.error('Error getting shop by ID:', error);
      throw error;
    }
  }

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
        console.error('Error getting shop by user ID:', error);
        throw error;
      }

      return data as Shop | null;
    } catch (error) {
      console.error('Error getting shop by user ID:', error);
      throw error;
    }
  }

  async getShopsByStatus(status: ShopStatus): Promise<Shop[]> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles(username, full_name)
        `)
        .eq('status', status);

      if (error) {
        console.error('Error getting shops by status:', error);
        throw error;
      }

      return data as Shop[];
    } catch (error) {
      console.error('Error getting shops by status:', error);
      throw error;
    }
  }

  async createShop(shop: Partial<Shop>): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .insert([shop])
        .select()
        .single();

      if (error) {
        console.error('Error creating shop:', error);
        throw error;
      }

      return data as Shop | null;
    } catch (error) {
      console.error('Error creating shop:', error);
      throw error;
    }
  }

  async updateShop(id: string, data: Partial<Shop>): Promise<Shop | null> {
    try {
      const { data, error } = await supabase
        .from('shops')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating shop:', error);
        throw error;
      }

      return data as Shop | null;
    } catch (error) {
      console.error('Error updating shop:', error);
      throw error;
    }
  }

  async deleteShop(shopId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shops')
        .delete()
        .eq('id', shopId);

      if (error) {
        console.error('Error deleting shop:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting shop:', error);
      return false;
    }
  }

  async getShopItems(shopId: string): Promise<ShopItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          clothes(name)
        `)
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting shop items:', error);
        throw error;
      }

      return data as ShopItem[];
    } catch (error) {
      console.error('Error getting shop items:', error);
      throw error;
    }
  }

  async getShopItemById(itemId: string): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          clothes(name)
        `)
        .eq('id', itemId)
        .single();

      if (error) {
        console.error('Error getting shop item by ID:', error);
        throw error;
      }

      return data as ShopItem | null;
    } catch (error) {
      console.error('Error getting shop item by ID:', error);
      throw error;
    }
  }

  async createShopItem(shopId: string, item: Omit<ShopItem, "id" | "created_at" | "updated_at">): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert([{ ...item, shop_id: shopId }])
        .select()
        .single();

      if (error) {
        console.error('Error creating shop item:', error);
        throw error;
      }

      return data as ShopItem | null;
    } catch (error) {
      console.error('Error creating shop item:', error);
      throw error;
    }
  }

  async updateShopItem(itemId: string, data: Partial<ShopItem>): Promise<ShopItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .update(data)
        .eq('id', itemId)
        .select()
        .single();

      if (error) {
        console.error('Error updating shop item:', error);
        throw error;
      }

      return data as ShopItem | null;
    } catch (error) {
      console.error('Error updating shop item:', error);
      throw error;
    }
  }

  async updateShopItemStatus(itemId: string, status: ShopItemStatus): Promise<boolean> {
    try {
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
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting shop reviews:', error);
        throw error;
      }

      return data as ShopReview[];
    } catch (error) {
      console.error('Error getting shop reviews:', error);
      throw error;
    }
  }

  async createShopReview(shopReview: Partial<ShopReview>): Promise<ShopReview | null> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .insert([shopReview])
        .select()
        .single();

      if (error) {
        console.error('Error creating shop review:', error);
        throw error;
      }

      return data as ShopReview | null;
    } catch (error) {
      console.error('Error creating shop review:', error);
      throw error;
    }
  }

  async updateShopReview(id: string, data: Partial<ShopReview>): Promise<ShopReview | null> {
    try {
      const { data, error } = await supabase
        .from('shop_reviews')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating shop review:', error);
        throw error;
      }

      return data as ShopReview | null;
    } catch (error) {
      console.error('Error updating shop review:', error);
      throw error;
    }
  }

  async deleteShopReview(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_reviews')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting shop review:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting shop review:', error);
      return false;
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `);

      if (error) throw error;

      const orders: Order[] = data.map((order) => {
        // Convertir le statut en type OrderStatus
        let orderStatus: OrderStatus = 'pending';
        if (this.isValidOrderStatus(order.status)) {
          orderStatus = order.status as OrderStatus;
        }

        // Convertir le statut de paiement en type PaymentStatus
        let paymentStatus: PaymentStatus = 'pending';
        if (this.isValidPaymentStatus(order.payment_status)) {
          paymentStatus = order.payment_status as PaymentStatus;
        }

        // Assurer que l'adresse de livraison est correctement typée
        let deliveryAddress = {
          street: '',
          city: '',
          postal_code: '',
          country: ''
        };

        // Utiliser la structure d'adresse de livraison correcte
        if (order.shipping_address && typeof order.shipping_address === 'object') {
          deliveryAddress = {
            street: (order.shipping_address as any).street || '',
            city: (order.shipping_address as any).city || '',
            postal_code: (order.shipping_address as any).postal_code || '',
            country: (order.shipping_address as any).country || ''
          };
        }

        // Assigner 0 à delivery_fee si elle n'existe pas
        const deliveryFee = order.shipping_cost || 0;

        // Formater les items de commande
        const items: OrderItem[] = (order.order_items || []).map((item: any) => {
          return {
            id: item.id,
            order_id: item.order_id,
            item_id: item.shop_item_id,
            name: item.item_name || 'Article sans nom',
            price: item.price_at_time || 0,
            quantity: item.quantity,
            created_at: item.created_at
          };
        });

        return {
          id: order.id,
          shop_id: order.shop_id,
          customer_id: order.buyer_id,
          status: orderStatus,
          total_amount: order.total_amount,
          delivery_fee: deliveryFee,
          payment_status: paymentStatus,
          payment_method: order.payment_method || 'card',
          delivery_address: deliveryAddress,
          created_at: order.created_at,
          updated_at: order.created_at, // Utiliser created_at si updated_at n'existe pas
          items: items
        };
      });

      return orders;
    } catch (error) {
      console.error('Error getting all orders:', error);
      throw error;
    }
  }

  async getOrdersByShop(shopId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('shop_id', shopId);

      if (error) {
        console.error('Error getting orders by shop:', error);
        throw error;
      }

      const orders: Order[] = data.map((order) => {
        // Convertir le statut en type OrderStatus
        let orderStatus: OrderStatus = 'pending';
        if (this.isValidOrderStatus(order.status)) {
          orderStatus = order.status as OrderStatus;
        }

        // Convertir le statut de paiement en type PaymentStatus
        let paymentStatus: PaymentStatus = 'pending';
        if (this.isValidPaymentStatus(order.payment_status)) {
          paymentStatus = order.payment_status as PaymentStatus;
        }

        // Assurer que l'adresse de livraison est correctement typée
        let deliveryAddress = {
          street: '',
          city: '',
          postal_code: '',
          country: ''
        };

        // Utiliser la structure d'adresse de livraison correcte
        if (order.shipping_address && typeof order.shipping_address === 'object') {
          deliveryAddress = {
            street: (order.shipping_address as any).street || '',
            city: (order.shipping_address as any).city || '',
            postal_code: (order.shipping_address as any).postal_code || '',
            country: (order.shipping_address as any).country || ''
          };
        }

        // Assigner 0 à delivery_fee si elle n'existe pas
        const deliveryFee = order.shipping_cost || 0;

        // Formater les items de commande
        const items: OrderItem[] = (order.order_items || []).map((item: any) => {
          return {
            id: item.id,
            order_id: item.order_id,
            item_id: item.shop_item_id,
            name: item.item_name || 'Article sans nom',
            price: item.price_at_time || 0,
            quantity: item.quantity,
            created_at: item.created_at
          };
        });

        return {
          id: order.id,
          shop_id: order.shop_id,
          customer_id: order.buyer_id,
          status: orderStatus,
          total_amount: order.total_amount,
          delivery_fee: deliveryFee,
          payment_status: paymentStatus,
          payment_method: order.payment_method || 'card',
          delivery_address: deliveryAddress,
          created_at: order.created_at,
          updated_at: order.created_at, // Utiliser created_at si updated_at n'existe pas
          items: items
        };
      });

      return orders;
    } catch (error) {
      console.error('Error getting orders by shop:', error);
      throw error;
    }
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('customer_id', customerId);

      if (error) {
        console.error('Error getting orders by customer:', error);
        throw error;
      }

      const orders: Order[] = data.map((order) => {
        // Convertir le statut en type OrderStatus
        let orderStatus: OrderStatus = 'pending';
        if (this.isValidOrderStatus(order.status)) {
          orderStatus = order.status as OrderStatus;
        }

        // Convertir le statut de paiement en type PaymentStatus
        let paymentStatus: PaymentStatus = 'pending';
        if (this.isValidPaymentStatus(order.payment_status)) {
          paymentStatus = order.payment_status as PaymentStatus;
        }

        // Assurer que l'adresse de livraison est correctement typée
        let deliveryAddress = {
          street: '',
          city: '',
          postal_code: '',
          country: ''
        };

        // Utiliser la structure d'adresse de livraison correcte
        if (order.shipping_address && typeof order.shipping_address === 'object') {
          deliveryAddress = {
            street: (order.shipping_address as any).street || '',
            city: (order.shipping_address as any).city || '',
            postal_code: (order.shipping_address as any).postal_code || '',
            country: (order.shipping_address as any).country || ''
          };
        }

        // Assigner 0 à delivery_fee si elle n'existe pas
        const deliveryFee = order.shipping_cost || 0;

        // Formater les items de commande
        const items: OrderItem[] = (order.order_items || []).map((item: any) => {
          return {
            id: item.id,
            order_id: item.order_id,
            item_id: item.shop_item_id,
            name: item.item_name || 'Article sans nom',
            price: item.price_at_time || 0,
            quantity: item.quantity,
            created_at: item.created_at
          };
        });

        return {
          id: order.id,
          shop_id: order.shop_id,
          customer_id: order.buyer_id,
          status: orderStatus,
          total_amount: order.total_amount,
          delivery_fee: deliveryFee,
          payment_status: paymentStatus,
          payment_method: order.payment_method || 'card',
          delivery_address: deliveryAddress,
          created_at: order.created_at,
          updated_at: order.created_at, // Utiliser created_at si updated_at n'existe pas
          items: items
        };
      });

      return orders;
    } catch (error) {
      console.error('Error getting orders by customer:', error);
      throw error;
    }
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      if (!data) return null;

      // Convertir le statut en type OrderStatus
      let orderStatus: OrderStatus = 'pending';
      if (this.isValidOrderStatus(data.status)) {
        orderStatus = data.status as OrderStatus;
      }

      // Convertir le statut de paiement en type PaymentStatus
      let paymentStatus: PaymentStatus = 'pending';
      if (this.isValidPaymentStatus(data.payment_status)) {
        paymentStatus = data.payment_status as PaymentStatus;
      }

      // Assurer que l'adresse de livraison est correctement typée
      let deliveryAddress = {
        street: '',
        city: '',
        postal_code: '',
        country: ''
      };

      // Utiliser la structure d'adresse de livraison correcte
      if (data.shipping_address && typeof data.shipping_address === 'object') {
        deliveryAddress = {
          street: (data.shipping_address as any).street || '',
          city: (data.shipping_address as any).city || '',
          postal_code: (data.shipping_address as any).postal_code || '',
          country: (data.shipping_address as any).country || ''
        };
      }

      // Assigner 0 à delivery_fee si elle n'existe pas
      const deliveryFee = data.shipping_cost || 0;

      // Formater les items de commande
      const items: OrderItem[] = (data.order_items || []).map((item: any) => {
        return {
          id: item.id,
          order_id: item.order_id,
          item_id: item.shop_item_id,
          name: item.item_name || 'Article sans nom',
          price: item.price_at_time || 0,
          quantity: item.quantity,
          created_at: item.created_at
        };
      });

      return {
        id: data.id,
        shop_id: data.shop_id,
        customer_id: data.buyer_id,
        status: orderStatus,
        total_amount: data.total_amount,
        delivery_fee: deliveryFee,
        payment_status: paymentStatus,
        payment_method: data.payment_method || 'card',
        delivery_address: deliveryAddress,
        created_at: data.created_at,
        updated_at: data.created_at, // Utiliser created_at si updated_at n'existe pas
        items: items
      };
    } catch (error) {
      console.error('Error getting order by id:', error);
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

  // Helper pour vérifier si un statut est valide
  private isValidOrderStatus(status: string): status is OrderStatus {
    return ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'].includes(status);
  }

  private isValidPaymentStatus(status: string): status is PaymentStatus {
    return ['pending', 'paid', 'refunded', 'failed'].includes(status);
  }

  async addToCart(cartItems: { user_id: string; item_id: string; shop_id: string; quantity: number; }[]): Promise<boolean> {
    try {
      // Convertir les propriétés pour correspondre au schéma de la base de données
      const formattedItems = cartItems.map(item => ({
        user_id: item.user_id,
        shop_item_id: item.item_id, // Renommer item_id en shop_item_id
        quantity: item.quantity,
        // Ne pas inclure shop_id car il n'est pas dans le schéma
      }));

      const { error } = await supabase
        .from('cart_items')
        .insert(formattedItems);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          shop_items(
            id,
            name,
            price,
            image_url,
            shop_id
          ),
          shop(
            id,
            name
          )
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error getting cart items:', error);
        throw error;
      }

      return data as CartItem[];
    } catch (error) {
      console.error('Error getting cart items:', error);
      throw error;
    }
  }

  async removeCartItem(itemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error('Error removing cart item:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error removing cart item:', error);
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
      console.error('Error clearing cart:', error);
      return false;
    }
  }
}
