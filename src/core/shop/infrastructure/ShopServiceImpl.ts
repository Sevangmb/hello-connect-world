
import { IShopService } from '../application/interfaces/IShopService';
import { ShopRepository } from './repositories/ShopRepository';
import { ShopItemRepository } from './repositories/ShopItemRepository';
import { ShopReviewRepository } from './repositories/ShopReviewRepository';
import { OrderRepository } from './repositories/OrderRepository';
import { 
  Shop, 
  ShopItem, 
  ShopSettings, 
  ShopReview, 
  Order, 
  OrderStatus, 
  PaymentStatus 
} from '../domain/types';

/**
 * Service d'implémentation pour les opérations liées aux boutiques
 * Utilise les différents repositories pour fournir une interface unifiée
 */
export class ShopServiceImpl implements IShopService {
  private shopRepository: ShopRepository;
  private shopItemRepository: ShopItemRepository;
  private shopReviewRepository: ShopReviewRepository;
  private orderRepository: OrderRepository;
  
  constructor() {
    this.shopRepository = new ShopRepository();
    this.shopItemRepository = new ShopItemRepository();
    this.shopReviewRepository = new ShopReviewRepository();
    this.orderRepository = new OrderRepository();
  }
  
  // ===== Méthodes liées aux boutiques =====
  
  async getShopById(shopId: string): Promise<Shop | null> {
    return this.shopRepository.getShopById(shopId);
  }
  
  async getShopByUserId(userId: string): Promise<Shop | null> {
    return this.shopRepository.getShopByUserId(userId);
  }
  
  async updateShop(shopId: string, shopData: Partial<Shop>): Promise<Shop | null> {
    return this.shopRepository.updateShop(shopId, shopData);
  }
  
  // ===== Méthodes liées aux paramètres =====
  
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    return this.shopRepository.getShopSettings(shopId);
  }
  
  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    return this.shopRepository.updateShopSettings(shopId, settings);
  }
  
  // ===== Méthodes liées aux articles =====
  
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    return this.shopItemRepository.getShopItems(shopId);
  }
  
  async getShopItemById(itemId: string): Promise<ShopItem | null> {
    return this.shopItemRepository.getShopItemById(itemId);
  }
  
  async createShopItem(item: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem | null> {
    return this.shopItemRepository.createShopItem(item);
  }
  
  async updateShopItem(itemId: string, updates: Partial<ShopItem>): Promise<ShopItem | null> {
    return this.shopItemRepository.updateShopItem(itemId, updates);
  }
  
  async deleteShopItem(itemId: string): Promise<boolean> {
    return this.shopItemRepository.deleteShopItem(itemId);
  }
  
  // ===== Méthodes liées aux avis =====
  
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return this.shopReviewRepository.getShopReviews(shopId);
  }
  
  async addShopReview(review: { shop_id: string; user_id: string; rating: number; comment?: string }): Promise<ShopReview | null> {
    return this.shopReviewRepository.addShopReview(review);
  }
  
  async updateShopReview(reviewId: string, updates: Partial<ShopReview>): Promise<ShopReview | null> {
    return this.shopReviewRepository.updateShopReview(reviewId, updates);
  }
  
  async deleteShopReview(reviewId: string): Promise<boolean> {
    return this.shopReviewRepository.deleteShopReview(reviewId);
  }
  
  // ===== Méthodes liées aux commandes =====
  
  async getShopOrders(shopId: string): Promise<Order[]> {
    return this.orderRepository.getShopOrders(shopId);
  }
  
  async getCustomerOrders(customerId: string): Promise<Order[]> {
    return this.orderRepository.getCustomerOrders(customerId);
  }
  
  async getOrderById(orderId: string): Promise<Order | null> {
    return this.orderRepository.getOrderById(orderId);
  }
  
  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | null> {
    return this.orderRepository.createOrder(order);
  }
  
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    return this.orderRepository.updateOrderStatus(orderId, status);
  }
  
  async updatePaymentStatus(orderId: string, status: PaymentStatus): Promise<boolean> {
    return this.orderRepository.updatePaymentStatus(orderId, status);
  }
}
