
import { ShopService } from '@/core/shop/application/ShopService';
import { ShopRepository } from '@/core/shop/infrastructure/ShopRepository';
import { BaseApiGateway } from './BaseApiGateway';
import { Shop, ShopItem, ShopReview, ShopSettings, Order } from '@/core/shop/domain/types';

export class ShopApiGateway extends BaseApiGateway {
  private shopService: ShopService;

  constructor() {
    super();
    const shopRepository = new ShopRepository();
    this.shopService = new ShopService(shopRepository);
  }

  // Shop operations
  async createShop(shopData: any): Promise<Shop> {
    return this.shopService.createShop(shopData);
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    return this.shopService.getShopByUserId(userId);
  }

  async updateShop(shopData: Partial<Shop> & { id: string }): Promise<Shop> {
    return this.shopService.updateShop(shopData);
  }

  async getAllShops(): Promise<Shop[]> {
    return this.shopService.getAllShops();
  }

  // Shop items operations
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    return this.shopService.getShopItems(shopId);
  }

  async createShopItem(itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem> {
    return this.shopService.createShopItem(itemData);
  }

  async updateShopItem(itemData: Partial<ShopItem> & { id: string }): Promise<ShopItem> {
    return this.shopService.updateShopItem(itemData);
  }

  async deleteShopItem(itemId: string): Promise<void> {
    return this.shopService.deleteShopItem(itemId);
  }

  // Shop settings operations
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    return this.shopService.getShopSettings(shopId);
  }

  async updateShopSettings(settings: Partial<ShopSettings> & { shop_id: string }): Promise<ShopSettings> {
    return this.shopService.updateShopSettings(settings);
  }

  // Shop orders
  async getShopOrders(shopId: string): Promise<Order[]> {
    return this.shopService.getShopOrders(shopId);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    return this.shopService.updateOrderStatus(orderId, status);
  }

  // Shop reviews
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return this.shopService.getShopReviews(shopId);
  }
}
