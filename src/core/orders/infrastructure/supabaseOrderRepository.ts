
/**
 * Implémentation du repository de commandes utilisant Supabase
 */
import { supabase } from '@/integrations/supabase/client';
import { IOrderRepository } from '../domain/interfaces/IOrderRepository';
import { 
  Order, 
  OrderStatus, 
  PaymentStatus,
  OrderItem, 
  CreateOrderParams,
  OrderFilter,
  ShippingAddress,
  DeliveryType
} from '../domain/types';
import { eventBus } from '@/core/event-bus/EventBus';
import { ORDER_EVENTS } from '../domain/events';

export class SupabaseOrderRepository implements IOrderRepository {
  /**
   * Cache des commandes par ID
   */
  private orderCache: Map<string, Order> = new Map();
  
  /**
   * Crée une nouvelle commande
   */
  async createOrder(params: CreateOrderParams): Promise<Order | null> {
    try {
      // Calculer le montant total à partir des articles
      let totalAmount = 0;
      params.items.forEach(item => {
        totalAmount += item.price * item.quantity;
      });
      
      // Ajouter les frais d'expédition si nécessaire
      if (params.shippingRequired && params.shippingCost) {
        totalAmount += params.shippingCost;
      }
      
      // Préparation des données de commande pour Supabase
      const orderData: any = {
        buyer_id: params.buyerId,
        seller_id: params.sellerId,
        total_amount: totalAmount,
        commission_amount: params.commissionAmount || 0,
        shipping_required: params.shippingRequired || false,
        shipping_cost: params.shippingCost || 0,
        payment_method: params.paymentMethod || 'card',
        delivery_type: params.deliveryType || 'in_person'
      };
      
      // Ajouter l'adresse de livraison si nécessaire
      if (params.shippingAddress) {
        orderData.shipping_address = params.shippingAddress as any;
      }
      
      // Insérer la nouvelle commande dans la base de données
      const { data: orderData1, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select('*')
        .single();
        
      if (orderError) {
        console.error('Erreur lors de la création de la commande:', orderError);
        return null;
      }
      
      // Insérer les articles de la commande
      const orderItems = params.items.map(item => ({
        order_id: orderData1.id,
        shop_item_id: item.shopItemId,
        quantity: item.quantity,
        price_at_time: item.price
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) {
        console.error('Erreur lors de l\'ajout des articles à la commande:', itemsError);
        // Idéalement, on annulerait la commande ici, mais pour simplifier...
        return null;
      }
      
      // Construire et retourner l'objet Order
      const order: Order = {
        id: orderData1.id,
        buyerId: orderData1.buyer_id,
        sellerId: orderData1.seller_id,
        status: orderData1.status as OrderStatus,
        paymentStatus: orderData1.payment_status as PaymentStatus,
        totalAmount: orderData1.total_amount,
        commissionAmount: orderData1.commission_amount,
        createdAt: orderData1.created_at,
        updatedAt: orderData1.updated_at,
        stripePaymentIntentId: orderData1.stripe_payment_intent_id,
        stripeSessionId: orderData1.stripe_session_id,
        deliveryType: orderData1.delivery_type as DeliveryType,
        shippingAddress: orderData1.shipping_address as ShippingAddress,
        shippingRequired: orderData1.shipping_required,
        shippingCost: orderData1.shipping_cost,
        paymentMethod: orderData1.payment_method,
        items: []  // Les articles seront chargés séparément si nécessaire
      };
      
      // Mettre à jour le cache
      this.orderCache.set(order.id, order);
      
      // Publier l'événement de création de commande
      eventBus.publish(ORDER_EVENTS.ORDER_CREATED, { order });
      
      return order;
    } catch (error) {
      console.error('Exception lors de la création de la commande:', error);
      return null;
    }
  }
  
  /**
   * Obtient une commande par son ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      // Vérifier d'abord le cache
      if (this.orderCache.has(orderId)) {
        return this.orderCache.get(orderId)!;
      }
      
      // Récupérer la commande depuis Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
        
      if (orderError) {
        console.error('Erreur lors de la récupération de la commande:', orderError);
        return null;
      }
      
      // Construire l'objet Order
      const order: Order = {
        id: orderData.id,
        buyerId: orderData.buyer_id,
        sellerId: orderData.seller_id,
        status: orderData.status as OrderStatus,
        paymentStatus: orderData.payment_status as PaymentStatus,
        totalAmount: orderData.total_amount,
        commissionAmount: orderData.commission_amount,
        createdAt: orderData.created_at,
        updatedAt: orderData.updated_at,
        stripePaymentIntentId: orderData.stripe_payment_intent_id,
        stripeSessionId: orderData.stripe_session_id,
        deliveryType: orderData.delivery_type as DeliveryType,
        shippingAddress: orderData.shipping_address as ShippingAddress,
        shippingRequired: orderData.shipping_required,
        shippingCost: orderData.shipping_cost,
        paymentMethod: orderData.payment_method,
        items: []
      };
      
      // Récupérer les articles de la commande
      const { data: orderItemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*, shop_items!inner(*)')
        .eq('order_id', orderId);
        
      if (!itemsError && orderItemsData) {
        // Transformer les données des articles
        const items: OrderItem[] = orderItemsData.map(item => ({
          id: item.id,
          orderId: item.order_id,
          shopItemId: item.shop_item_id,
          quantity: item.quantity,
          price: item.price_at_time,
          shopItem: {
            id: item.shop_items.id,
            name: item.shop_items.name || 'Produit sans nom',
            price: item.shop_items.price,
            imageUrl: item.shop_items.image_url
          }
        }));
        
        order.items = items;
      }
      
      // Mettre à jour le cache
      this.orderCache.set(order.id, order);
      
      return order;
    } catch (error) {
      console.error('Exception lors de la récupération de la commande:', error);
      return null;
    }
  }
  
  /**
   * Met à jour une commande
   */
  async updateOrder(orderId: string, updates: Partial<Order>): Promise<boolean> {
    try {
      // Préparer les données de mise à jour pour Supabase
      const updateData: any = {};
      
      if (updates.status) updateData.status = updates.status;
      if (updates.paymentStatus) updateData.payment_status = updates.paymentStatus;
      if (updates.totalAmount !== undefined) updateData.total_amount = updates.totalAmount;
      if (updates.commissionAmount !== undefined) updateData.commission_amount = updates.commissionAmount;
      if (updates.stripePaymentIntentId) updateData.stripe_payment_intent_id = updates.stripePaymentIntentId;
      if (updates.stripeSessionId) updateData.stripe_session_id = updates.stripeSessionId;
      if (updates.deliveryType) updateData.delivery_type = updates.deliveryType;
      if (updates.shippingAddress) updateData.shipping_address = updates.shippingAddress as any;
      if (updates.shippingRequired !== undefined) updateData.shipping_required = updates.shippingRequired;
      if (updates.shippingCost !== undefined) updateData.shipping_cost = updates.shippingCost;
      if (updates.paymentMethod) updateData.payment_method = updates.paymentMethod;
      
      // Ajouter le timestamp de mise à jour
      updateData.updated_at = new Date().toISOString();
      
      // Mettre à jour la commande dans Supabase
      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);
        
      if (error) {
        console.error('Erreur lors de la mise à jour de la commande:', error);
        return false;
      }
      
      // Invalider le cache
      this.orderCache.delete(orderId);
      
      // Publier l'événement de mise à jour de commande
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
   * Récupère les commandes d'un acheteur
   */
  async getBuyerOrders(buyerId: string, filter?: OrderFilter): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .eq('buyer_id', buyerId);
      
      // Appliquer les filtres
      if (filter) {
        if (filter.status) {
          query = query.eq('status', filter.status);
        }
        if (filter.dateFrom) {
          query = query.gte('created_at', filter.dateFrom.toISOString());
        }
        if (filter.dateTo) {
          query = query.lte('created_at', filter.dateTo.toISOString());
        }
        
        // Tri et pagination
        if (filter.orderBy) {
          const direction = filter.orderDirection || 'desc';
          query = query.order(filter.orderBy, { ascending: direction === 'asc' });
        } else {
          query = query.order('created_at', { ascending: false });
        }
        
        if (filter.limit) {
          query = query.limit(filter.limit);
        }
        if (filter.offset) {
          query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1);
        }
      } else {
        // Par défaut, trier par date de création (plus récent d'abord)
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Erreur lors de la récupération des commandes de l\'acheteur:', error);
        return [];
      }
      
      // Transformer les données
      const orders: Order[] = data.map(orderData => ({
        id: orderData.id,
        buyerId: orderData.buyer_id,
        sellerId: orderData.seller_id,
        status: orderData.status as OrderStatus,
        paymentStatus: orderData.payment_status as PaymentStatus,
        totalAmount: orderData.total_amount,
        commissionAmount: orderData.commission_amount,
        createdAt: orderData.created_at,
        updatedAt: orderData.updated_at,
        stripePaymentIntentId: orderData.stripe_payment_intent_id,
        stripeSessionId: orderData.stripe_session_id,
        deliveryType: orderData.delivery_type as DeliveryType,
        shippingAddress: orderData.shipping_address as ShippingAddress,
        shippingRequired: orderData.shipping_required,
        shippingCost: orderData.shipping_cost,
        paymentMethod: orderData.payment_method,
        items: []  // Les articles seront chargés séparément si nécessaire
      }));
      
      // Mettre à jour le cache
      orders.forEach(order => {
        this.orderCache.set(order.id, order);
      });
      
      return orders;
    } catch (error) {
      console.error('Exception lors de la récupération des commandes de l\'acheteur:', error);
      return [];
    }
  }
  
