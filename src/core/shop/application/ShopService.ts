
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { Order, OrderStatus, Shop, ShopItem, ShopItemStatus, ShopReview, ShopSettings } from '../domain/types';

export class ShopService {
  private repository: IShopRepository;

  constructor(repository: IShopRepository) {
    this.repository = repository;
  }

  // Shop methods
  async getShopById(id: string): Promise<Shop | null> {
    return await this.repository.getShopById(id);
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    return await this.repository.getShopByUserId(userId);
  }

  async getShops(): Promise<Shop[]> {
    return await this.repository.getShops();
  }

  async createShop(shopData: Omit<Shop, "id" | "created_at" | "updated_at" | "average_rating">): Promise<Shop> {
    return await this.repository.createShop(shopData);
  }

  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop> {
    return await this.repository.updateShop(id, shopData);
  }

  // Shop items methods
  async getShopItems(shopId: string): Promise<ShopItem[]> {
    return await this.repository.getShopItems(shopId);
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    return await this.repository.getShopItemById(id);
  }

  async createShopItem(item: Omit<ShopItem, "id" | "created_at" | "updated_at">): Promise<ShopItem> {
    return await this.repository.createShopItem(item);
  }

  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem> {
    return await this.repository.updateShopItem(id, itemData);
  }

  async updateShopItemStatus(itemId: string, status: ShopItemStatus): Promise<boolean> {
    return await this.repository.updateShopItemStatus(itemId, status);
  }

  async deleteShopItem(id: string): Promise<boolean> {
    return await this.repository.deleteShopItem(id);
  }

  // Shop reviews methods
  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return await this.repository.getShopReviews(shopId);
  }

  async addShopReview(review: Omit<ShopReview, "id" | "created_at" | "updated_at">): Promise<ShopReview> {
    return await this.repository.addShopReview(review);
  }

  // Orders methods
  async getShopOrders(shopId: string): Promise<Order[]> {
    return await this.repository.getShopOrders(shopId);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await this.repository.getUserOrders(userId);
  }

  async getOrderById(id: string): Promise<Order | null> {
    return await this.repository.getOrderById(id);
  }

  async createOrder(orderData: Omit<Order, "id" | "created_at">): Promise<Order> {
    return await this.repository.createOrder(orderData);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    return await this.repository.updateOrderStatus(orderId, status);
  }

  // Shop settings methods
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    return await this.repository.getShopSettings(shopId);
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings> {
    return await this.repository.updateShopSettings(shopId, settings);
  }

  // Favorites methods
  async getFavoriteShops(userId: string): Promise<Shop[]> {
    return await this.repository.getFavoriteShops(userId);
  }

  async checkIfFavorited(userId: string, shopId: string): Promise<boolean> {
    return await this.repository.checkIfFavorited(userId, shopId);
  }

  async addFavoriteShop(userId: string, shopId: string): Promise<boolean> {
    return await this.repository.addFavoriteShop(userId, shopId);
  }

  async removeFavoriteShop(userId: string, shopId: string): Promise<boolean> {
    return await this.repository.removeFavoriteShop(userId, shopId);
  }
}
