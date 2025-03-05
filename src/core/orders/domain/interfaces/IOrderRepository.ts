
/**
 * Interface du repository pour le service de commandes
 */
import { Order, OrderItem, CreateOrderParams, OrderFilter, OrderStatus, PaymentStatus, ShippingStatus } from '../types';

export interface IOrderRepository {
  /**
   * Crée une nouvelle commande
   */
  createOrder(params: CreateOrderParams): Promise<Order>;
  
  /**
   * Obtient une commande par son ID
   */
  getOrderById(orderId: string): Promise<Order | null>;
  
  /**
   * Met à jour une commande
   */
  updateOrder(orderId: string, updates: Partial<Order>): Promise<boolean>;
  
  /**
   * Met à jour le statut d'une commande
   */
  updateOrderStatus(
    orderId: string, 
    status: OrderStatus, 
    paymentStatus?: PaymentStatus, 
    shippingStatus?: ShippingStatus
  ): Promise<{ success: boolean; error?: string; }>;
  
  /**
   * Récupère les commandes d'un acheteur
   */
  getBuyerOrders(buyerId: string, filter?: OrderFilter): Promise<Order[]>;
  
  /**
   * Récupère les commandes d'un vendeur
   */
  getSellerOrders(sellerId: string, filter?: OrderFilter): Promise<Order[]>;
  
  /**
   * Récupère les articles d'une commande
   */
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  
  /**
   * Traite le paiement d'une commande
   */
  processPayment(orderId: string, paymentMethodId: string): Promise<boolean>;
}