  /**
   * Récupère les commandes d'un vendeur
   */
  async getSellerOrders(sellerId: string, filter?: OrderFilter): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .eq('seller_id', sellerId);
      
      // Appliquer les filtres (même logique que getBuyerOrders)
      if (filter) {
        if (filter.status) {
          query = query.eq('status', filter.status);
        }
        if (filter.dateFrom) {
          query = query.gte('created_at', filter.dateFrom.toISOString());
        }
        if (filter.dateTo) {
          query = query.lte('created_at', filter.dateTo.toISOString());
        }
        
        // Tri et pagination
        if (filter.orderBy) {
          const direction = filter.orderDirection || 'desc';
          query = query.order(filter.orderBy, { ascending: direction === 'asc' });
        } else {
          query = query.order('created_at', { ascending: false });
        }
        
        if (filter.limit) {
          query = query.limit(filter.limit);
        }
        if (filter.offset) {
          query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1);
        }
      } else {
        // Par défaut, trier par date de création (plus récent d'abord)
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Erreur lors de la récupération des commandes du vendeur:', error);
        return [];
      }
      
      // Transformer les données
      const orders: Order[] = data.map(orderData => ({
        id: orderData.id,
        buyerId: orderData.buyer_id,
        sellerId: orderData.seller_id,
        status: orderData.status as OrderStatus,
        paymentStatus: orderData.payment_status as PaymentStatus,
        totalAmount: orderData.total_amount,
        commissionAmount: orderData.commission_amount,
        createdAt: orderData.created_at,
        updatedAt: orderData.updated_at,
        stripePaymentIntentId: orderData.stripe_payment_intent_id,
        stripeSessionId: orderData.stripe_session_id,
        deliveryType: orderData.delivery_type as DeliveryType,
        shippingAddress: orderData.shipping_address as ShippingAddress,
        shippingRequired: orderData.shipping_required,
        shippingCost: orderData.shipping_cost,
        paymentMethod: orderData.payment_method,
        items: []  // Les articles seront chargés séparément si nécessaire
      }));
      
      // Mettre à jour le cache
      orders.forEach(order => {
        this.orderCache.set(order.id, order);
      });
      
      return orders;
    } catch (error) {
      console.error('Exception lors de la récupération des commandes du vendeur:', error);
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
          id,
          order_id,
          shop_item_id,
          quantity,
          price_at_time,
          shop_items!inner(
            id,
            price,
            clothes_id
          )
        `)
        .eq('order_id', orderId);
        
      if (error) {
        console.error('Erreur lors de la récupération des articles de la commande:', error);
        return [];
      }
      
      // Récupérer les informations sur les vêtements associés aux articles
      const clothesIds = data.map(item => item.shop_items.clothes_id).filter(Boolean);
      let clothesData: any = {};
      
      if (clothesIds.length > 0) {
        const { data: clothesItems, error: clothesError } = await supabase
          .from('clothes')
          .select('id, name, category, image_url')
          .in('id', clothesIds);
          
        if (!clothesError && clothesItems) {
          clothesData = clothesItems.reduce((acc: any, item: any) => {
            acc[item.id] = item;
            return acc;
          }, {});
        }
      }
      
      // Transformer les données des articles
      const items: OrderItem[] = data.map(item => {
        const clothesId = item.shop_items.clothes_id;
        const clothes = clothesId ? clothesData[clothesId] : null;
        
        return {
          id: item.id,
          orderId: item.order_id,
          shopItemId: item.shop_item_id,
          quantity: item.quantity,
          price: item.price_at_time,
          shopItem: {
            id: item.shop_items.id,
            price: item.shop_items.price,
            name: clothes ? clothes.name : 'Produit',
            category: clothes ? clothes.category : 'Autre',
            imageUrl: clothes ? clothes.image_url : null
          }
        };
      });
      
      // Mettre à jour le cache de la commande si elle existe
      if (this.orderCache.has(orderId)) {
        const order = this.orderCache.get(orderId)!;
        order.items = items;
        this.orderCache.set(orderId, order);
      }
      
      return items;
    } catch (error) {
      console.error('Exception lors de la récupération des articles de la commande:', error);
      return [];
    }
  }
  
  /**
   * Traite le paiement d'une commande
   */
  async processPayment(orderId: string, paymentMethodId: string): Promise<boolean> {
    try {
      // Appel de la fonction RPC Supabase pour traiter le paiement
      const { data, error } = await supabase
        .rpc('process_order_payment', { 
          order_id: orderId,
          payment_method_id: paymentMethodId
        });
        
      if (error) {
        console.error('Erreur lors du traitement du paiement:', error);
        return false;
      }
      
      // Publier l'événement de paiement traité
      eventBus.publish(ORDER_EVENTS.PAYMENT_PROCESSED, { 
        orderId,
        success: true,
        timestamp: Date.now()
      });
      
      // Invalider le cache
      this.orderCache.delete(orderId);
      
      return true;
    } catch (error) {
      console.error('Exception lors du traitement du paiement:', error);
      
      // Publier l'événement d'échec de paiement
      eventBus.publish(ORDER_EVENTS.PAYMENT_FAILED, { 
        orderId,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        timestamp: Date.now()
      });
      
      return false;
    }
  }
}
