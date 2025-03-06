
import { Shop, ShopItem, ShopReview, ShopSettings, Order, OrderStatus } from '../types';

export interface IShopRepository {
  // Shop methods
  createShop(shop: Partial<Shop>): Promise<Shop>;
  updateShop(id: string, shopData: Partial<Shop>): Promise<Shop>;
  getShopById(id: string): Promise<Shop | null>;
  getShopByUserId(userId: string): Promise<Shop | null>;
  getUserShops(userId: string): Promise<Shop[]>;
  getShopsByStatus(status: string): Promise<Shop[]>;
  getAllShops(): Promise<Shop[]>;
  
  // Shop items methods
  getShopItems(userId: string): Promise<ShopItem[]>;
  getAllShopItems(): Promise<ShopItem[]>;
  getShopItemsByShopId(shopId: string): Promise<ShopItem[]>;
  getShopItemById(id: string): Promise<ShopItem | null>;
  createShopItem(item: Partial<ShopItem>): Promise<ShopItem>;
  updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem>;
  updateShopItemStatus(id: string, status: string): Promise<boolean>;
  deleteShopItem(id: string): Promise<boolean>;
  addShopItems(items: Partial<ShopItem>[]): Promise<ShopItem[]>;
  
  // Shop reviews methods
  createShopReview(review: Partial<ShopReview>): Promise<ShopReview>;
  getShopReviewById(id: string): Promise<ShopReview | null>;
  getShopReviewsByShopId(shopId: string): Promise<ShopReview[]>;
  getShopReviewsByUserId(userId: string): Promise<ShopReview[]>;
  
  // Shop settings methods
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings>;
  
  // Order methods
  createOrder(order: Partial<Order>): Promise<Order>;
  getOrderById(id: string): Promise<Order | null>;
  getUserOrders(userId: string): Promise<Order[]>;
  getShopOrders(shopId: string): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean>;
  
  // Favorites methods
  getFavoriteShops(userId: string): Promise<Shop[]>;
  isShopFavorited(userId: string, shopId: string): Promise<boolean>;
  addShopToFavorites(userId: string, shopId: string): Promise<boolean>;
  removeShopFromFavorites(userId: string, shopId: string): Promise<boolean>;
  
  // Cart methods
  addToCart(userId: string, shopItemId: string, quantity: number): Promise<boolean>;
}
