
/**
 * Implémentation Supabase du repository des commandes
 * Utilise Supabase pour stocker et récupérer les commandes
 */
import { supabase } from '@/integrations/supabase/client';
import { IOrderRepository } from '../domain/interfaces/IOrderRepository';
import { Order, OrderItem, CreateOrderParams, OrderFilter, ShippingAddress } from '../domain/types';
import { eventBus } from '@/core/event-bus/EventBus';
import { ORDER_EVENTS } from '../domain/events';
import { Database } from '@/integrations/supabase/types';

export class SupabaseOrderRepository implements IOrderRepository {
  /**
   * Crée une nouvelle commande
   */
  async createOrder(params: CreateOrderParams): Promise<Order | null> {
    try {
      // Sérialiser l'adresse de livraison si présente
      const orderData = {
        ...params,
        status: 'pending',
        payment_status: 'pending',
        shipping_status: params.shipping_required ? 'pending' : null,
        // S'assurer que l'adresse de livraison est un objet JSON valide
        shipping_address: params.shipping_address ? params.shipping_address : null,
      };

      // Insérer la commande dans la base de données
      const { data: order, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création de la commande:', error);
        return null;
      }

      // Si nous avons des articles à ajouter à la commande
      if (params.items && params.items.length > 0) {
        const orderItems = params.items.map(item => ({
          order_id: order.id,
          shop_item_id: item.shop_item_id,
          quantity: item.quantity,
          price_at_time: item.price
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error('Erreur lors de l\'ajout des articles à la commande:', itemsError);
          // Supprimer la commande si l'ajout des articles échoue
          await supabase.from('orders').delete().eq('id', order.id);
          return null;
        }
      }

      // Récupérer la commande complète avec ses articles
      const createdOrder = await this.getOrderById(order.id);
      
      // Publier l'événement de création de commande
      if (createdOrder) {
        eventBus.publish(ORDER_EVENTS.ORDER_CREATED, {
          order: createdOrder,
          timestamp: Date.now()
        });
      }

      return createdOrder;
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
      // Récupérer la commande
      const { data: order, error } = await supabase
        .from('orders')
        .select()
        .eq('id', orderId)
        .maybeSingle();

      if (error || !order) {
        console.error('Erreur lors de la récupération de la commande:', error);
        return null;
      }

      // Convertir les données de la base de données en objet Order
      const formattedOrder: Order = {
        id: order.id,
        buyer_id: order.buyer_id,
        seller_id: order.seller_id,
        status: order.status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        payment_type: order.payment_type,
        total_amount: Number(order.total_amount),
        commission_amount: order.commission_amount ? Number(order.commission_amount) : 0,
        shipping_required: order.shipping_required || false,
        shipping_method: order.shipping_method || null,
        shipping_status: order.shipping_status || null,
        // Utiliser un cast pour convertir l'adresse de livraison
        shipping_address: order.shipping_address ? (order.shipping_address as unknown as ShippingAddress) : null,
        shipping_cost: order.shipping_cost ? Number(order.shipping_cost) : 0,
        delivery_type: order.delivery_type || 'in_person',
        meeting_location: order.meeting_location || null,
        meeting_time: order.meeting_time ? new Date(order.meeting_time) : null,
        buyer_confirmed: order.buyer_confirmed || false,
        seller_confirmed: order.seller_confirmed || false,
        confirmed_at: order.confirmed_at ? new Date(order.confirmed_at) : null,
        cancelled_at: order.cancelled_at ? new Date(order.cancelled_at) : null,
        cancellation_reason: order.cancellation_reason || null,
        stripe_payment_intent_id: order.stripe_payment_intent_id || null,
        stripe_session_id: order.stripe_session_id || null,
        created_at: new Date(order.created_at),
        items: [],  // Sera rempli après
      };

      // Récupérer les articles de la commande
      const { data: orderItemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          id, 
          quantity, 
          price_at_time,
          shop_item_id,
          shop_items (
            id, 
            price, 
            original_price,
            clothes_id,
            clothes (
              id, 
              name, 
              image_url, 
              brand,
              category, 
              size
            )
          )
        `)
        .eq('order_id', orderId);

      if (itemsError) {
        console.error('Erreur lors de la récupération des articles de la commande:', itemsError);
        return formattedOrder;  // Retourner la commande sans les articles
      }

      // Transformer les données en objets OrderItem
      formattedOrder.items = (orderItemsData || []).map(item => {
        const shopItem = item.shop_items;
        const clothes = shopItem?.clothes;

        const orderItem: OrderItem = {
          id: item.id,
          shop_item_id: item.shop_item_id,
          quantity: item.quantity,
          price: Number(item.price_at_time),
          item_name: clothes?.name || 'Article inconnu',  // Utiliser le nom du vêtement s'il existe
          image_url: clothes?.image_url || null,
          // Ajouter d'autres propriétés si nécessaire
          brand: clothes?.brand || null,
          category: clothes?.category || null,
          size: clothes?.size || null,
        };

        return orderItem;
      });

      return formattedOrder;
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
      // Préparer les données à mettre à jour
      const updateData: any = { ...updates };
      
      // Supprimer les champs qui ne doivent pas être mis à jour directement
      delete updateData.id;
      delete updateData.items;
      delete updateData.created_at;
      
      // Convertir les dates en format ISO si nécessaire
      if (updateData.meeting_time instanceof Date) {
        updateData.meeting_time = updateData.meeting_time.toISOString();
      }
      
      if (updateData.confirmed_at instanceof Date) {
        updateData.confirmed_at = updateData.confirmed_at.toISOString();
      }
      
      if (updateData.cancelled_at instanceof Date) {
        updateData.cancelled_at = updateData.cancelled_at.toISOString();
      }
      
      // Mettre à jour la commande
      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);
      
      if (error) {
        console.error('Erreur lors de la mise à jour de la commande:', error);
        return false;
      }
      
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
        .select()
        .eq('buyer_id', buyerId);
      
      // Appliquer les filtres si présents
      if (filter) {
        if (filter.status) {
          query = query.eq('status', filter.status);
        }
        
        if (filter.startDate) {
          query = query.gte('created_at', filter.startDate.toISOString());
        }
        
        if (filter.endDate) {
          query = query.lte('created_at', filter.endDate.toISOString());
        }
      }
      
      // Trier par date de création (plus récent en premier)
      query = query.order('created_at', { ascending: false });
      
      const { data: orders, error } = await query;
      
      if (error) {
        console.error('Erreur lors de la récupération des commandes de l\'acheteur:', error);
        return [];
      }
      
      // Convertir les données en objets Order
      const formattedOrders: Order[] = await Promise.all(
        (orders || []).map(async (order) => {
          // Construction de l'objet Order à partir des données brutes
          const formattedOrder: Order = {
            id: order.id,
            buyer_id: order.buyer_id,
            seller_id: order.seller_id,
            status: order.status,
            payment_status: order.payment_status,
            payment_method: order.payment_method,
            payment_type: order.payment_type,
            total_amount: Number(order.total_amount),
            commission_amount: order.commission_amount ? Number(order.commission_amount) : 0,
            shipping_required: order.shipping_required || false,
            shipping_method: order.shipping_method || null,
            shipping_status: order.shipping_status || null,
            shipping_address: order.shipping_address ? (order.shipping_address as unknown as ShippingAddress) : null,
            shipping_cost: order.shipping_cost ? Number(order.shipping_cost) : 0,
            delivery_type: order.delivery_type || 'in_person',
            meeting_location: order.meeting_location || null,
            meeting_time: order.meeting_time ? new Date(order.meeting_time) : null,
            buyer_confirmed: order.buyer_confirmed || false,
            seller_confirmed: order.seller_confirmed || false,
            confirmed_at: order.confirmed_at ? new Date(order.confirmed_at) : null,
            cancelled_at: order.cancelled_at ? new Date(order.cancelled_at) : null,
            cancellation_reason: order.cancellation_reason || null,
            stripe_payment_intent_id: order.stripe_payment_intent_id || null,
            stripe_session_id: order.stripe_session_id || null,
            created_at: new Date(order.created_at),
            items: [], // Sera rempli par getOrderItems
          };
          
          // Récupérer les articles de la commande
          formattedOrder.items = await this.getOrderItems(order.id);
          
          return formattedOrder;
        })
      );
      
      return formattedOrders;
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
        .select()
        .eq('seller_id', sellerId);
      
      // Appliquer les filtres si présents
      if (filter) {
        if (filter.status) {
          query = query.eq('status', filter.status);
        }
        
        if (filter.startDate) {
          query = query.gte('created_at', filter.startDate.toISOString());
        }
        
        if (filter.endDate) {
          query = query.lte('created_at', filter.endDate.toISOString());
        }
      }
      
      // Trier par date de création (plus récent en premier)
      query = query.order('created_at', { ascending: false });
      
      const { data: orders, error } = await query;
      
      if (error) {
        console.error('Erreur lors de la récupération des commandes du vendeur:', error);
        return [];
      }
      
      // Convertir les données en objets Order
      const formattedOrders: Order[] = await Promise.all(
        (orders || []).map(async (order) => {
          // Construction de l'objet Order à partir des données brutes
          const formattedOrder: Order = {
            id: order.id,
            buyer_id: order.buyer_id,
            seller_id: order.seller_id,
            status: order.status,
            payment_status: order.payment_status,
            payment_method: order.payment_method,
            payment_type: order.payment_type,
            total_amount: Number(order.total_amount),
            commission_amount: order.commission_amount ? Number(order.commission_amount) : 0,
            shipping_required: order.shipping_required || false,
            shipping_method: order.shipping_method || null,
            shipping_status: order.shipping_status || null,
            shipping_address: order.shipping_address ? (order.shipping_address as unknown as ShippingAddress) : null,
            shipping_cost: order.shipping_cost ? Number(order.shipping_cost) : 0,
            delivery_type: order.delivery_type || 'in_person',
            meeting_location: order.meeting_location || null,
            meeting_time: order.meeting_time ? new Date(order.meeting_time) : null,
            buyer_confirmed: order.buyer_confirmed || false,
            seller_confirmed: order.seller_confirmed || false,
            confirmed_at: order.confirmed_at ? new Date(order.confirmed_at) : null,
            cancelled_at: order.cancelled_at ? new Date(order.cancelled_at) : null,
            cancellation_reason: order.cancellation_reason || null,
            stripe_payment_intent_id: order.stripe_payment_intent_id || null,
            stripe_session_id: order.stripe_session_id || null,
            created_at: new Date(order.created_at),
            items: [], // Sera rempli par getOrderItems
          };
          
          // Récupérer les articles de la commande
          formattedOrder.items = await this.getOrderItems(order.id);
          
          return formattedOrder;
        })
      );
      
      return formattedOrders;
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
          quantity, 
          price_at_time,
          shop_item_id,
          shop_items (
            id, 
            price, 
            original_price,
            clothes_id,
            clothes (
              id, 
              name, 
              image_url, 
              brand,
              category, 
              size
            )
          )
        `)
        .eq('order_id', orderId);
      
      if (error) {
        console.error('Erreur lors de la récupération des articles de la commande:', error);
        return [];
      }
      
      // Transformer les données en objets OrderItem
      const orderItems: OrderItem[] = (data || []).map(item => {
        const shopItem = item.shop_items;
        const clothes = shopItem?.clothes;
        
        const orderItem: OrderItem = {
          id: item.id,
          shop_item_id: item.shop_item_id,
          quantity: item.quantity,
          price: Number(item.price_at_time),
          item_name: clothes?.name || 'Article inconnu',
          image_url: clothes?.image_url || null,
          brand: clothes?.brand || null,
          category: clothes?.category || null,
          size: clothes?.size || null,
        };
        
        return orderItem;
      });
      
      return orderItems;
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
      // Vérifier d'abord si la commande existe et est dans un état permettant le paiement
      const order = await this.getOrderById(orderId);
      
      if (!order) {
        console.error('Commande non trouvée pour le traitement du paiement');
        return false;
      }
      
      if (order.status !== 'pending' || order.payment_status !== 'pending') {
        console.error('La commande n\'est pas dans un état permettant le paiement');
        return false;
      }
      
      // Appeler la fonction RPC de Supabase pour traiter le paiement
      // Cette fonction est définie dans la base de données
      const { data, error } = await supabase.rpc('process_order_payment', {
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
        timestamp: Date.now()
      });
      
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
