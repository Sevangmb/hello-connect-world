
import { Shop, ShopItem, ShopReview, ShopSettings, Order, OrderStatus, ShopItemStatus, PaymentMethod, ShopStatus } from '@/core/shop/domain/types';

export interface IShopRepository {
  // Shop operations
  getShopById(id: string): Promise<Shop | null>;
  getShopByUserId(userId: string): Promise<Shop | null>;
  getShops(): Promise<Shop[]>;
  createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'average_rating'>): Promise<Shop | null>;
  updateShop(shopData: Partial<Shop> & { id: string }): Promise<Shop>;
  deleteShop(id: string): Promise<boolean>;
  updateShopStatus(id: string, status: ShopStatus): Promise<boolean>;
  
  // Shop items operations
  getShopItems(shopId: string): Promise<ShopItem[]>;
  getShopItemById(id: string): Promise<ShopItem | null>;
  createShopItem(itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem | null>;
  updateShopItem(item: Partial<ShopItem> & { id: string }): Promise<ShopItem>;
  deleteShopItem(id: string): Promise<boolean>;
  updateShopItemStatus(id: string, status: ShopItemStatus): Promise<boolean>;
  
  // Shop review operations
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  addShopReview(reviewData: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview | null>;
  
  // Shop settings operations
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings>;
  
  // Order operations
  getShopOrders(shopId: string): Promise<Order[]>;
  getUserOrders(userId: string): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | null>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<boolean>;
  
  // Favorite operations
  addFavoriteShop(userId: string, shopId: string): Promise<boolean>;
  removeFavoriteShop(userId: string, shopId: string): Promise<boolean>;
  getUserFavoriteShops(userId: string): Promise<Shop[]>;
  checkIfShopFavorited(userId: string, shopId: string): Promise<boolean>;
}
