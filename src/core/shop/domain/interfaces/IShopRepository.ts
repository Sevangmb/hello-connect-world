
import { 
  Shop, 
  ShopItem, 
  ShopReview, 
  Order,
  ShopSettings,
  ShopStatus,
  OrderStatus
} from '../types';

export interface IShopRepository {
  // Shop operations
  getShopById(id: string): Promise<Shop | null>;
  getShops(limit?: number, offset?: number): Promise<Shop[]>;
  getUserShop(userId: string): Promise<Shop | null>;
  createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'average_rating'>): Promise<Shop | null>;
  updateShop(id: string, shopData: Partial<Shop>): Promise<Shop | null>;
  updateShopStatus(shopId: string, status: ShopStatus): Promise<boolean>;

  // Shop items operations
  getShopItems(shopId: string): Promise<ShopItem[]>;
  getShopItemById(itemId: string): Promise<ShopItem | null>;
  addShopItem(item: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem | null>;
  updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem | null>;
  updateShopItemStatus(itemId: string, status: string): Promise<boolean>;
  deleteShopItem(itemId: string): Promise<boolean>;

  // Shop orders operations
  getShopOrders(shopId: string): Promise<Order[]>;
  getOrderById(orderId: string): Promise<Order | null>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean>;
  createOrder(orderData: Omit<Order, 'id' | 'created_at'>): Promise<Order | null>;

  // Shop reviews operations
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  addShopReview(review: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview | null>;

  // Shop settings operations
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<boolean>;

  // User orders operations
  getUserOrders(userId: string): Promise<Order[]>;
}
