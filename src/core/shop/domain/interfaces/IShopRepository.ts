
import { Shop, ShopItem, ShopReview, ShopSettings, Order, OrderStatus, ShopStatus } from '../types';

export interface IShopRepository {
  // Shop operations
  getShopById(id: string): Promise<Shop | null>;
  getShopByUserId(userId: string): Promise<Shop | null>; 
  getShops(limit?: number, offset?: number): Promise<Shop[]>;
  createShop(shop: Partial<Shop>): Promise<Shop>;
  updateShop(id: string, shopData: Partial<Shop>): Promise<Shop>;
  updateShopStatus(shopId: string, status: ShopStatus): Promise<boolean>;
  
  // Shop item operations
  getShopItems(shopId: string): Promise<ShopItem[]>;
  getShopItemById(id: string): Promise<ShopItem | null>;
  createShopItem(item: Partial<ShopItem>): Promise<ShopItem>;
  updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem>;
  updateShopItemStatus(itemId: string, status: string): Promise<boolean>;
  deleteShopItem(itemId: string): Promise<boolean>;
  
  // Shop review operations
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  addShopReview(review: Partial<ShopReview>): Promise<ShopReview>;
  
  // Shop settings operations
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings>;
  
  // Order operations
  getShopOrders(shopId: string): Promise<Order[]>;
  getUserOrders(userId: string): Promise<Order[]>;
  getOrderById(orderId: string): Promise<Order | null>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean>;
}
