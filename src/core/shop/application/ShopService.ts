
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

  async createShop(shopData: Partial<Shop>): Promise<Shop> {
    return this.shopRepository.createShop(shopData);
  }

  async updateShop(shopId: string, shopData: Partial<Shop>): Promise<Shop> {
    return this.shopRepository.updateShop(shopId, shopData);
  }

  async getShopItems(shopId: string): Promise<ShopItem[]> {
    return this.shopRepository.getShopItemsByShopId(shopId);
  }

  async getAllShopItems(): Promise<ShopItem[]> {
    return this.shopRepository.getAllShopItems();
  }

  async createShopItem(item: Partial<ShopItem>): Promise<ShopItem> {
    return this.shopRepository.createShopItem(item);
  }

  async updateShopItem(itemId: string, itemData: Partial<ShopItem>): Promise<ShopItem> {
    return this.shopRepository.updateShopItem(itemId, itemData);
  }

  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return this.shopRepository.getShopReviewsByShopId(shopId);
  }

  async createShopReview(review: Partial<ShopReview>): Promise<ShopReview> {
    return this.shopRepository.createShopReview(review);
  }

  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    return this.shopRepository.getShopSettings(shopId);
  }

  async updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings> {
    return this.shopRepository.updateShopSettings(shopId, settings);
  }

  async getAllShops(): Promise<Shop[]> {
    return this.shopRepository.getAllShops();
  }

  async getShopById(shopId: string): Promise<Shop | null> {
    return this.shopRepository.getShopById(shopId);
  }

  async addShopItems(items: Partial<ShopItem>[]): Promise<ShopItem[]> {
    return this.shopRepository.addShopItems(items);
  }

  async updateShopItemStatus(itemId: string, status: string): Promise<boolean> {
    return this.shopRepository.updateShopItemStatus(itemId, status);
  }

  async getShopOrders(shopId: string): Promise<Order[]> {
    return this.shopRepository.getShopOrders(shopId);
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    return this.shopRepository.createOrder(orderData);
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
