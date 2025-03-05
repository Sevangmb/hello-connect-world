
import { ShopService } from '@/core/shop/application/ShopService';
import { Shop, ShopItem, ShopReview, ShopSettings, Order, OrderStatus } from '@/core/shop/domain/types';

class ShopApiGateway {
  private shopService: ShopService;

  constructor() {
    this.shopService = new ShopService();
  }

  async initialize(): Promise<boolean> {
    return await this.shopService.initialize();
  }

  // Shop operations
  async getShopById(id: string): Promise<Shop | null> {
    return await this.shopService.getShopById(id);
  }

  async getUserShop(userId: string): Promise<Shop | null> {
    return await this.shopService.getShopByUserId(userId);
  }

  async createShop(shop: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'average_rating'>): Promise<Shop> {
    return await this.shopService.createShop(shop);
  }

  async updateShop(id: string, shop: Partial<Shop>): Promise<Shop> {
    return await this.shopService.updateShop(id, shop);
  }

  async updateShopStatus(id: string, status: Shop['status']): Promise<boolean> {
    return await this.shopService.updateShopStatus(id, status);
  }

  // Shop items operations
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    return await this.shopService.getShopItems(shopId);
  }

  async createShopItem(item: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem> {
    return await this.shopService.createShopItem(item);
  }

  async updateShopItem(id: string, item: Partial<ShopItem>): Promise<ShopItem> {
    return await this.shopService.updateShopItem(id, item);
  }

  async updateShopItemStatus(id: string, status: ShopItem['status']): Promise<boolean> {
    return await this.shopService.updateShopItemStatus(id, status);
  }

  async deleteShopItem(id: string): Promise<boolean> {
    return await this.shopService.deleteShopItem(id);
  }

  // Shop settings
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    return await this.shopService.getShopSettings(shopId);
  }

  async updateShopSettings(id: string, settings: Partial<ShopSettings>): Promise<boolean> {
    return await this.shopService.updateShopSettings(id, settings);
  }

  // Orders
  async getShopOrders(shopId: string): Promise<Order[]> {
    return await this.shopService.getShopOrders(shopId);
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
    return await this.shopService.updateOrderStatus(id, status);
  }
}

// Export a singleton instance
export const shopApiGateway = new ShopApiGateway();
