
import { Shop, ShopItem, ShopReview, CartItem, Order, ShopSettings, ShopStatus, ShopItemStatus, OrderStatus } from '../domain/types';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

export class ShopService {
  private repository: IShopRepository;

  constructor(repository: IShopRepository) {
    this.repository = repository;
  }

  async getShopById(id: string): Promise<Shop | null> {
    return await this.repository.getShopById(id);
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    return await this.repository.getShopByUserId(userId);
  }

  async createShop(shopData: Partial<Shop>): Promise<Shop | null> {
    return await this.repository.createShop(shopData);
  }

  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop | null> {
    return await this.repository.updateShop(id, shopData);
  }

  async getAllShopItems(): Promise<ShopItem[]> {
    return await this.repository.getAllShopItems();
  }
  
  async getShopItemsByShopId(shopId: string): Promise<ShopItem[]> {
    return await this.repository.getShopItemsByShopId(shopId);
  }

  async createShopItem(itemData: Partial<ShopItem>): Promise<ShopItem | null> {
    return await this.repository.createShopItem(itemData);
  }

  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem | null> {
    return await this.repository.updateShopItem(id, itemData);
  }

  async deleteShopItem(id: string): Promise<boolean> {
    return await this.repository.deleteShopItem(id);
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    return await this.repository.getShopItemById(id);
  }

  async getShopReviewsByShopId(shopId: string): Promise<ShopReview[]> {
    return await this.repository.getShopReviewsByShopId(shopId);
  }

  async createShopReview(reviewData: Partial<ShopReview>): Promise<ShopReview | null> {
    return await this.repository.createShopReview(reviewData);
  }

  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    return await this.repository.getShopSettings(shopId);
  }

  async updateShopSettings(shopId: string, settingsData: Partial<ShopSettings>): Promise<ShopSettings | null> {
    return await this.repository.updateShopSettings(shopId, settingsData);
  }

  // Added methods to match IShopRepository for api gateway
  async getShopsByStatus(status: ShopStatus): Promise<Shop[]> {
    return await this.repository.getShopsByStatus(status);
  }

  async getShopItems(): Promise<ShopItem[]> {
    return await this.repository.getAllShopItems();
  }

  async addShopItems(items: Partial<ShopItem>[]): Promise<ShopItem[]> {
    return await this.repository.addShopItems(items);
  }

  async updateShopItemStatus(id: string, status: ShopItemStatus): Promise<ShopItem | null> {
    return await this.repository.updateShopItemStatus(id, status);
  }

  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return await this.repository.getShopReviews(shopId);
  }

  async getShopOrders(shopId: string): Promise<Order[]> {
    return await this.repository.getShopOrders(shopId);
  }

  async createOrder(orderData: Partial<Order>): Promise<Order | null> {
    return await this.repository.createOrder(orderData);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    return await this.repository.updateOrderStatus(orderId, status);
  }

  async getFavoriteShops(userId: string): Promise<Shop[]> {
    return await this.repository.getFavoriteShops(userId);
  }

  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    return await this.repository.isShopFavorited(userId, shopId);
  }

  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    return await this.repository.addShopToFavorites(userId, shopId);
  }

  async removeShopFromFavorites(userId: string, shopId: string): Promise<boolean> {
    return await this.repository.removeShopFromFavorites(userId, shopId);
  }

  async addToCart(userId: string, itemId: string, shopId: string, quantity: number): Promise<CartItem | null> {
    return await this.repository.addToCart(userId, itemId, shopId, quantity);
  }
}
