
import { Shop, ShopItem, ShopReview, ShopSettings } from '../domain/types';
import { IShopRepository } from '../domain/interfaces/IShopRepository';

export class ShopService {
  private shopRepository: IShopRepository;

  constructor(shopRepository: IShopRepository) {
    this.shopRepository = shopRepository;
  }

  // Shop management
  async getShopById(id: string): Promise<Shop | null> {
    return this.shopRepository.getShopById(id);
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    return this.shopRepository.getShopByUserId(userId);
  }

  async createShop(shopData: Partial<Shop>): Promise<Shop | null> {
    return this.shopRepository.createShop(shopData);
  }

  async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop | null> {
    return this.shopRepository.updateShop(id, shopData);
  }

  // Shop items management
  async getAllShopItems(): Promise<ShopItem[]> {
    return this.shopRepository.getAllShopItems();
  }

  async getShopItemsByShopId(shopId: string): Promise<ShopItem[]> {
    return this.shopRepository.getShopItemsByShopId(shopId);
  }

  async createShopItem(itemData: Partial<ShopItem>): Promise<ShopItem | null> {
    return this.shopRepository.createShopItem(itemData);
  }

  async updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem | null> {
    return this.shopRepository.updateShopItem(id, itemData);
  }

  async deleteShopItem(id: string): Promise<boolean> {
    return this.shopRepository.deleteShopItem(id);
  }

  async getShopItemById(id: string): Promise<ShopItem | null> {
    return this.shopRepository.getShopItemById(id);
  }

  // Shop reviews
  async getShopReviewsByShopId(shopId: string): Promise<ShopReview[]> {
    return this.shopRepository.getShopReviewsByShopId(shopId);
  }

  async createShopReview(reviewData: Partial<ShopReview>): Promise<ShopReview | null> {
    return this.shopRepository.createShopReview(reviewData);
  }

  // Shop settings
  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    return this.shopRepository.getShopSettings(shopId);
  }

  async updateShopSettings(shopId: string, settingsData: Partial<ShopSettings>): Promise<ShopSettings | null> {
    return this.shopRepository.updateShopSettings(shopId, settingsData);
  }
}
