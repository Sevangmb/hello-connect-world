
import { BaseApiGateway } from './BaseApiGateway';
import { ShopService } from '@/core/shop/application/ShopService';
import { Shop, ShopStatus, ShopItem, ShopItemStatus, ShopReview, Order, OrderStatus, CartItem } from '@/core/shop/domain/types';

export class ShopApiGateway extends BaseApiGateway {
  private shopService: ShopService;

  constructor(shopService: ShopService) {
    super();
    this.shopService = shopService;
  }

  /**
   * Get shops by status
   */
  async getShopsByStatus(status: ShopStatus): Promise<Shop[]> {
    return await this.shopService.getShopsByStatus(status);
  }

  /**
   * Get shop by ID
   */
  async getShopById(id: string): Promise<Shop | null> {
    return await this.shopService.getShopById(id);
  }

  /**
   * Get shop by user ID
   */
  async getShopByUserId(userId: string): Promise<Shop | null> {
    return await this.shopService.getShopByUserId(userId);
  }

  /**
   * Create shop
   */
  async createShop(shopData: Partial<Shop>): Promise<Shop | null> {
    return await this.shopService.createShop(shopData);
  }

  /**
   * Update shop
   */
  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop | null> {
    return await this.shopService.updateShop(id, shopData);
  }

  /**
   * Get all shop items
   */
  async getShopItems(): Promise<ShopItem[]> {
    return await this.shopService.getShopItems();
  }

  /**
   * Get shop items by shop ID
   */
  async getShopItemsByShopId(shopId: string): Promise<ShopItem[]> {
    return await this.shopService.getShopItemsByShopId(shopId);
  }

  /**
   * Add multiple shop items
   */
  async addShopItems(items: Partial<ShopItem>[]): Promise<ShopItem[]> {
    return await this.shopService.addShopItems(items);
  }

  /**
   * Create shop item
   */
  async createShopItem(itemData: Partial<ShopItem>): Promise<ShopItem | null> {
    return await this.shopService.createShopItem(itemData);
  }

  /**
   * Update shop item
   */
  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem | null> {
    return await this.shopService.updateShopItem(id, itemData);
  }

  /**
   * Update shop item status
   */
  async updateShopItemStatus(id: string, status: ShopItemStatus): Promise<ShopItem | null> {
    return await this.shopService.updateShopItemStatus(id, status);
  }

  /**
   * Get shop reviews
   */
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return await this.shopService.getShopReviews(shopId);
  }

  /**
   * Get shop orders
   */
  async getShopOrders(shopId: string): Promise<Order[]> {
    return await this.shopService.getShopOrders(shopId);
  }

  /**
   * Create shop review
   */
  async createShopReview(reviewData: Partial<ShopReview>): Promise<ShopReview | null> {
    return await this.shopService.createShopReview(reviewData);
  }

  /**
   * Create order
   */
  async createOrder(orderData: Partial<Order>): Promise<Order | null> {
    return await this.shopService.createOrder(orderData);
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    return await this.shopService.updateOrderStatus(orderId, status);
  }

  /**
   * Get user's favorite shops
   */
  async getFavoriteShops(userId: string): Promise<Shop[]> {
    return await this.shopService.getFavoriteShops(userId);
  }

  /**
   * Check if shop is in user's favorites
   */
  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    return await this.shopService.isShopFavorited(userId, shopId);
  }

  /**
   * Add shop to user's favorites
   */
  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    return await this.shopService.addShopToFavorites(userId, shopId);
  }

  /**
   * Remove shop from user's favorites
   */
  async removeShopFromFavorites(userId: string, shopId: string): Promise<boolean> {
    return await this.shopService.removeShopFromFavorites(userId, shopId);
  }

  /**
   * Add item to cart
   */
  async addToCart(userId: string, itemId: string, shopId: string, quantity: number): Promise<CartItem | null> {
    return await this.shopService.addToCart(userId, itemId, shopId, quantity);
  }
}
