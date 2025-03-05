
/**
 * Service d'application pour les commandes
 */
import { IOrderRepository } from '../domain/interfaces/IOrderRepository';
import { 
  Order, 
  OrderItem, 
  CreateOrderParams, 
  OrderFilter,
  OrderStats,
  OrderStatus
} from '../domain/types';
import { eventBus } from '@/core/event-bus/EventBus';
import { ORDER_EVENTS } from '../domain/events';

export class OrderService {
  // Singleton du service
  private static instance: OrderService;
  
  constructor(private repository: IOrderRepository) {}
  
  /**
   * Crée une nouvelle commande
   */
  async createOrder(params: CreateOrderParams): Promise<Order | null> {
    try {
      // Appeler le repository pour créer la commande
      const order = await this.repository.createOrder(params);
      
      if (order) {
        console.log(`Commande ${order.id} créée avec succès`);
      }
      
      return order;
    } catch (error) {
      console.error('Erreur dans le service de commande lors de la création:', error);
      return null;
    }
  }
  
  /**
   * Récupère une commande par son ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const order = await this.repository.getOrderById(orderId);
      
      if (!order) {
        console.warn(`Commande ${orderId} non trouvée`);
        return null;
      }
      
      return order;
    } catch (error) {
      console.error('Erreur dans le service de commande lors de la récupération:', error);
      return null;
    }
  }
  
  /**
   * Met à jour le statut d'une commande
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    try {
      const success = await this.repository.updateOrder(orderId, { status });
      
      if (success) {
        // Publier des événements spécifiques en fonction du statut
        if (status === 'cancelled') {
          eventBus.publish(ORDER_EVENTS.ORDER_CANCELLED, { orderId });
        } else if (status === 'delivered') {
          eventBus.publish(ORDER_EVENTS.ORDER_DELIVERED, { orderId });
        }
        
        console.log(`Statut de la commande ${orderId} mis à jour: ${status}`);
      }
      
      return success;
    } catch (error) {
      console.error('Erreur dans le service de commande lors de la mise à jour du statut:', error);
      return false;
    }
  }
  
  /**
   * Récupère les commandes d'un acheteur
   */
  async getBuyerOrders(buyerId: string, filter?: OrderFilter): Promise<Order[]> {
    try {
      return await this.repository.getBuyerOrders(buyerId, filter);
    } catch (error) {
      console.error('Erreur dans le service de commande lors de la récupération des commandes acheteur:', error);
      return [];
    }
  }
  
  /**
   * Récupère les commandes d'un vendeur
   */
  async getSellerOrders(sellerId: string, filter?: OrderFilter): Promise<Order[]> {
    try {
      return await this.repository.getSellerOrders(sellerId, filter);
    } catch (error) {
      console.error('Erreur dans le service de commande lors de la récupération des commandes vendeur:', error);
      return [];
    }
  }
  
  /**
   * Traite le paiement d'une commande
   */
  async processPayment(orderId: string, paymentMethodId: string): Promise<boolean> {
    try {
      const success = await this.repository.processPayment(orderId, paymentMethodId);
      
      if (success) {
        console.log(`Paiement de la commande ${orderId} traité avec succès`);
      } else {
        console.error(`Échec du traitement du paiement pour la commande ${orderId}`);
      }
      
      return success;
    } catch (error) {
      console.error('Erreur dans le service de commande lors du traitement du paiement:', error);
      return false;
    }
  }
  
  /**
   * Annule une commande
   */
  async cancelOrder(orderId: string, reason?: string): Promise<boolean> {
    try {
      const updates: any = {
        status: 'cancelled' as OrderStatus
      };
      
      if (reason) {
        updates.cancellationReason = reason;
      }
      
      const success = await this.repository.updateOrder(orderId, updates);
      
      if (success) {
        eventBus.publish(ORDER_EVENTS.ORDER_CANCELLED, { 
          orderId,
          reason,
          timestamp: Date.now()
        });
        
        console.log(`Commande ${orderId} annulée: ${reason || 'Sans raison spécifiée'}`);
      }
      
      return success;
    } catch (error) {
      console.error('Erreur dans le service de commande lors de l\'annulation:', error);
      return false;
    }
  }
  
  /**
   * Calcule des statistiques sur les commandes
   */
  async getOrderStats(sellerId?: string): Promise<OrderStats> {
    try {
      // Cette méthode pourrait être implémentée avec des requêtes SQL directes
      // pour de meilleures performances, mais pour l'exemple, utilisons les données
      // que nous avons déjà
      
      const orders = sellerId 
        ? await this.repository.getSellerOrders(sellerId)
        : await this.repository.getBuyerOrders('all'); // Hypothétique
      
      // Initialiser les stats
      const stats: OrderStats = {
        totalOrders: orders.length,
        totalAmount: 0,
        bySeller: {},
        byStatus: []
      };
      
      // Calculer les totaux
      const byStatus: Record<string, number> = {};
      
      orders.forEach(order => {
        stats.totalAmount += order.totalAmount;
        
        // Compter par vendeur
        if (!stats.bySeller[order.sellerId]) {
          stats.bySeller[order.sellerId] = 0;
        }
        stats.bySeller[order.sellerId]++;
        
        // Compter par statut
        if (!byStatus[order.status]) {
          byStatus[order.status] = 0;
        }
        byStatus[order.status]++;
      });
      
      // Convertir le comptage par statut en tableau
      stats.byStatus = Object.entries(byStatus).map(([status, count]) => ({
        status: status as OrderStatus,
        count
      }));
      
      return stats;
    } catch (error) {
      console.error('Erreur dans le service de commande lors du calcul des statistiques:', error);
      return {
        totalOrders: 0,
        totalAmount: 0,
        bySeller: {},
        byStatus: []
      };
    }
  }
  
  /**
   * Obtenir l'instance singleton du service
   */
  public static getInstance(repository: IOrderRepository): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService(repository);
    }
    return OrderService.instance;
  }
}
