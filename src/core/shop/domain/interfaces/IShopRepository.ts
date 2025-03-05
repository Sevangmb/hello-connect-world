
import { 
  Shop, 
  ShopItem, 
  ShopReview, 
  Order,
  OrderStatus,
  ShopSettings,
  ShopStatus
} from '../types';

export interface IShopRepository {
  // Shop methods
  getShopById(id: string): Promise<Shop | null>;
  getUserShop(userId: string): Promise<Shop | null>;
  createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop | null>;
  updateShop(shopData: Partial<Shop> & { id: string }): Promise<Shop | null>;
  updateShopStatus(shopId: string, status: ShopStatus): Promise<boolean>;
  
  // Shop items methods
  getShopItems(shopId: string): Promise<ShopItem[]>;
  addShopItem(item: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem | null>;
  updateShopItem(item: Partial<ShopItem> & { id: string }): Promise<ShopItem | null>;
  updateShopItemStatus(itemId: string, status: string): Promise<boolean>;
  deleteShopItem(itemId: string): Promise<boolean>;
  
  // Order methods
  getShopOrders(shopId: string): Promise<Order[]>;
  getOrderById(orderId: string): Promise<Order | null>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean>;
  createOrder(orderData: Omit<Order, 'id' | 'created_at'>): Promise<Order | null>;
  
  // Review methods
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  
  // Settings methods
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<boolean>;
}
