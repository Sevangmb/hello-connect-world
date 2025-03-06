
import { Order, Shop, ShopItem, ShopReview, ShopSettings } from '../types';

export interface IShopRepository {
  // Shop operations
  createShop(data: Partial<Shop>): Promise<Shop>;
  getShopById(id: string): Promise<Shop | null>;
  updateShop(id: string, data: Partial<Shop>): Promise<Shop>;
  getUserShop(userId: string): Promise<Shop | null>;
  
  // Shop items operations
  createShopItem(data: Partial<ShopItem>): Promise<ShopItem>;
  getShopItems(shopId: string): Promise<ShopItem[]>;
  getShopItemById(id: string): Promise<ShopItem | null>;
  updateShopItem(id: string, data: Partial<ShopItem>): Promise<ShopItem>;
  
  // Orders operations
  getOrdersByUserId(userId: string): Promise<Order[]>;
  getOrdersByShopId(shopId: string): Promise<Order[]>;
  
  // Reviews operations
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  createShopReview(data: Partial<ShopReview>): Promise<ShopReview>;
  
  // Settings operations
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  createShopSettings(settings: Partial<ShopSettings>): Promise<ShopSettings>;
  updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings>;
}
