
/**
 * Repository des commandes utilisant Supabase
 * Implémente l'interface IOrderRepository
 */
import { supabase } from '@/integrations/supabase/client';
import { IOrderRepository } from '../domain/interfaces/IOrderRepository';
import { Order, OrderCreateRequest, OrderResult, OrdersResult, OrderUpdateRequest } from '../domain/types';
import { eventBus } from '@/core/event-bus/EventBus';
import { ORDER_EVENTS } from '../domain/events';

export class SupabaseOrderRepository implements IOrderRepository {
  /**
   * Crée une nouvelle commande
   */
  async createOrder(orderData: OrderCreateRequest): Promise<OrderResult> {
    try {
      // 1. Valider les données d'entrée
      if (!orderData.buyerId || !orderData.sellerId || !orderData.items.length) {
        return { 
          order: null, 
          error: "Données de commande invalides" 
        };
      }

      // 2. Calculer le montant total
      let totalAmount = 0;
      const itemsWithPrice = [];

      // Récupérer les prix pour chaque article
      for (const item of orderData.items) {
        const { data: shopItem, error: shopItemError } = await supabase
          .from('shop_items')
          .select('price')
          .eq('id', item.shopItemId)
          .single();

        if (shopItemError || !shopItem) {
          return { 
            order: null, 
            error: `Article non trouvé: ${shopItemError?.message || 'Article introuvable'}` 
          };
        }

        const itemTotal = shopItem.price * item.quantity;
        totalAmount += itemTotal;

        itemsWithPrice.push({
          ...item,
          priceAtTime: shopItem.price
        });
      }

      // 3. Ajouter des frais de livraison si nécessaire
      const shippingCost = orderData.deliveryType === 'shipping' ? 5 : 0; // Exemple de frais fixes
      totalAmount += shippingCost;

      // 4. Créer la commande
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          buyer_id: orderData.buyerId,
          seller_id: orderData.sellerId,
          total_amount: totalAmount,
          status: 'pending',
          payment_status: 'pending',
          delivery_type: orderData.deliveryType,
          shipping_address: orderData.shippingAddress || null,
          shipping_required: orderData.deliveryType === 'shipping',
          shipping_cost: shippingCost,
          payment_method: orderData.paymentMethod || 'card',
          commission_amount: totalAmount * 0.05, // Exemple de commission de 5%
        })
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la création de la commande:", error);
        return { order: null, error: error.message };
      }

      // 5. Ajouter les articles à la commande
      const orderItems = itemsWithPrice.map(item => ({
        order_id: order.id,
        shop_item_id: item.shopItemId,
        quantity: item.quantity,
        price_at_time: item.priceAtTime
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error("Erreur lors de l'ajout des articles à la commande:", itemsError);
        // Suppression de la commande en cas d'erreur
        await supabase.from('orders').delete().eq('id', order.id);
        return { order: null, error: itemsError.message };
      }

      // 6. Transformer le résultat pour le retour
      const createdOrder: Order = {
        id: order.id,
        buyerId: order.buyer_id,
        sellerId: order.seller_id,
        status: order.status,
        paymentStatus: order.payment_status,
        totalAmount: order.total_amount,
        commissionAmount: order.commission_amount,
        createdAt: order.created_at,
        deliveryType: order.delivery_type,
        shippingAddress: order.shipping_address,
        shippingRequired: order.shipping_required,
        shippingCost: order.shipping_cost,
        paymentMethod: order.payment_method,
      };

      // 7. Publier l'événement de création de commande
      eventBus.publish(ORDER_EVENTS.ORDER_CREATED, { 
        orderId: order.id, 
        buyerId: order.buyer_id,
        sellerId: order.seller_id
      });

      return { order: createdOrder };
    } catch (error: any) {
      console.error("Exception lors de la création de la commande:", error);
      return { order: null, error: error.message || "Erreur inconnue" };
    }
  }

  /**
   * Récupère une commande par son ID
   */
  async getOrderById(orderId: string): Promise<OrderResult> {
    try {
      if (!orderId) {
        return { order: null, error: "ID de commande requis" };
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération de la commande:", error);
        return { order: null, error: error.message };
      }

      // Transformer les données pour le format de retour
      const order: Order = {
        id: data.id,
        buyerId: data.buyer_id,
        sellerId: data.seller_id,
        status: data.status,
        paymentStatus: data.payment_status,
        totalAmount: data.total_amount,
        commissionAmount: data.commission_amount,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        stripePaymentIntentId: data.stripe_payment_intent_id,
        stripeSessionId: data.stripe_session_id,
        deliveryType: data.delivery_type,
        shippingAddress: data.shipping_address,
        shippingRequired: data.shipping_required,
        shippingCost: data.shipping_cost,
        paymentMethod: data.payment_method,
      };

      // Récupérer les articles de la commande
      const { items } = await this.getOrderItems(orderId);
      order.items = items;

      return { order };
    } catch (error: any) {
      console.error("Exception lors de la récupération de la commande:", error);
      return { order: null, error: error.message || "Erreur inconnue" };
    }
  }

  /**
   * Met à jour une commande
   */
  async updateOrder(orderId: string, data: OrderUpdateRequest): Promise<OrderResult> {
    try {
      if (!orderId) {
        return { order: null, error: "ID de commande requis" };
      }

      // Vérifier que la commande existe avant la mise à jour
      const { order: existingOrder, error: checkError } = await this.getOrderById(orderId);
      if (checkError || !existingOrder) {
        return { order: null, error: checkError || "Commande non trouvée" };
      }

      // Préparer les données pour la mise à jour
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (data.status) {
        updateData.status = data.status;
      }

      if (data.paymentStatus) {
        updateData.payment_status = data.paymentStatus;
      }

      if (data.stripePaymentIntentId) {
        updateData.stripe_payment_intent_id = data.stripePaymentIntentId;
      }

      if (data.stripeSessionId) {
        updateData.stripe_session_id = data.stripeSessionId;
      }

      // Effectuer la mise à jour
      const { data: updatedData, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la mise à jour de la commande:", error);
        return { order: null, error: error.message };
      }

      // Transformer les données pour le format de retour
      const updatedOrder: Order = {
        id: updatedData.id,
        buyerId: updatedData.buyer_id,
        sellerId: updatedData.seller_id,
        status: updatedData.status,
        paymentStatus: updatedData.payment_status,
        totalAmount: updatedData.total_amount,
        commissionAmount: updatedData.commission_amount,
        createdAt: updatedData.created_at,
        updatedAt: updatedData.updated_at,
        stripePaymentIntentId: updatedData.stripe_payment_intent_id,
        stripeSessionId: updatedData.stripe_session_id,
        deliveryType: updatedData.delivery_type,
        shippingAddress: updatedData.shipping_address,
        shippingRequired: updatedData.shipping_required,
        shippingCost: updatedData.shipping_cost,
        paymentMethod: updatedData.payment_method,
      };

      // Publier l'événement de mise à jour de commande
      eventBus.publish(ORDER_EVENTS.ORDER_UPDATED, { 
        orderId, 
        changes: data,
        previousStatus: existingOrder.status,
        newStatus: updatedOrder.status
      });

      // Publier un événement spécifique si le statut a changé
      if (data.status && data.status !== existingOrder.status) {
        eventBus.publish(ORDER_EVENTS.ORDER_STATUS_CHANGED, {
          orderId,
          previousStatus: existingOrder.status,
          newStatus: data.status,
          buyerId: updatedOrder.buyerId,
          sellerId: updatedOrder.sellerId
        });

        // Événements spécifiques pour certains statuts
        switch (data.status) {
          case 'cancelled':
            eventBus.publish(ORDER_EVENTS.ORDER_CANCELLED, { orderId });
            break;
          case 'refunded':
            eventBus.publish(ORDER_EVENTS.ORDER_REFUNDED, { orderId });
            break;
          case 'shipped':
            eventBus.publish(ORDER_EVENTS.ORDER_SHIPPED, { orderId });
            break;
          case 'delivered':
            eventBus.publish(ORDER_EVENTS.ORDER_DELIVERED, { orderId });
            break;
        }
      }

      return { order: updatedOrder };
    } catch (error: any) {
      console.error("Exception lors de la mise à jour de la commande:", error);
      return { order: null, error: error.message || "Erreur inconnue" };
    }
  }

  /**
   * Récupère les commandes d'un acheteur
   */
  async getBuyerOrders(buyerId: string, limit: number = 10, offset: number = 0): Promise<OrdersResult> {
    try {
      if (!buyerId) {
        return { orders: [], count: 0, error: "ID d'acheteur requis" };
      }

      // Récupérer le nombre total de commandes
      const { count, error: countError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('buyer_id', buyerId);

      if (countError) {
        console.error("Erreur lors du comptage des commandes:", countError);
        return { orders: [], count: 0, error: countError.message };
      }

      // Récupérer les commandes avec pagination
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
        return { orders: [], count: 0, error: error.message };
      }

      // Transformer les données pour le format de retour
      const orders: Order[] = data.map(order => ({
        id: order.id,
        buyerId: order.buyer_id,
        sellerId: order.seller_id,
        status: order.status,
        paymentStatus: order.payment_status,
        totalAmount: order.total_amount,
        commissionAmount: order.commission_amount,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        stripePaymentIntentId: order.stripe_payment_intent_id,
        stripeSessionId: order.stripe_session_id,
        deliveryType: order.delivery_type,
        shippingAddress: order.shipping_address,
        shippingRequired: order.shipping_required,
        shippingCost: order.shipping_cost,
        paymentMethod: order.payment_method,
      }));

      return { orders, count: count || 0 };
    } catch (error: any) {
      console.error("Exception lors de la récupération des commandes:", error);
      return { orders: [], count: 0, error: error.message || "Erreur inconnue" };
    }
  }

  /**
   * Récupère les commandes d'un vendeur
   */
  async getSellerOrders(sellerId: string, limit: number = 10, offset: number = 0): Promise<OrdersResult> {
    try {
      if (!sellerId) {
        return { orders: [], count: 0, error: "ID de vendeur requis" };
      }

      // Récupérer le nombre total de commandes
      const { count, error: countError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', sellerId);

      if (countError) {
        console.error("Erreur lors du comptage des commandes:", countError);
        return { orders: [], count: 0, error: countError.message };
      }

      // Récupérer les commandes avec pagination
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
        return { orders: [], count: 0, error: error.message };
      }

      // Transformer les données pour le format de retour
      const orders: Order[] = data.map(order => ({
        id: order.id,
        buyerId: order.buyer_id,
        sellerId: order.seller_id,
        status: order.status,
        paymentStatus: order.payment_status,
        totalAmount: order.total_amount,
        commissionAmount: order.commission_amount,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        stripePaymentIntentId: order.stripe_payment_intent_id,
        stripeSessionId: order.stripe_session_id,
        deliveryType: order.delivery_type,
        shippingAddress: order.shipping_address,
        shippingRequired: order.shipping_required,
        shippingCost: order.shipping_cost,
        paymentMethod: order.payment_method,
      }));

      return { orders, count: count || 0 };
    } catch (error: any) {
      console.error("Exception lors de la récupération des commandes:", error);
      return { orders: [], count: 0, error: error.message || "Erreur inconnue" };
    }
  }

  /**
   * Récupère les éléments d'une commande
   */
  async getOrderItems(orderId: string): Promise<{ items: any[]; error?: string }> {
    try {
      if (!orderId) {
        return { items: [], error: "ID de commande requis" };
      }

      // Récupérer les articles de la commande avec des informations sur l'article
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          id,
          order_id,
          shop_item_id,
          quantity,
          price_at_time,
          shop_items(
            id,
            clothes_id,
            status,
            clothes(name, category, image_url)
          )
        `)
        .eq('order_id', orderId);

      if (error) {
        console.error("Erreur lors de la récupération des articles de la commande:", error);
        return { items: [], error: error.message };
      }

      // Transformer les données pour le format de retour
      const items = data.map(item => ({
        id: item.id,
        orderId: item.order_id,
        shopItemId: item.shop_item_id,
        quantity: item.quantity,
        priceAtTime: item.price_at_time,
        shopItem: item.shop_items ? {
          id: item.shop_items.id,
          clothesId: item.shop_items.clothes_id,
          status: item.shop_items.status,
          clothes: item.shop_items.clothes ? {
            name: item.shop_items.clothes.name,
            category: item.shop_items.clothes.category,
            imageUrl: item.shop_items.clothes.image_url
          } : null
        } : null
      }));

      return { items };
    } catch (error: any) {
      console.error("Exception lors de la récupération des articles de la commande:", error);
      return { items: [], error: error.message || "Erreur inconnue" };
    }
  }

  /**
   * Traite le paiement d'une commande
   */
  async processOrderPayment(orderId: string, paymentMethod: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!orderId) {
        return { success: false, error: "ID de commande requis" };
      }

      // Utiliser la fonction RPC de Supabase pour traiter le paiement
      const { data, error } = await supabase.rpc('process_order_payment', {
        order_id: orderId,
        payment_method_id: paymentMethod
      });

      if (error) {
        console.error("Erreur lors du traitement du paiement:", error);
        return { success: false, error: error.message };
      }

      // Mettre à jour le statut de paiement de la commande
      await this.updateOrder(orderId, { 
        paymentStatus: 'completed',
        status: 'paid'
      });

      // Publier l'événement de paiement complété
      eventBus.publish(ORDER_EVENTS.ORDER_PAYMENT_COMPLETED, { 
        orderId,
        paymentMethod
      });

      return { success: true };
    } catch (error: any) {
      console.error("Exception lors du traitement du paiement:", error);
      return { success: false, error: error.message || "Erreur inconnue" };
    }
  }
}
