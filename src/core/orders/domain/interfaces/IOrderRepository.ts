
/**
 * Interface pour le repository des commandes
 * Définit les contrats pour les opérations liées aux commandes
 */
import { Order, OrderCreateRequest, OrderResult, OrdersResult, OrderUpdateRequest } from '../types';

export interface IOrderRepository {
  /**
   * Crée une nouvelle commande
   */
  createOrder(orderData: OrderCreateRequest): Promise<OrderResult>;
  
  /**
   * Récupère une commande par son ID
   */
  getOrderById(orderId: string): Promise<OrderResult>;
  
  /**
   * Met à jour une commande
   */
  updateOrder(orderId: string, data: OrderUpdateRequest): Promise<OrderResult>;
  
  /**
   * Récupère les commandes d'un acheteur
   */
  getBuyerOrders(buyerId: string, limit?: number, offset?: number): Promise<OrdersResult>;
  
  /**
   * Récupère les commandes d'un vendeur
   */
  getSellerOrders(sellerId: string, limit?: number, offset?: number): Promise<OrdersResult>;
  
  /**
   * Récupère les éléments d'une commande
   */
  getOrderItems(orderId: string): Promise<{ items: any[]; error?: string }>;
  
  /**
   * Traite le paiement d'une commande
   */
  processOrderPayment(orderId: string, paymentMethod: string): Promise<{ success: boolean; error?: string }>;
}
