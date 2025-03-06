
import { Shop, ShopItem, Order, ShopReview, ShopSettings, ShopStatus, OrderStatus } from '../types';

export interface IShopRepository {
  // Shop methods
  getShopById(id: string): Promise<Shop | null>;
  getShopByUserId(userId: string): Promise<Shop | null>; // Added
  getUserShops(userId: string): Promise<Shop[]>;
  getShopsByStatus(status: ShopStatus): Promise<Shop[]>;
  getAllShops(): Promise<Shop[]>;
  createShop(shopData: Partial<Shop>): Promise<Shop>;
  updateShop(id: string, shopData: Partial<Shop>): Promise<Shop>;
  deleteShop(id: string): Promise<boolean>;
  
  // Shop items methods
  getShopItemById(id: string): Promise<ShopItem | null>;
  getShopItems(filters?: any): Promise<ShopItem[]>;
  getShopItemsByShopId(shopId: string): Promise<ShopItem[]>; // Added
  getAllShopItems(): Promise<ShopItem[]>;
  createShopItem(itemData: Partial<ShopItem>): Promise<ShopItem>;
  updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem>;
  deleteShopItem(id: string): Promise<boolean>;

  // Shop reviews methods
  getShopReviewById(id: string): Promise<ShopReview | null>;
  getShopReviewsByShopId(shopId: string): Promise<ShopReview[]>; // Added
  getShopReviews(filters?: any): Promise<ShopReview[]>;
  createShopReview(reviewData: Partial<ShopReview>): Promise<ShopReview>;
  updateShopReview(id: string, reviewData: Partial<ShopReview>): Promise<ShopReview>;
  deleteShopReview(id: string): Promise<boolean>;

  // Shop settings methods
  getShopSettings(shopId: string): Promise<ShopSettings | null>; // Added
  updateShopSettings(shopId: string, settingsData: Partial<ShopSettings>): Promise<ShopSettings>; // Added

  // Order methods
  getOrderById(id: string): Promise<Order | null>;
  getOrdersByShopId(shopId: string): Promise<Order[]>;
  getOrdersByCustomerId(customerId: string): Promise<Order[]>;
  createOrder(orderData: Partial<Order>): Promise<Order>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean>;
  deleteOrder(id: string): Promise<boolean>;

  // Favorites methods
  getFavoriteShops(userId: string): Promise<Shop[]>; // Added
  isShopFavorited(shopId: string, userId: string): Promise<boolean>; // Added
  addShopToFavorites(shopId: string, userId: string): Promise<boolean>; // Added
  removeShopFromFavorites(shopId: string, userId: string): Promise<boolean>; // Added
}
