
import { 
  Shop, 
  ShopItem, 
  ShopStatus, 
  ShopItemStatus, 
  Order, 
  ShopReview,
  PaymentMethod,
  OrderStatus,
  PaymentStatus
} from '@/core/shop/domain/types';

export interface IShopRepository {
  // Shop operations
  getShopById(id: string): Promise<Shop | null>;
  getShopByUserId(userId: string): Promise<Shop | null>;
  createShop(shop: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop | null>;
  updateShop(id: string, shop: Partial<Shop>): Promise<Shop | null>;
  getShopsByStatus(status: ShopStatus): Promise<Shop[]>;
  
  // ShopItem operations
  addShopItems(shopId: string, items: Omit<ShopItem, 'id' | 'created_at' | 'updated_at'>[]): Promise<boolean>;
  getShopItems(shopId: string): Promise<ShopItem[]>;
  getShopItemById(id: string): Promise<ShopItem | null>;
  updateShopItem(id: string, item: Partial<ShopItem>): Promise<ShopItem | null>;
  updateShopItemStatus(id: string, status: ShopItemStatus): Promise<boolean>;
  
  // Order operations
  getShopOrders(shopId: string): Promise<Order[]>;
  createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | null>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean>;
  
  // Favorites operations
  isShopFavorited(userId: string, shopId: string): Promise<boolean>;
  addShopToFavorites(userId: string, shopId: string): Promise<boolean>;
  removeShopFromFavorites(userId: string, shopId: string): Promise<boolean>;
  getFavoriteShops(userId: string): Promise<Shop[]>;
  
  // Shop reviews
  getShopReviews(shopId: string): Promise<ShopReview[]>;
  
  // Cart operations
  addToCart(userId: string, itemId: string, quantity: number): Promise<boolean>;
}
