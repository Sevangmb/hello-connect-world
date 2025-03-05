
import { 
  Shop, 
  ShopItem, 
  ShopReview, 
  ShopItemStatus, 
  Order, 
  OrderStatus, 
  ShopSettings 
} from '../types';

export interface IShopRepository {
  getShops(): Promise<Shop[]>;
  getShopById(id: string): Promise<Shop | null>;
  getShopByUserId(userId: string): Promise<Shop | null>;
  getShopsByStatus(status: string): Promise<Shop[]>;
  createShop(shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop>;
  updateShop(id: string, shopData: Partial<Shop>): Promise<Shop>;
  
  getShopItems(shopId: string): Promise<ShopItem[]>;
  getShopItemById(id: string): Promise<ShopItem | null>;
  createShopItem(itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>): Promise<ShopItem>;
  updateShopItem(id: string, itemData: Partial<ShopItem>): Promise<ShopItem>;
  updateShopItemStatus(id: string, status: ShopItemStatus): Promise<boolean>;
  
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  createShopReview(reviewData: Omit<ShopReview, 'id' | 'created_at' | 'updated_at'>): Promise<ShopReview>;
  
  // Add missing order-related methods
  getOrdersByShop(shopId: string): Promise<Order[]>;
  getOrdersByCustomer(customerId: string): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean>;
  
  // Add missing favorites-related methods
  isShopFavorited(shopId: string): Promise<boolean>;
  addShopToFavorites(shopId: string): Promise<boolean>;
  removeShopFromFavorites(shopId: string): Promise<boolean>;
  getFavoriteShops(): Promise<Shop[]>;
  
  // Add settings methods if needed
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  updateShopSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings>;
}
