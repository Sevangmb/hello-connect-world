
/**
 * Service des commandes - Couche Application
 * Implémente les cas d'utilisation liés aux commandes
 */
import { IOrderRepository } from '../domain/interfaces/IOrderRepository';
import { Order, OrderCreateRequest, OrderResult, OrdersResult, OrderUpdateRequest } from '../domain/types';

export class OrderService {
  private orderRepository: IOrderRepository;
  private cache: Map<string, { order: Order, timestamp: number }> = new Map();
  private readonly CACHE_TTL = 60000; // 1 minute
  
  constructor(orderRepository: IOrderRepository) {
    this.orderRepository = orderRepository;
  }
  
  /**
   * Crée une nouvelle commande
   */
  async createOrder(orderData: OrderCreateRequest): Promise<OrderResult> {
    if (!orderData.buyerId || !orderData.sellerId || !orderData.items || orderData.items.length === 0) {
      return { order: null, error: "Données de commande incomplètes" };
    }
    
    return await this.orderRepository.createOrder(orderData);
  }
  
  /**
   * Récupère une commande par son ID avec gestion de cache
   */
  async getOrderById(orderId: string): Promise<OrderResult> {
    if (!orderId) {
      return { order: null, error: "ID de commande requis" };
    }
    
    // Vérifier le cache
    const cached = this.cache.get(orderId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return { order: cached.order };
    }
    
    // Récupérer depuis le repository
    const result = await this.orderRepository.getOrderById(orderId);
    
    if (result.order) {
      // Mettre en cache
      this.cache.set(orderId, { order: result.order, timestamp: Date.now() });
    }
    
    return result;
  }
  
  /**
   * Met à jour une commande
   */
  async updateOrder(orderId: string, data: OrderUpdateRequest): Promise<OrderResult> {
    if (!orderId) {
      return { order: null, error: "ID de commande requis" };
    }
    
    const result = await this.orderRepository.updateOrder(orderId, data);
    
    if (result.order) {
      // Invalider le cache
      this.cache.delete(orderId);
    }
    
    return result;
  }
  
  /**
   * Récupère les commandes d'un acheteur
   */
  async getBuyerOrders(buyerId: string, limit?: number, offset?: number): Promise<OrdersResult> {
    if (!buyerId) {
      return { orders: [], count: 0, error: "ID d'acheteur requis" };
    }
    
    return await this.orderRepository.getBuyerOrders(buyerId, limit, offset);
  }
  
  /**
   * Récupère les commandes d'un vendeur
   */
  async getSellerOrders(sellerId: string, limit?: number, offset?: number): Promise<OrdersResult> {
    if (!sellerId) {
      return { orders: [], count: 0, error: "ID de vendeur requis" };
    }
    
    return await this.orderRepository.getSellerOrders(sellerId, limit, offset);
  }
  
  /**
   * Récupère les éléments d'une commande
   */
  async getOrderItems(orderId: string): Promise<{ items: any[]; error?: string }> {
    if (!orderId) {
      return { items: [], error: "ID de commande requis" };
    }
    
    return await this.orderRepository.getOrderItems(orderId);
  }
  
  /**
   * Traite le paiement d'une commande
   */
  async processOrderPayment(orderId: string, paymentMethod: string): Promise<{ success: boolean; error?: string }> {
    if (!orderId) {
      return { success: false, error: "ID de commande requis" };
    }
    
    const result = await this.orderRepository.processOrderPayment(orderId, paymentMethod);
    
    if (result.success) {
      // Invalider le cache
      this.cache.delete(orderId);
    }
    
    return result;
  }
  
  /**
   * Invalide le cache pour une commande
   */
  invalidateCache(orderId: string): void {
    this.cache.delete(orderId);
  }
  
  /**
   * Efface tout le cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}
