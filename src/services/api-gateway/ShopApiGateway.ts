
import { BaseApiGateway } from './BaseApiGateway';
import { ShopService } from '@/core/shop/application/ShopService';
import { ShopRepository } from '@/core/shop/infrastructure/ShopRepository';

/**
 * API Gateway for shop-related operations
 */
export class ShopApiGateway extends BaseApiGateway {
  private shopService: ShopService;

  constructor() {
    super();
    // Initialize ShopService with a repository
    const shopRepository = new ShopRepository();
    this.shopService = new ShopService(shopRepository);
  }

  /**
   * Gets a shop by id
   */
  async getShopById(id: string) {
    return this.shopService.getShopById(id);
  }

  /**
   * Gets a shop by user id
   */
  async getShopByUserId(userId: string) {
    return this.shopService.getUserShop(userId);
  }

  /**
   * Creates a new shop
   */
  async createShop(shopData: any) {
    return this.shopService.createShop(shopData);
  }

  /**
   * Updates shop information
   */
  async updateShop(shopData: any) {
    return this.shopService.updateShop(shopData);
  }

  /**
   * Updates shop status
   */
  async updateShopStatus(data: { id: string; status: string }) {
    return this.shopService.updateShopStatus(data.id, data.status);
  }

  /**
   * Gets shop items
   */
  async getShopItems(shopId: string) {
    return this.shopService.getShopItems(shopId);
  }

  /**
   * Gets shop orders
   */
  async getShopOrders(shopId: string) {
    return this.shopService.getShopOrders(shopId);
  }

  /**
   * Updates an order status
   */
  async updateOrderStatus(orderId: string, status: string) {
    return this.shopService.updateOrderStatus(orderId, status);
  }

  /**
   * Gets shop reviews
   */
  async getShopReviews(shopId: string) {
    return this.shopService.getShopReviews(shopId);
  }

  /**
   * Gets shop settings
   */
  async getShopSettings(shopId: string) {
    return this.shopService.getShopSettings(shopId);
  }

  /**
   * Updates shop settings
   */
  async updateShopSettings(shopId: string, settings: any) {
    return this.shopService.updateShopSettings(shopId, settings);
  }
}
