
import { Order, OrderStatus, PaymentStatus } from '../types';

export interface IOrderRepository {
  /**
   * Récupère les commandes d'une boutique
   */
  getShopOrders(shopId: string): Promise<Order[]>;
  
  /**
   * Récupère les commandes d'un client
   */
  getCustomerOrders(customerId: string): Promise<Order[]>;
  
  /**
   * Récupère une commande par son ID
   */
  getOrderById(orderId: string): Promise<Order | null>;
  
  /**
   * Crée une commande
   */
  createOrder(order: Partial<Order>): Promise<Order | null>;
  
  /**
   * Met à jour le statut d'une commande
   */
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean>;
  
  /**
   * Met à jour le statut de paiement d'une commande
   */
  updatePaymentStatus(orderId: string, status: PaymentStatus): Promise<boolean>;
}
