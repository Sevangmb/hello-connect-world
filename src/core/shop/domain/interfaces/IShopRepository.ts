
import { Order, OrderStatus, Shop, ShopItem, ShopItemStatus, ShopReview, ShopSettings } from "@/core/shop/domain/types";

export interface IShopRepository {
  // Shop methods
  getShopById(id: string): Promise<Shop | null>;
  getShopByUserId(userId: string): Promise<Shop | null>;
  getShops(): Promise<Shop[]>;
  createShop(shopData: Omit<Shop, "id" | "created_at" | "updated_at" | "average_rating">): Promise<Shop>;
  updateShop(id: string, shopData: Partial<Shop>): Promise<Shop>;
  
  // Shop items methods
  getShopItems(shopId: string): Promise<ShopItem[]>;
  getShopItemById(id: string): Promise<ShopItem | null>;
  createShopItem(item: Omit<ShopItem, "id" | "created_at" | "updated_at">): Promise<ShopItem>;
  updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem>;
  updateShopItemStatus(itemId: string, status: ShopItemStatus): Promise<boolean>;
  deleteShopItem(id: string): Promise<boolean>;
  
  // Shop reviews methods
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  addShopReview(review: Omit<ShopReview, "id" | "created_at" | "updated_at">): Promise<ShopReview>;
  
  // Orders methods
  getShopOrders(shopId: string): Promise<Order[]>;
  getUserOrders(userId: string): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  createOrder(orderData: Omit<Order, "id" | "created_at">): Promise<Order>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean>;
  
  // Shop settings methods
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings>;
  
  // Favorites methods
  getFavoriteShops(userId: string): Promise<Shop[]>;
  checkIfFavorited(userId: string, shopId: string): Promise<boolean>;
  addFavoriteShop(userId: string, shopId: string): Promise<boolean>;
  removeFavoriteShop(userId: string, shopId: string): Promise<boolean>;
}
