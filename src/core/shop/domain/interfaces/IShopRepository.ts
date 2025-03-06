
import { Shop, ShopItem, ShopReview, ShopSettings } from '../types';

export interface IShopRepository {
  // Shop management
  getShopById(id: string): Promise<Shop | null>;
  getShopByUserId(userId: string): Promise<Shop | null>;
  createShop(shopData: Partial<Shop>): Promise<Shop | null>;
  updateShop(id: string, shopData: Partial<Shop>): Promise<Shop | null>;
  
  // Shop items management
  getAllShopItems(): Promise<ShopItem[]>;
  getShopItemsByShopId(shopId: string): Promise<ShopItem[]>;
  createShopItem(itemData: Partial<ShopItem>): Promise<ShopItem | null>;
  updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem | null>;
  deleteShopItem(id: string): Promise<boolean>;
  getShopItemById(id: string): Promise<ShopItem | null>;
  
  // Shop reviews
  getShopReviewsByShopId(shopId: string): Promise<ShopReview[]>;
  createShopReview(reviewData: Partial<ShopReview>): Promise<ShopReview | null>;
  
  // Shop settings
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  updateShopSettings(shopId: string, settingsData: Partial<ShopSettings>): Promise<ShopSettings | null>;
}
