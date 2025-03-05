// Update only the methods that were causing type errors

import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { 
  Shop, 
  ShopItem, 
  ShopReview, 
  ShopStatus, 
  Order, 
  OrderStatus, 
  PaymentStatus, 
  ShopSettings,
  ShopItemStatus
} from '../domain/types';

export class ShopService {
  private shopRepository: IShopRepository;

  constructor(shopRepository: IShopRepository) {
    this.shopRepository = shopRepository;
  }

  async getShops(): Promise<Shop[]> {
    return this.shopRepository.getShops();
  }

  async getShopById(id: string): Promise<Shop | null> {
    return this.shopRepository.getShopById(id);
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    return this.shopRepository.getShopByUserId(userId);
  }

  async getShopsByStatus(status: ShopStatus): Promise<Shop[]> {
    return this.shopRepository.getShopsByStatus(status.toString());
  }

  async createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop> {
    return this.shopRepository.createShop(shopData);
  }

  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop> {
    return this.shopRepository.updateShop(id, shopData);
  }

  async getShopItems(shopId: string): Promise<ShopItem[]> {
    return this.shopRepository.getShopItems(shopId);
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    return this.shopRepository.getShopItemById(id);
  }

  async createShopItem(itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem> {
    return this.shopRepository.createShopItem(itemData);
  }

  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem> {
    return this.shopRepository.updateShopItem(id, itemData);
  }

  // Fix return type for updateShopItemStatus
  async updateShopItemStatus(id: string, status: ShopItemStatus): Promise<boolean> {
    const result = await this.shopRepository.updateShopItemStatus(id, status);
    return !!result;
  }

  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return this.shopRepository.getShopReviews(shopId);
  }

  async createShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview> {
    return this.shopRepository.createShopReview(review);
  }

  // Add missing methods for orders
  async getOrdersByShop(shopId: string): Promise<Order[]> {
    return this.shopRepository.getOrdersByShop(shopId);
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return this.shopRepository.getOrdersByCustomer(customerId);
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.shopRepository.getOrderById(id);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    return this.shopRepository.updateOrderStatus(orderId, status);
  }

  // Add missing methods for favorites
  async isShopFavorited(shopId: string): Promise<boolean> {
    return this.shopRepository.isShopFavorited(shopId);
  }

  async addShopToFavorites(shopId: string): Promise<boolean> {
    return this.shopRepository.addShopToFavorites(shopId);
  }

  async removeShopFromFavorites(shopId: string): Promise<boolean> {
    return this.shopRepository.removeShopFromFavorites(shopId);
  }

  async getFavoriteShops(): Promise<Shop[]> {
    return this.shopRepository.getFavoriteShops();
  }

  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    return this.shopRepository.getShopSettings(shopId);
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings> {
    return this.shopRepository.updateShopSettings(shopId, settings);
  }
}
