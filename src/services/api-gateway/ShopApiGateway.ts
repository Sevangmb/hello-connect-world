
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { BaseApiGateway } from './BaseApiGateway';
import { 
  Shop, 
  ShopItem, 
  ShopReview, 
  ShopStatus, 
  ShopItemStatus, 
  OrderStatus, 
  Order 
} from '@/core/shop/domain/types';

/**
 * Shop API Gateway for accessing shop-related functionality
 */
export class ShopApiGateway extends BaseApiGateway {
  private shopService = getShopService();

  /**
   * Get shop by ID
   */
  async getShopById(id: string): Promise<Shop | null> {
    return this.shopService.getShopById(id);
  }

  /**
   * Get shop by user ID
   */
  async getShopByUserId(userId: string): Promise<Shop | null> {
    return this.shopService.getShopByUserId(userId);
  }

  /**
   * Get all shops
   */
  async getShops(): Promise<Shop[]> {
    return this.shopService.getShops();
  }

  /**
   * Get shops by status
   */
  async getShopsByStatus(status: ShopStatus): Promise<Shop[]> {
    return this.shopService.getShopsByStatus(status);
  }

  /**
   * Create a shop
   */
  async createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop> {
    return this.shopService.createShop(shopData);
  }

  /**
   * Update a shop
   */
  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop> {
    return this.shopService.updateShop(id, shopData);
  }

  /**
   * Update shop item status
   */
  async updateShopItemStatus(id: string, status: ShopItemStatus): Promise<ShopItem> {
    return this.shopService.updateShopItemStatus(id, status);
  }

  /**
   * Get shop reviews
   */
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return this.shopService.getShopReviews(shopId);
  }

  /**
   * Add shop review
   */
  async addShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview> {
    return this.shopService.createShopReview(review);
  }

  /**
   * Get shop orders
   */
  async getShopOrders(shopId: string): Promise<Order[]> {
    return this.shopService.getOrders(shopId);
  }

  /**
   * Get user orders
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    return this.shopService.getOrdersByCustomer(userId);
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order | null> {
    return this.shopService.getOrderById(id);
  }

  /**
   * Update order status
   */
  async updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
    return this.shopService.updateOrderStatus(id, status);
  }

  /**
   * Get shop settings
   */
  async getShopSettings(shopId: string): Promise<any> {
    return this.shopService.getShopSettings(shopId);
  }

  /**
   * Update shop settings
   */
  async updateShopSettings(shopId: string, settingsData: any): Promise<any> {
    return this.shopService.updateShopSettings(shopId, settingsData);
  }

  /**
   * Get favorite shops
   */
  async getFavoriteShops(userId: string): Promise<Shop[]> {
    return this.shopService.getUserFavoriteShops(userId);
  }

  /**
   * Check if shop is favorited
   */
  async checkIfFavorited(userId: string, shopId: string): Promise<boolean> {
    return this.shopService.isShopFavorited(userId, shopId);
  }

  /**
   * Add favorite shop
   */
  async addFavoriteShop(userId: string, shopId: string): Promise<boolean> {
    return this.shopService.addShopToFavorites(userId, shopId);
  }

  /**
   * Remove favorite shop
   */
  async removeFavoriteShop(userId: string, shopId: string): Promise<boolean> {
    return this.shopService.removeShopFromFavorites(userId, shopId);
  }
}
