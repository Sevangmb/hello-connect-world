
import { ShopService } from '@/core/shop/application/ShopService';
import { ShopRepository } from '@/core/shop/infrastructure/ShopRepository';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { supabase } from '@/integrations/supabase/client';

export class ShopApiGateway {
  private shopService: ShopService;

  constructor() {
    this.shopService = getShopService();
  }

  /**
   * Get shop by ID
   */
  async getShopById(id: string) {
    return this.shopService.getShopById(id);
  }

  /**
   * Get shop by user ID
   */
  async getShopByUserId(userId: string) {
    return this.shopService.getShopByUserId(userId);
  }

  /**
   * Get all shops
   */
  async getShops() {
    return this.shopService.getShops();
  }

  /**
   * Create a new shop
   */
  async createShop(shopData: any) {
    return this.shopService.createShop(shopData);
  }

  /**
   * Update a shop
   */
  async updateShop(id: string, shopData: any) {
    return this.shopService.updateShop(id, shopData);
  }

  /**
   * Get shop items
   */
  async getShopItems(shopId: string) {
    return this.shopService.getShopItems(shopId);
  }

  /**
   * Create shop item
   */
  async createShopItem(itemData: any) {
    return this.shopService.createShopItem(itemData);
  }

  /**
   * Update shop item
   */
  async updateShopItem(id: string, itemData: any) {
    return this.shopService.updateShopItem(id, itemData);
  }

  /**
   * Update shop item status - use updateShopItem instead
   */
  async updateShopItemStatus(id: string, status: string) {
    return this.shopService.updateShopItem(id, { status });
  }

  /**
   * Get shop reviews
   */
  async getShopReviews(shopId: string) {
    return this.shopService.getShopReviews(shopId);
  }

  /**
   * Add a shop review (using createShopReview method)
   */
  async addShopReview(reviewData: any) {
    return this.shopService.createShopReview(reviewData);
  }

  /**
   * Get shop orders - use getOrders method
   */
  async getShopOrders(shopId: string) {
    return this.shopService.getOrders(shopId);
  }

  /**
   * Get user orders - use getOrders with user parameter
   */
  async getUserOrders(userId: string) {
    // Get the shop owned by this user first
    const shop = await this.shopService.getShopByUserId(userId);
    if (shop) {
      return this.shopService.getOrders(shop.id);
    }
    return [];
  }

  /**
   * Create an order
   */
  async createOrder(orderData: any) {
    return this.shopService.createOrder(orderData);
  }

  /**
   * Update order status - use updateOrder instead
   */
  async updateOrderStatus(orderId: string, status: string) {
    return this.shopService.updateOrder(orderId, { status });
  }

  /**
   * Get shop settings - use getShopById instead
   */
  async getShopSettings(shopId: string) {
    // Assuming settings might be part of the shop entity
    const shop = await this.shopService.getShopById(shopId);
    return shop?.settings || null;
  }

  /**
   * Update shop settings - use updateShop instead
   */
  async updateShopSettings(shopId: string, settings: any) {
    return this.shopService.updateShop(shopId, { settings });
  }

  /**
   * Get user favorite shops - use getUserFavoriteShops method
   */
  async getFavoriteShops(userId: string) {
    return this.shopService.getUserFavoriteShops(userId);
  }

  /**
   * Check if shop is favorited - use isShopFavorited method
   */
  async checkIfFavorited(userId: string, shopId: string) {
    return this.shopService.isShopFavorited(userId, shopId);
  }

  /**
   * Add shop to favorites - use addShopToFavorites method
   */
  async addFavoriteShop(userId: string, shopId: string) {
    return this.shopService.addShopToFavorites(userId, shopId);
  }

  /**
   * Remove shop from favorites - use removeShopFromFavorites method
   */
  async removeFavoriteShop(userId: string, shopId: string) {
    return this.shopService.removeShopFromFavorites(userId, shopId);
  }
}
