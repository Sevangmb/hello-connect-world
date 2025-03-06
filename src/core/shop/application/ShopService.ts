
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { Shop, ShopItem, ShopReview, ShopSettings, Order, OrderStatus } from '../domain/types';

export class ShopService {
  private shopRepository: IShopRepository;

  constructor(shopRepository: IShopRepository) {
    this.shopRepository = shopRepository;
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    return this.shopRepository.getShopByUserId(userId);
  }

  async getShopById(id: string): Promise<Shop | null> {
    return this.shopRepository.getShopById(id);
  }

  async getAllShops(): Promise<Shop[]> {
    return this.shopRepository.getAllShops();
  }

  async getShopItemsByShopId(shopId: string): Promise<ShopItem[]> {
    return this.shopRepository.getShopItemsByShopId(shopId);
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    return this.shopRepository.getShopItemById(id);
  }

  async createShop(shop: Partial<Shop>): Promise<Shop> {
    return this.shopRepository.createShop(shop);
  }

  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop> {
    return this.shopRepository.updateShop(id, shopData);
  }

  async createShopReview(review: Partial<ShopReview>): Promise<ShopReview> {
    return this.shopRepository.createShopReview(review);
  }

  async getShopReviewsByShopId(shopId: string): Promise<ShopReview[]> {
    return this.shopRepository.getShopReviewsByShopId(shopId);
  }

  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    return this.shopRepository.getShopSettings(shopId);
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings> {
    return this.shopRepository.updateShopSettings(shopId, settings);
  }

  async createShopItem(item: Partial<ShopItem>): Promise<ShopItem> {
    return this.shopRepository.createShopItem(item);
  }

  async addShopItems(items: Partial<ShopItem>[]): Promise<ShopItem[]> {
    return this.shopRepository.addShopItems(items);
  }

  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem> {
    return this.shopRepository.updateShopItem(id, itemData);
  }

  async updateShopItemStatus(id: string, status: string): Promise<boolean> {
    return this.shopRepository.updateShopItemStatus(id, status);
  }

  async deleteShopItem(id: string): Promise<boolean> {
    return this.shopRepository.deleteShopItem(id);
  }

  async getShopOrders(shopId: string): Promise<Order[]> {
    return this.shopRepository.getShopOrders(shopId);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.shopRepository.getUserOrders(userId);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    return this.shopRepository.updateOrderStatus(orderId, status);
  }

  async getFavoriteShops(userId: string): Promise<Shop[]> {
    return this.shopRepository.getFavoriteShops(userId);
  }

  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    return this.shopRepository.isShopFavorited(userId, shopId);
  }

  async addShopToFavorites(userId: string, shopId: string): Promise<boolean> {
    return this.shopRepository.addShopToFavorites(userId, shopId);
  }

  async removeShopFromFavorites(userId: string, shopId: string): Promise<boolean> {
    return this.shopRepository.removeShopFromFavorites(userId, shopId);
  }

  async addToCart(userId: string, shopItemId: string, quantity: number): Promise<boolean> {
    return this.shopRepository.addToCart(userId, shopItemId, quantity);
  }
}
