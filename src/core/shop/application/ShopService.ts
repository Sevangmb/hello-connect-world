
import { IShopRepository } from '../domain/interfaces/IShopRepository';
import { Shop, ShopItem, ShopReview, ShopSettings, Order } from '../domain/types';

export class ShopService {
  private shopRepository: IShopRepository;

  constructor(shopRepository: IShopRepository) {
    this.shopRepository = shopRepository;
  }

  async getShopById(id: string): Promise<Shop | null> {
    return this.shopRepository.getShopById(id);
  }

  async getUserShop(userId: string): Promise<Shop | null> {
    return this.shopRepository.getUserShop(userId);
  }

  async createShop(shopData: Partial<Shop>): Promise<Shop> {
    return this.shopRepository.createShop(shopData);
  }

  async updateShop(shopId: string, shopData: Partial<Shop>): Promise<Shop> {
    return this.shopRepository.updateShop(shopId, shopData);
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

  async updateShopItem(itemId: string, itemData: Partial<ShopItem>): Promise<ShopItem> {
    return this.shopRepository.updateShopItem(itemId, itemData);
  }

  async getShopReviews(shopId: string): Promise<ShopReview[]> {
    return this.shopRepository.getShopReviews(shopId);
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

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return this.shopRepository.getOrdersByUserId(userId);
  }

  async getOrdersByShopId(shopId: string): Promise<Order[]> {
    return this.shopRepository.getOrdersByShopId(shopId);
  }
}
