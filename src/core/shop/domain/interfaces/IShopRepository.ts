
import { Shop, ShopItem, ShopReview, ShopSettings, CartItem, Order, OrderStatus, ShopItemStatus } from '../types';

export interface IShopRepository {
  // Shop Management
  getShopById(id: string): Promise<Shop | null>;
  getShopByUserId(userId: string): Promise<Shop | null>;
  createShop(shopData: Partial<Shop>): Promise<Shop | null>;
  updateShop(id: string, shopData: Partial<Shop>): Promise<Shop | null>;
  getShopsByStatus(status: ShopItemStatus): Promise<Shop[]>;
  
  // Shop Items
  getAllShopItems(): Promise<ShopItem[]>;
  getShopItems(): Promise<ShopItem[]>;
  getShopItemsByShopId(shopId: string): Promise<ShopItem[]>;
  getShopItemById(id: string): Promise<ShopItem | null>;
  createShopItem(itemData: Partial<ShopItem>): Promise<ShopItem | null>;
  updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem | null>;
  deleteShopItem(id: string): Promise<boolean>;
  addShopItems(items: Partial<ShopItem>[]): Promise<ShopItem[]>;
  updateShopItemStatus(id: string, status: ShopItemStatus): Promise<ShopItem | null>;
  
  // Shop Reviews
  getShopReviewsByShopId(shopId: string): Promise<ShopReview[]>;
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  createShopReview(reviewData: Partial<ShopReview>): Promise<ShopReview | null>;
  
  // Shop Settings
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  updateShopSettings(shopId: string, settingsData: Partial<ShopSettings>): Promise<ShopSettings | null>;
  
  // Orders
  getShopOrders(shopId: string): Promise<Order[]>;
  createOrder(orderData: Partial<Order>): Promise<Order | null>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean>;
  
  // Favorites
  getFavoriteShops(userId: string): Promise<Shop[]>;
  isShopFavorited(userId: string, shopId: string): Promise<boolean>;
  addShopToFavorites(userId: string, shopId: string): Promise<boolean>;
  removeShopFromFavorites(userId: string, shopId: string): Promise<boolean>;
  
  // Cart
  addToCart(userId: string, itemId: string, shopId: string, quantity: number): Promise<CartItem | null>;
}
