
import { CartItem, DbCartItem, Order, Shop, ShopItem, ShopReview, ShopSettings } from '../domain/types';
import { IShopService } from '../application/interfaces/IShopService';
import { ShopRepository } from './repositories/ShopRepository';
import { ShopItemRepository } from './repositories/ShopItemRepository';
import { ShopReviewRepository } from './repositories/ShopReviewRepository';
import { OrderRepository } from './repositories/OrderRepository';

/**
 * Implementation of the shop service
 */
export class ShopServiceImpl implements IShopService {
  private shopRepository: ShopRepository;
  private shopItemRepository: ShopItemRepository;
  private shopReviewRepository: ShopReviewRepository;
  private orderRepository: OrderRepository;

  constructor(
    shopRepository: ShopRepository,
    shopItemRepository: ShopItemRepository,
    shopReviewRepository: ShopReviewRepository,
    orderRepository: OrderRepository
  ) {
    this.shopRepository = shopRepository;
    this.shopItemRepository = shopItemRepository;
    this.shopReviewRepository = shopReviewRepository;
    this.orderRepository = orderRepository;
  }

  async getShopById(id: string): Promise<Shop | null> {
    return this.shopRepository.getShopById(id);
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    return this.shopRepository.getUserShops(userId).then(shops => shops[0] || null);
  }

  async updateShop(id: string, updates: Partial<Shop>): Promise<Shop | null> {
    return this.shopRepository.updateShop(id, updates);
  }

  async createShop(shop: Partial<Shop>): Promise<Shop | null> {
    return this.shopRepository.createShop(shop);
  }

  async getShopItems(shopId: string): Promise<ShopItem[]> {
    return this.shopItemRepository.getShopItems(shopId);
  }

  async getShopItemById(itemId: string): Promise<ShopItem | null> {
    return this.shopItemRepository.getShopItemById(itemId);
  }

  async createShopItem(item: Omit<ShopItem, "id" | "created_at" | "updated_at">): Promise<ShopItem | null> {
    return this.shopItemRepository.createShopItem(item);
  }

  async updateShopItem(itemId: string, updates: Partial<ShopItem>): Promise<ShopItem | null> {
    return this.shopItemRepository.updateShopItem(itemId, updates);
  }

  async deleteShopItem(itemId: string): Promise<boolean> {
    return this.shopItemRepository.deleteShopItem(itemId);
  }

  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    return this.shopRepository.getShopSettings(shopId);
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null> {
    return this.shopRepository.updateShopSettings(shopId, settings);
  }

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

  async getShopOrders(shopId: string): Promise<Order[]> {
    return this.orderRepository.getShopOrders(shopId);
  }

  async getCustomerOrders(customerId: string): Promise<Order[]> {
    return this.orderRepository.getCustomerOrders(customerId);
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return this.orderRepository.getOrderById(orderId);
  }

  async createOrder(order: Omit<Order, "id" | "created_at" | "updated_at">): Promise<Order | null> {
    return this.orderRepository.createOrder(order);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    return this.orderRepository.updateOrderStatus(orderId, status);
  }

  async updatePaymentStatus(orderId: string, status: string): Promise<boolean> {
    return this.orderRepository.updatePaymentStatus(orderId, status);
  }
}
