
import { Shop, ShopItem, ShopReview, Order, ShopStatus } from '../types';

export interface IShopRepository {
  // Shop operations
  getShopById(id: string): Promise<Shop | null>;
  getShopByUserId(userId: string): Promise<Shop | null>;
  getShops(): Promise<Shop[]>;
  getShopsByStatus(status: ShopStatus): Promise<Shop[]>; 
  createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop>;
  updateShop(id: string, shopData: Partial<Shop>): Promise<Shop>;
  
  // Shop items operations
  getShopItems(shopId: string): Promise<ShopItem[]>;
  getShopItemById(id: string): Promise<ShopItem | null>;
  getShopItemsByIds(ids: string[]): Promise<ShopItem[]>;
  createShopItem(itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem>;
  updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem>;
  deleteShopItem(id: string): Promise<boolean>;
  
  // Shop review operations
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  createShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview>;
  updateShopReview(id: string, reviewData: Partial<ShopReview>): Promise<ShopReview>;
  deleteShopReview(id: string): Promise<boolean>;
  
  // Order operations
  getOrders(shopId: string): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  createOrder(orderData: any): Promise<Order>;
  updateOrder(id: string, orderData: any): Promise<Order>;
  
  // Favorites
  addShopToFavorites(userId: string, shopId: string): Promise<boolean>;
  removeShopFromFavorites(userId: string, shopId: string): Promise<boolean>;
  isShopFavorited(userId: string, shopId: string): Promise<boolean>;
  getUserFavoriteShops(userId: string): Promise<Shop[]>;
}
