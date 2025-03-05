
import { supabase } from '@/integrations/supabase/client';
import { IOrderRepository } from '../domain/interfaces/IOrderRepository';
import { Order, OrderItem, OrderStatus, PaymentStatus, ShippingStatus, CreateOrderParams, ShippingAddress, OrderFilter } from '../domain/types';
import { eventBus } from '@/core/event-bus/EventBus';
import { ORDER_EVENTS } from '../domain/events';

/**
 * Implémentation du repository des commandes utilisant Supabase
 */
export class SupabaseOrderRepository implements IOrderRepository {
  /**
   * Créer une nouvelle commande
   */
  async createOrder(params: CreateOrderParams): Promise<{ success: boolean; orderId?: string; error?: string; }> {
    try {
      // Calculer le montant total
      const totalAmount = params.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Préparer les données pour l'insertion
      const orderData: any = {
        status: params.status || 'pending',
        payment_status: params.paymentStatus || 'pending',
        shipping_status: params.shippingStatus || null,
        shipping_required: params.shippingRequired || false,
        buyer_id: params.buyerId,
        seller_id: params.sellerId,
        total_amount: totalAmount,
        commission_amount: params.commissionAmount || 0,
        shipping_cost: params.shippingCost || 0,
        transaction_type: params.transactionType || 'p2p',
        payment_method: params.paymentMethod || 'stripe'
      };
      
      // Ajouter l'adresse de livraison si présente
      if (params.shippingAddress) {
        orderData.shipping_address = params.shippingAddress;
      }

      // Insérer la commande
      const { data: order, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select('id')
        .single();

      if (error) {
        console.error('Erreur lors de la création de commande:', error);
        return { success: false, error: error.message };
      }

      // Insérer les articles de la commande
      const orderItems = params.items.map(item => ({
        order_id: order.id,
        shop_item_id: item.shopItemId,
        quantity: item.quantity,
        price_at_time: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Erreur lors de l\'ajout des articles:', itemsError);
        
        // Tentative de suppression de la commande incomplète
        await supabase.from('orders').delete().eq('id', order.id);
        
        return { success: false, error: itemsError.message };
      }

      // Événement de création de commande
      eventBus.publish(ORDER_EVENTS.ORDER_CREATED, {
        orderId: order.id,
        buyerId: params.buyerId,
        sellerId: params.sellerId,
        totalAmount
      });

      return {
        success: true,
        orderId: order.id
      };
    } catch (error: any) {
      console.error('Exception lors de la création de commande:', error);
      return { success: false, error: error.message || 'Erreur de création de commande' };
    }
  }

  /**
   * Récupérer une commande par son ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, buyer_id, seller_id, total_amount, status, payment_status, 
          shipping_status, shipping_required, shipping_address, 
          commission_amount, shipping_cost, created_at, confirmed_at, 
          cancelled_at, transaction_type, payment_method
        `)
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération de commande:', error);
        return null;
      }

      // Mapper les données de la commande au domaine
      const order: Order = {
        id: data.id,
        buyerId: data.buyer_id,
        sellerId: data.seller_id,
        totalAmount: data.total_amount,
        status: data.status as OrderStatus,
        paymentStatus: data.payment_status as PaymentStatus,
        shippingStatus: data.shipping_status as ShippingStatus,
        shippingRequired: data.shipping_required,
        commissionAmount: data.commission_amount,
        shippingCost: data.shipping_cost,
        createdAt: data.created_at,
        confirmedAt: data.confirmed_at,
        cancelledAt: data.cancelled_at,
        transactionType: data.transaction_type,
        paymentMethod: data.payment_method,
        deliveryType: 'shipping', // Valeur par défaut
        items: []
      };
      
      // Ajouter l'adresse de livraison si présente
      if (data.shipping_address) {
        order.shippingAddress = data.shipping_address as unknown as ShippingAddress;
      }

      // Récupérer les articles de la commande
      const { data: orderItemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          id, shop_item_id, quantity, price_at_time,
          shop_items:shop_items(
            id, price, shop_id,
            clothes:clothes(name, image_url, brand, category, size)
          )
        `)
        .eq('order_id', orderId);

      if (itemsError) {
        console.error('Erreur lors de la récupération des articles de commande:', itemsError);
      } else if (orderItemsData) {
        // Mapper les articles
        order.items = orderItemsData.map(item => {
          const orderItem: OrderItem = {
            id: item.id,
            shopItemId: item.shop_item_id,
            quantity: item.quantity,
            price: item.price_at_time,
            productName: item.shop_items?.clothes?.name || 'Article sans nom',
            imageUrl: item.shop_items?.clothes?.image_url || null,
            brand: item.shop_items?.clothes?.brand || null,
            category: item.shop_items?.clothes?.category || null,
            size: item.shop_items?.clothes?.size || null
          };
          return orderItem;
        });
      }

      eventBus.publish(ORDER_EVENTS.ORDER_FETCHED, { orderId });
      
      return order;
    } catch (error: any) {
      console.error('Exception lors de la récupération de commande:', error);
      return null;
    }
  }

  /**
   * Mise à jour du statut d'une commande
   */
  async updateOrderStatus(
    orderId: string, 
    status: OrderStatus, 
    paymentStatus?: PaymentStatus, 
    shippingStatus?: ShippingStatus
  ): Promise<{ success: boolean; error?: string; }> {
    try {
      const updateData: any = { status };
      
      if (paymentStatus) {
        updateData.payment_status = paymentStatus;
      }
      
      if (shippingStatus) {
        updateData.shipping_status = shippingStatus;
      }
      
      // Mettre à jour la date selon le statut
      if (status === 'completed' || status === 'shipped') {
        updateData.confirmed_at = new Date().toISOString();
      } else if (status === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);
      
      if (error) {
        console.error('Erreur lors de la mise à jour du statut de commande:', error);
        return { success: false, error: error.message };
      }
      
      eventBus.publish(ORDER_EVENTS.ORDER_STATUS_UPDATED, { 
        orderId, 
        status,
        paymentStatus,
        shippingStatus,
        timestamp: Date.now()
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Exception lors de la mise à jour du statut de commande:', error);
      return { success: false, error: error.message || 'Erreur de mise à jour de statut' };
    }
  }

  /**
   * Récupérer les commandes d'un acheteur
   */
  async getBuyerOrders(buyerId: string, filter?: OrderFilter): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select(`
          id, buyer_id, seller_id, total_amount, status, payment_status, 
          shipping_status, shipping_required, shipping_address, 
          commission_amount, shipping_cost, created_at, confirmed_at, 
          cancelled_at, transaction_type, payment_method
        `)
        .eq('buyer_id', buyerId);
      
      // Appliquer les filtres si présents
      if (filter) {
        if (filter.status) {
          query = query.eq('status', filter.status);
        }
        
        if (filter.paymentStatus) {
          query = query.eq('payment_status', filter.paymentStatus);
        }
        
        if (filter.shippingStatus) {
          query = query.eq('shipping_status', filter.shippingStatus);
        }
        
        // Date de début
        if (filter.createdAfter) {
          query = query.gte('created_at', filter.createdAfter.toISOString());
        }
        
        // Date de fin
        if (filter.createdBefore) {
          query = query.lte('created_at', filter.createdBefore.toISOString());
        }
        
        // Limite et offset pour la pagination
        if (filter.limit) {
          query = query.limit(filter.limit);
        }
        
        if (filter.offset) {
          query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1);
        }
      }
      
      // Ordonner par date de création décroissante par défaut
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Erreur lors de la récupération des commandes acheteur:', error);
        return [];
      }
      
      // Mapper les commandes
      const orders = data.map(item => {
        const order: Order = {
          id: item.id,
          buyerId: item.buyer_id,
          sellerId: item.seller_id,
          totalAmount: item.total_amount,
          status: item.status as OrderStatus,
          paymentStatus: item.payment_status as PaymentStatus,
          shippingStatus: item.shipping_status as ShippingStatus,
          shippingRequired: item.shipping_required,
          commissionAmount: item.commission_amount,
          shippingCost: item.shipping_cost,
          createdAt: item.created_at,
          confirmedAt: item.confirmed_at,
          cancelledAt: item.cancelled_at,
          transactionType: item.transaction_type,
          paymentMethod: item.payment_method,
          deliveryType: 'shipping', // Valeur par défaut
          items: []
        };
        
        // Ajouter l'adresse de livraison si présente
        if (item.shipping_address) {
          order.shippingAddress = item.shipping_address as unknown as ShippingAddress;
        }
        
        return order;
      });
      
      // Récupérer les articles pour chaque commande
      for (const order of orders) {
        const { data: orderItemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            id, shop_item_id, quantity, price_at_time,
            shop_items:shop_items(
              id, price, shop_id,
              clothes:clothes(name, image_url, brand, category, size)
            )
          `)
          .eq('order_id', order.id);
        
        if (!itemsError && orderItemsData) {
          order.items = orderItemsData.map(item => {
            const orderItem: OrderItem = {
              id: item.id,
              shopItemId: item.shop_item_id,
              quantity: item.quantity,
              price: item.price_at_time,
              productName: item.shop_items?.clothes?.name || 'Article sans nom',
              imageUrl: item.shop_items?.clothes?.image_url || null,
              brand: item.shop_items?.clothes?.brand || null,
              category: item.shop_items?.clothes?.category || null,
              size: item.shop_items?.clothes?.size || null
            };
            return orderItem;
          });
        }
      }
      
      return orders;
    } catch (error: any) {
      console.error('Exception lors de la récupération des commandes acheteur:', error);
      return [];
    }
  }

  /**
   * Récupère les articles d'une commande
   */
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          id, shop_item_id, quantity, price_at_time,
          shop_items:shop_items(
            id, price, shop_id,
            clothes:clothes(name, image_url, brand, category, size)
          )
        `)
        .eq('order_id', orderId);
        
      if (error) {
        console.error('Erreur lors de la récupération des articles:', error);
        return [];
      }
      
      return data.map(item => ({
        id: item.id,
        shopItemId: item.shop_item_id,
        quantity: item.quantity,
        price: item.price_at_time,
        productName: item.shop_items?.clothes?.name || 'Article sans nom',
        imageUrl: item.shop_items?.clothes?.image_url || null,
        brand: item.shop_items?.clothes?.brand || null,
        category: item.shop_items?.clothes?.category || null,
        size: item.shop_items?.clothes?.size || null
      }));
    } catch (error: any) {
      console.error('Exception lors de la récupération des articles:', error);
      return [];
    }
  }

  /**
   * Récupérer les commandes d'un vendeur
   */
  async getSellerOrders(sellerId: string, filter?: OrderFilter): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select(`
          id, buyer_id, seller_id, total_amount, status, payment_status, 
          shipping_status, shipping_required, shipping_address, 
          commission_amount, shipping_cost, created_at, confirmed_at, 
          cancelled_at, transaction_type, payment_method
        `)
        .eq('seller_id', sellerId);
      
      // Appliquer les filtres si présents
      if (filter) {
        if (filter.status) {
          query = query.eq('status', filter.status);
        }
        
        if (filter.paymentStatus) {
          query = query.eq('payment_status', filter.paymentStatus);
        }
        
        if (filter.shippingStatus) {
          query = query.eq('shipping_status', filter.shippingStatus);
        }
        
        // Date de début
        if (filter.createdAfter) {
          query = query.gte('created_at', filter.createdAfter.toISOString());
        }
        
        // Date de fin
        if (filter.createdBefore) {
          query = query.lte('created_at', filter.createdBefore.toISOString());
        }
        
        // Limite et offset pour la pagination
        if (filter.limit) {
          query = query.limit(filter.limit);
        }
        
        if (filter.offset) {
          query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1);
        }
      }
      
