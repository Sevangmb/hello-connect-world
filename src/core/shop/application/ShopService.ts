
import { ShopRepository } from '../infrastructure/ShopRepository';
import { Shop, ShopItem, Order, ShopReview, ShopSettings, ShopStatus, OrderStatus } from '../domain/types';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

export class ShopService {
  private shopRepository: IShopRepository;

  constructor(shopRepository: IShopRepository) {
    this.shopRepository = shopRepository;
  }

  async getShopById(id: string): Promise<Shop | null> {
    return this.shopRepository.getShopById(id);
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    return this.shopRepository.getShopByUserId(userId);
  }

  async getShops(limit?: number, offset?: number): Promise<Shop[]> {
    return this.shopRepository.getShops(limit, offset);
  }

  async createShop(shop: Partial<Shop>): Promise<Shop> {
    return this.shopRepository.createShop(shop);
  }

  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop> {
    return this.shopRepository.updateShop(id, shopData);
  }

  async updateShopStatus(shopId: string, status: ShopStatus): Promise<boolean> {
    return this.shopRepository.updateShopStatus(shopId, status);
  }

  async getShopItems(shopId: string): Promise<ShopItem[]> {
    return this.shopRepository.getShopItems(shopId);
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    return this.shopRepository.getShopItemById(id);
  }

  async createShopItem(item: Partial<ShopItem>): Promise<ShopItem> {
    return this.shopRepository.createShopItem(item);
  }

  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem> {
    return this.shopRepository.updateShopItem(id, itemData);
  }

  async updateShopItemStatus(itemId: string, status: string): Promise<boolean> {
    return this.shopRepository.updateShopItemStatus(itemId, status);
  }

  async deleteShopItem(itemId: string): Promise<boolean> {
    return this.shopRepository.deleteShopItem(itemId);
  }

  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return this.shopRepository.getShopReviews(shopId);
  }

  async addShopReview(review: Partial<ShopReview>): Promise<ShopReview> {
    return this.shopRepository.addShopReview(review);
  }

  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    return this.shopRepository.getShopSettings(shopId);
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings> {
    return this.shopRepository.updateShopSettings(shopId, settings);
  }

  async getShopOrders(shopId: string): Promise<Order[]> {
    return this.shopRepository.getShopOrders(shopId);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.shopRepository.getUserOrders(userId);
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return this.shopRepository.getOrderById(orderId);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    return this.shopRepository.updateOrderStatus(orderId, status);
  }
}
