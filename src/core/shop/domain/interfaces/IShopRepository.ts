
import { OrderStatus, Shop, ShopItem, ShopItemStatus, ShopReview, ShopSettings, ShopStatus } from "../types";

/**
 * Repository interface for Shop operations
 */
export interface IShopRepository {
  // Shop operations
  getShopById(id: string): Promise<Shop | null>;
  getShopByUserId(userId: string): Promise<Shop | null>;
  getShopsByStatus(status: ShopStatus): Promise<Shop[]>;
  createShop(shopData: Omit<Shop, "id" | "created_at" | "updated_at" | "average_rating">): Promise<Shop>;
  updateShop(id: string, shopData: Partial<Shop>): Promise<Shop>;
  deleteShop(id: string): Promise<boolean>;
  
  // Shop items operations
  getShopItems(shopId: string): Promise<ShopItem[]>;
  getShopItemById(id: string): Promise<ShopItem | null>;
  createShopItem(itemData: Omit<ShopItem, "id" | "created_at" | "updated_at">): Promise<ShopItem>;
  updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem>;
  deleteShopItem(id: string): Promise<boolean>;
  updateShopItemStatus(id: string, status: ShopItemStatus): Promise<boolean>;
  
  // Shop reviews operations
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  createShopReview(reviewData: Omit<ShopReview, "id" | "created_at" | "updated_at">): Promise<ShopReview>;
  updateShopReview(id: string, reviewData: Partial<ShopReview>): Promise<ShopReview>;
  deleteShopReview(id: string): Promise<boolean>;
  
  // Shop settings operations
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  updateShopSettings(shopId: string, settingsData: Partial<ShopSettings>): Promise<ShopSettings>;
  
  // Orders operations
  getShopOrders(shopId: string): Promise<any[]>; // Using any for now
  getOrderById(orderId: string): Promise<any | null>; // Using any for now
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean>;
  
  // Favorite shops operations
  getFavoriteShops(userId: string): Promise<Shop[]>;
  addFavoriteShop(userId: string, shopId: string): Promise<boolean>;
  removeFavoriteShop(userId: string, shopId: string): Promise<boolean>;
  checkIfFavorited(userId: string, shopId: string): Promise<boolean>;
}
