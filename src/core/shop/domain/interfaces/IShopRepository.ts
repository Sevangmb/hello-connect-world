
import { Shop, ShopItem, ShopReview, ShopSettings, Order } from '../types';

export interface IShopRepository {
  // Shop CRUD operations
  getShopById(id: string): Promise<Shop | null>;
  getShopsByUserId(userId: string): Promise<Shop[]>;
  getShopByUserId(userId: string): Promise<Shop | null>;
  getUserShops(userId: string): Promise<Shop[]>;
  getAllShops(): Promise<Shop[]>;
  createShop(shop: Partial<Shop>): Promise<Shop>;
  updateShop(shopId: string, updates: Partial<Shop>): Promise<Shop | null>;
  deleteShop(shopId: string): Promise<boolean>;
  getShopsByStatus(status: string): Promise<Shop[]>;
  updateShopStatus(shopId: string, status: string): Promise<boolean>;
  
  // Shop item operations
  getShopItems(shopId: string): Promise<ShopItem[]>;
  getShopItemsByShopId(shopId: string): Promise<ShopItem[]>;
  getAllShopItems(): Promise<ShopItem[]>;
  getShopItemById(itemId: string): Promise<ShopItem | null>;
  createShopItem(shopItem: Partial<ShopItem>): Promise<ShopItem>;
  updateShopItem(itemId: string, updates: Partial<ShopItem>): Promise<ShopItem | null>;
  deleteShopItem(itemId: string): Promise<boolean>;
  updateShopItemStatus(itemId: string, status: string): Promise<boolean>;
  addShopItems(items: Partial<ShopItem>[]): Promise<ShopItem[]>;
  getShopItemsByCategory(shopId: string, category: string): Promise<ShopItem[]>;
  searchShopItems(query: string): Promise<ShopItem[]>;
  getShopItemsByStatus(shopId: string, status: string): Promise<ShopItem[]>;
  
  // Shop review operations
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  getShopReviewsByShopId(shopId: string): Promise<ShopReview[]>;
  addShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview | null>;
  createShopReview(review: Partial<ShopReview>): Promise<ShopReview>;
  updateShopReview(reviewId: string, updates: Partial<ShopReview>): Promise<ShopReview | null>;
  deleteShopReview(reviewId: string): Promise<boolean>;
  getShopReviewsByUserId(userId: string): Promise<ShopReview[]>;
  
  // Shop settings operations
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings | null>;
  createShopSettings(settings: Partial<ShopSettings>): Promise<ShopSettings | null>;
  
  // Shop favorites
  toggleShopFavorite(shopId: string, userId: string): Promise<boolean>;
  isShopFavorited(shopId: string, userId: string): Promise<boolean>;
  getUserFavoriteShops(userId: string): Promise<Shop[]>;
  getFavoriteShops(userId: string): Promise<Shop[]>;
  addShopToFavorites(userId: string, shopId: string): Promise<boolean>;
  removeShopFromFavorites(userId: string, shopId: string): Promise<boolean>;
  
  // Featured and related shops
  getFeaturedShops(limit?: number): Promise<Shop[]>;
  getRelatedShops(shopId: string, limit?: number): Promise<Shop[]>;
  
  // Order operations
  getUserOrders(userId: string, status?: string): Promise<Order[]>;
  getSellerOrders(userId: string): Promise<Order[]>;
  getOrdersByShopId(shopId: string, status?: string): Promise<Order[]>;
  getShopOrders(shopId: string): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: string): Promise<boolean>;
  updatePaymentStatus(orderId: string, paymentStatus: string): Promise<boolean>;
  createOrder(orderData: Partial<Order>): Promise<Order>;
  
  // Cart operations
  addToCart(userId: string, shopItemId: string, quantity: number): Promise<boolean>;
}
