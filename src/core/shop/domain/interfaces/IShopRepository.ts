
import { Shop, ShopItem, ShopReview, ShopSettings, Order, OrderStatus, PaymentMethod, DeliveryOption } from '@/core/shop/domain/types';

export interface IShopRepository {
  getShopById(id: string): Promise<Shop | null>;
  getShopByUserId(userId: string): Promise<Shop | null>;
  getAllShops(): Promise<Shop[]>;
  createShop(shop: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'average_rating'>): Promise<Shop>;
  updateShop(id: string, shop: Partial<Shop>): Promise<Shop>;
  updateShopStatus(id: string, status: Shop['status']): Promise<boolean>;
  
  // Shop items operations
  getShopItems(shopId: string): Promise<ShopItem[]>;
  getShopItemById(id: string): Promise<ShopItem | null>;
  createShopItem(item: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem>;
  updateShopItem(id: string, item: Partial<ShopItem>): Promise<ShopItem>;
  updateShopItemStatus(id: string, status: ShopItem['status']): Promise<boolean>;
  deleteShopItem(id: string): Promise<boolean>;
  
  // Shop reviews
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  addShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview>;
  
  // Orders
  getShopOrders(shopId: string): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<boolean>;
  
  // Shop settings
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  createShopSettings(settings: Omit<ShopSettings, 'id' | 'created_at' | 'updated_at'>): Promise<ShopSettings>;
  updateShopSettings(id: string, settings: Partial<ShopSettings>): Promise<boolean>;
}
