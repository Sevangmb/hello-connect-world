
import { Shop, ShopItem, ShopReview, CartItem, Order, ShopSettings, ShopStatus, ShopItemStatus, OrderStatus } from '../types';

export interface IShopRepository {
  // Shop operations
  getShopById(id: string): Promise<Shop | null>;
  getShopByUserId(userId: string): Promise<Shop | null>;
  createShop(shopData: Partial<Shop>): Promise<Shop | null>;
  updateShop(id: string, shopData: Partial<Shop>): Promise<Shop | null>;
  getShopsByStatus(status: ShopStatus): Promise<Shop[]>;
  
  // Shop items operations
  getAllShopItems(): Promise<ShopItem[]>;
  getShopItemsByShopId(shopId: string): Promise<ShopItem[]>;
  createShopItem(itemData: Partial<ShopItem>): Promise<ShopItem | null>;
  updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem | null>;
  deleteShopItem(id: string): Promise<boolean>;
  getShopItemById(id: string): Promise<ShopItem | null>;
  updateShopItemStatus(id: string, status: ShopItemStatus): Promise<ShopItem | null>;
  addShopItems(items: Partial<ShopItem>[]): Promise<ShopItem[]>;
  
  // Reviews operations
  getShopReviewsByShopId(shopId: string): Promise<ShopReview[]>;
  createShopReview(reviewData: Partial<ShopReview>): Promise<ShopReview | null>;
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  
  // Shop settings operations
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  updateShopSettings(shopId: string, settingsData: Partial<ShopSettings>): Promise<ShopSettings | null>;
  
  // Orders operations
  getShopOrders(shopId: string): Promise<Order[]>;
  createOrder(orderData: Partial<Order>): Promise<Order | null>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean>;
  
  // Favorites operations
  getFavoriteShops(userId: string): Promise<Shop[]>;
  isShopFavorited(userId: string, shopId: string): Promise<boolean>;
  addShopToFavorites(userId: string, shopId: string): Promise<boolean>;
  removeShopFromFavorites(userId: string, shopId: string): Promise<boolean>;
  
  // Cart operations
  addToCart(userId: string, itemId: string, shopId: string, quantity: number): Promise<CartItem | null>;
}
