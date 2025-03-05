
import { ShopService } from '@/core/shop/application/ShopService';
import { getShopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { Order, OrderStatus, Shop, ShopItem, ShopItemStatus, ShopReview, ShopSettings } from '@/core/shop/domain/types';

export class ShopApiGateway {
  private shopService: ShopService;
  
  constructor() {
    this.shopService = getShopService();
  }

  // Shop methods
  async getShopById(id: string): Promise<Shop | null> {
    return await this.shopService.getShopById(id);
  }
  
  async getShopByUserId(userId: string): Promise<Shop | null> {
    return await this.shopService.getShopByUserId(userId);
  }
  
  async getShops(): Promise<Shop[]> {
    return await this.shopService.getShops();
  }
  
  async createShop(shopData: any): Promise<Shop> {
    return await this.shopService.createShop(shopData);
  }
  
  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop> {
    return await this.shopService.updateShop(id, shopData);
  }
  
  async updateShopStatus(shopId: string, status: string): Promise<Shop> {
    return await this.shopService.updateShop(shopId, { status: status as any });
  }

  // Shop items methods
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    return await this.shopService.getShopItems(shopId);
  }
  
  async getShopItemById(id: string): Promise<ShopItem | null> {
    return await this.shopService.getShopItemById(id);
  }
  
  async createShopItem(item: any): Promise<ShopItem> {
    return await this.shopService.createShopItem(item);
  }
  
  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem> {
    return await this.shopService.updateShopItem(id, itemData);
  }
  
  async updateShopItemStatus(itemId: string, status: string): Promise<boolean> {
    return await this.shopService.updateShopItemStatus(itemId, status as ShopItemStatus);
  }
  
  async deleteShopItem(id: string): Promise<boolean> {
    return await this.shopService.deleteShopItem(id);
  }

  // Shop reviews methods
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return await this.shopService.getShopReviews(shopId);
  }
  
  async addShopReview(review: any): Promise<ShopReview> {
    return await this.shopService.addShopReview(review);
  }

  // Orders methods
  async getShopOrders(shopId: string): Promise<Order[]> {
    return await this.shopService.getShopOrders(shopId);
  }
  
  async getUserOrders(userId: string): Promise<Order[]> {
    return await this.shopService.getUserOrders(userId);
  }
  
  async getOrderById(id: string): Promise<Order | null> {
    return await this.shopService.getOrderById(id);
  }
  
  async createOrder(orderData: any): Promise<Order> {
    return await this.shopService.createOrder(orderData);
  }
  
  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    return await this.shopService.updateOrderStatus(orderId, status as OrderStatus);
  }

  // Shop settings methods
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    return await this.shopService.getShopSettings(shopId);
  }
  
  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings> {
    return await this.shopService.updateShopSettings(shopId, settings);
  }

  // Favorites methods
  async getFavoriteShops(userId: string): Promise<Shop[]> {
    return await this.shopService.getFavoriteShops(userId);
  }
  
  async checkIfFavorited(userId: string, shopId: string): Promise<boolean> {
    return await this.shopService.checkIfFavorited(userId, shopId);
  }
  
  async addFavoriteShop(userId: string, shopId: string): Promise<boolean> {
    return await this.shopService.addFavoriteShop(userId, shopId);
  }
  
  async removeFavoriteShop(userId: string, shopId: string): Promise<boolean> {
    return await this.shopService.removeFavoriteShop(userId, shopId);
  }
}

// Singleton instance
export const shopApiGateway = new ShopApiGateway();