      // Ordonner par date de création décroissante par défaut
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Erreur lors de la récupération des commandes vendeur:', error);
        return [];
      }
      
      // Mapper les commandes
      const orders = data.map(item => {
        const order: Order = {
          id: item.id,
          buyerId: item.buyer_id,
          sellerId: item.seller_id,
          totalAmount: item.total_amount,
          status: item.status as OrderStatus,
          paymentStatus: item.payment_status as PaymentStatus,
          shippingStatus: item.shipping_status as ShippingStatus,
          shippingRequired: item.shipping_required,
          commissionAmount: item.commission_amount,
          shippingCost: item.shipping_cost,
          createdAt: item.created_at,
          confirmedAt: item.confirmed_at,
          cancelledAt: item.cancelled_at,
          transactionType: item.transaction_type,
          paymentMethod: item.payment_method,
          deliveryType: 'shipping', // Valeur par défaut
          items: []
        };
        
        // Ajouter l'adresse de livraison si présente
        if (item.shipping_address) {
          order.shippingAddress = item.shipping_address as unknown as ShippingAddress;
        }
        
        return order;
      });
      
      // Récupérer les articles pour chaque commande
      for (const order of orders) {
        const { data: orderItemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            id, shop_item_id, quantity, price_at_time,
            shop_items:shop_items(
              id, price, shop_id,
              clothes:clothes(name, image_url, brand, category, size)
            )
          `)
          .eq('order_id', order.id);
        
        if (!itemsError && orderItemsData) {
          order.items = orderItemsData.map(item => {
            const orderItem: OrderItem = {
              id: item.id,
              shopItemId: item.shop_item_id,
              quantity: item.quantity,
              price: item.price_at_time,
              productName: item.shop_items?.clothes?.name || 'Article sans nom',
              imageUrl: item.shop_items?.clothes?.image_url || null,
              brand: item.shop_items?.clothes?.brand || null,
              category: item.shop_items?.clothes?.category || null,
              size: item.shop_items?.clothes?.size || null
            };
            return orderItem;
          });
        }
      }
      
      return orders;
    } catch (error: any) {
      console.error('Exception lors de la récupération des commandes vendeur:', error);
      return [];
    }
  }

  /**
   * Met à jour une commande
   */
  async updateOrder(orderId: string, updates: Partial<Order>): Promise<boolean> {
    try {
      // Convertir des champs en format base de données
      const dbUpdates: any = {};
      
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.paymentStatus) dbUpdates.payment_status = updates.paymentStatus;
      if (updates.shippingStatus) dbUpdates.shipping_status = updates.shippingStatus;
      if (updates.totalAmount) dbUpdates.total_amount = updates.totalAmount;
      if (updates.commissionAmount) dbUpdates.commission_amount = updates.commissionAmount;
      if (updates.shippingCost) dbUpdates.shipping_cost = updates.shippingCost;
      if (updates.shippingAddress) dbUpdates.shipping_address = updates.shippingAddress;
      if (updates.shippingRequired !== undefined) dbUpdates.shipping_required = updates.shippingRequired;
      if (updates.paymentMethod) dbUpdates.payment_method = updates.paymentMethod;
      if (updates.stripePaymentIntentId) dbUpdates.stripe_payment_intent_id = updates.stripePaymentIntentId;
      if (updates.stripeSessionId) dbUpdates.stripe_session_id = updates.stripeSessionId;
      
      const { error } = await supabase
        .from('orders')
        .update(dbUpdates)
        .eq('id', orderId);
      
      if (error) {
        console.error('Erreur lors de la mise à jour de la commande:', error);
        return false;
      }
      
      eventBus.publish(ORDER_EVENTS.ORDER_UPDATED, {
        orderId,
        updates,
        timestamp: Date.now()
      });
      
      return true;
    } catch (error) {
      console.error('Exception lors de la mise à jour de la commande:', error);
      return false;
    }
  }

  /**
   * Traite le paiement d'une commande
   */
  async processPayment(orderId: string, paymentMethodId: string): Promise<boolean> {
    try {
      // Appel à la fonction RPC Supabase pour le traitement du paiement
      const { data, error } = await supabase.rpc('process_order_payment', {
        order_id: orderId,
        payment_method_id: paymentMethodId
      });
      
      if (error) {
        console.error('Erreur lors du traitement du paiement:', error);
        
        eventBus.publish(ORDER_EVENTS.PAYMENT_FAILED, {
          orderId,
          error: error.message,
          timestamp: Date.now()
        });
        
        return false;
      }
      
      eventBus.publish(ORDER_EVENTS.PAYMENT_PROCESSED, {
        orderId,
        paymentMethodId,
        timestamp: Date.now()
      });
      
      return true;
    } catch (error) {
      console.error('Exception lors du traitement du paiement:', error);
      
      eventBus.publish(ORDER_EVENTS.PAYMENT_FAILED, {
        orderId,
        error: 'Erreur interne lors du traitement du paiement',
        timestamp: Date.now()
      });
      
      return false;
    }
  }
}
